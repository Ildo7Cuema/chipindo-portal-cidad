-- Create event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_phone VARCHAR(100),
    participant_age INTEGER,
    participant_gender VARCHAR(50),
    participant_address TEXT,
    participant_occupation VARCHAR(255),
    participant_organization VARCHAR(255),
    special_needs TEXT,
    dietary_restrictions TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(100),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(participant_email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_date ON event_registrations(registration_date);

-- Create unique constraint to prevent duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_registrations_unique 
ON event_registrations(event_id, participant_email);

-- Create RLS policies
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to registrations (only for confirmed registrations)
CREATE POLICY "Public can view confirmed registrations" ON event_registrations
    FOR SELECT USING (status = 'confirmed');

-- Policy for public insert access (anyone can register)
CREATE POLICY "Public can register for events" ON event_registrations
    FOR INSERT WITH CHECK (true);

-- Policy for public update access (participants can update their own registrations)
CREATE POLICY "Participants can update own registrations" ON event_registrations
    FOR UPDATE USING (participant_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy for admin full access
CREATE POLICY "Admin has full access to registrations" ON event_registrations
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin' OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Create function to get event registrations
CREATE OR REPLACE FUNCTION get_event_registrations(
    p_event_id INTEGER DEFAULT NULL,
    p_status VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    event_id INTEGER,
    participant_name VARCHAR,
    participant_email VARCHAR,
    participant_phone VARCHAR,
    participant_age INTEGER,
    participant_gender VARCHAR,
    participant_address TEXT,
    participant_occupation VARCHAR,
    participant_organization VARCHAR,
    special_needs TEXT,
    dietary_restrictions TEXT,
    emergency_contact_name VARCHAR,
    emergency_contact_phone VARCHAR,
    registration_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        er.id,
        er.event_id,
        er.participant_name,
        er.participant_email,
        er.participant_phone,
        er.participant_age,
        er.participant_gender,
        er.participant_address,
        er.participant_occupation,
        er.participant_organization,
        er.special_needs,
        er.dietary_restrictions,
        er.emergency_contact_name,
        er.emergency_contact_phone,
        er.registration_date,
        er.status,
        er.notes,
        er.created_at
    FROM event_registrations er
    WHERE (p_event_id IS NULL OR er.event_id = p_event_id)
      AND (p_status IS NULL OR er.status = p_status)
    ORDER BY er.registration_date DESC;
END;
$$;

-- Create function to register for an event
CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id INTEGER,
    p_participant_name VARCHAR,
    p_participant_email VARCHAR,
    p_participant_phone VARCHAR DEFAULT NULL,
    p_participant_age INTEGER DEFAULT NULL,
    p_participant_gender VARCHAR DEFAULT NULL,
    p_participant_address TEXT DEFAULT NULL,
    p_participant_occupation VARCHAR DEFAULT NULL,
    p_participant_organization VARCHAR DEFAULT NULL,
    p_special_needs TEXT DEFAULT NULL,
    p_dietary_restrictions TEXT DEFAULT NULL,
    p_emergency_contact_name VARCHAR DEFAULT NULL,
    p_emergency_contact_phone VARCHAR DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_registration_id INTEGER;
    event_max_participants INTEGER;
    current_participants INTEGER;
BEGIN
    -- Check if event exists and has available spots
    SELECT e.max_participants, e.current_participants
    INTO event_max_participants, current_participants
    FROM events e
    WHERE e.id = p_event_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Event not found';
    END IF;
    
    -- Check if event is full
    IF event_max_participants > 0 AND current_participants >= event_max_participants THEN
        RAISE EXCEPTION 'Event is full';
    END IF;
    
    -- Check if user is already registered
    IF EXISTS (
        SELECT 1 FROM event_registrations 
        WHERE event_id = p_event_id AND participant_email = p_participant_email
    ) THEN
        RAISE EXCEPTION 'Already registered for this event';
    END IF;
    
    -- Insert registration
    INSERT INTO event_registrations (
        event_id, participant_name, participant_email, participant_phone,
        participant_age, participant_gender, participant_address,
        participant_occupation, participant_organization, special_needs,
        dietary_restrictions, emergency_contact_name, emergency_contact_phone
    ) VALUES (
        p_event_id, p_participant_name, p_participant_email, p_participant_phone,
        p_participant_age, p_participant_gender, p_participant_address,
        p_participant_occupation, p_participant_organization, p_special_needs,
        p_dietary_restrictions, p_emergency_contact_name, p_emergency_contact_phone
    ) RETURNING id INTO new_registration_id;
    
    -- Update event participant count
    UPDATE events 
    SET current_participants = current_participants + 1,
        updated_at = NOW()
    WHERE id = p_event_id;
    
    RETURN new_registration_id;
END;
$$;

-- Create function to update registration status
CREATE OR REPLACE FUNCTION update_registration_status(
    p_registration_id INTEGER,
    p_status VARCHAR,
    p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_id INTEGER;
    old_status VARCHAR;
BEGIN
    -- Get current registration info
    SELECT er.event_id, er.status
    INTO event_id, old_status
    FROM event_registrations er
    WHERE er.id = p_registration_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update registration
    UPDATE event_registrations 
    SET status = p_status,
        notes = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_registration_id;
    
    -- Update event participant count if status changed
    IF old_status != p_status THEN
        IF p_status = 'confirmed' AND old_status != 'confirmed' THEN
            -- Registration confirmed, increment count
            UPDATE events 
            SET current_participants = current_participants + 1,
                updated_at = NOW()
            WHERE id = event_id;
        ELSIF old_status = 'confirmed' AND p_status != 'confirmed' THEN
            -- Registration unconfirmed, decrement count
            UPDATE events 
            SET current_participants = GREATEST(current_participants - 1, 0),
                updated_at = NOW()
            WHERE id = event_id;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Create function to get registration statistics
CREATE OR REPLACE FUNCTION get_event_registration_stats(p_event_id INTEGER)
RETURNS TABLE (
    total_registrations INTEGER,
    confirmed_registrations INTEGER,
    pending_registrations INTEGER,
    cancelled_registrations INTEGER,
    attended_registrations INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_registrations,
        COUNT(*) FILTER (WHERE status = 'confirmed')::INTEGER as confirmed_registrations,
        COUNT(*) FILTER (WHERE status = 'pending')::INTEGER as pending_registrations,
        COUNT(*) FILTER (WHERE status = 'cancelled')::INTEGER as cancelled_registrations,
        COUNT(*) FILTER (WHERE status = 'attended')::INTEGER as attended_registrations
    FROM event_registrations
    WHERE event_id = p_event_id;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_registrations_updated_at();

-- Insert sample registrations for testing
INSERT INTO event_registrations (
    event_id, participant_name, participant_email, participant_phone,
    participant_age, participant_gender, participant_occupation, status
) VALUES
(1, 'Maria Silva', 'maria.silva@email.com', '+244 123 456 789', 28, 'Feminino', 'Professora', 'confirmed'),
(1, 'João Santos', 'joao.santos@email.com', '+244 987 654 321', 35, 'Masculino', 'Agricultor', 'confirmed'),
(2, 'Ana Costa', 'ana.costa@email.com', '+244 555 123 456', 42, 'Feminino', 'Comerciante', 'pending'),
(3, 'Pedro Oliveira', 'pedro.oliveira@email.com', '+244 777 888 999', 25, 'Masculino', 'Estudante', 'confirmed');

-- Update event participant counts
UPDATE events 
SET current_participants = (
    SELECT COUNT(*) 
    FROM event_registrations 
    WHERE event_id = events.id AND status = 'confirmed'
); 
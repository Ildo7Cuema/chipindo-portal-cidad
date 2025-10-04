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

-- Policy for admin full access
CREATE POLICY "Admin has full access to registrations" ON event_registrations
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'content_manager')
        )
    );

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
    SET current_participants = (SELECT current_participants FROM events WHERE id = p_event_id) + 1,
        updated_at = NOW()
    WHERE id = p_event_id;
    
    RETURN new_registration_id;
END;
$$;

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
    old_status VARCHAR;
    event_id INTEGER;
    should_decrement BOOLEAN := false;
    should_increment BOOLEAN := false;
BEGIN
    -- Get current status and event_id
    SELECT status, event_id INTO old_status, event_id
    FROM event_registrations
    WHERE id = p_registration_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Determine if we need to update participant count
    IF old_status = 'confirmed' AND p_status != 'confirmed' THEN
        should_decrement := true;
    ELSIF old_status != 'confirmed' AND p_status = 'confirmed' THEN
        should_increment := true;
    END IF;
    
    -- Update registration
    UPDATE event_registrations 
    SET status = p_status,
        notes = p_notes,
        updated_at = NOW()
    WHERE id = p_registration_id;
    
    -- Update event participant count if needed
    IF should_decrement THEN
        UPDATE events 
        SET current_participants = GREATEST(current_participants - 1, 0),
            updated_at = NOW()
        WHERE id = event_id;
    ELSIF should_increment THEN
        UPDATE events 
        SET current_participants = current_participants + 1,
            updated_at = NOW()
        WHERE id = event_id;
    END IF;
    
    RETURN true;
END;
$$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON event_registrations TO anon, authenticated;
GRANT USAGE ON SEQUENCE event_registrations_id_seq TO anon, authenticated;
GRANT EXECUTE ON FUNCTION register_for_event TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_event_registrations TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_registration_status TO anon, authenticated; 
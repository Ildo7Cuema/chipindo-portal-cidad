-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    organizer VARCHAR(255),
    contact VARCHAR(100),
    email VARCHAR(255),
    website VARCHAR(255),
    price VARCHAR(100) DEFAULT 'Gratuito',
    max_participants INTEGER DEFAULT 0,
    current_participants INTEGER DEFAULT 0,
    category VARCHAR(100) DEFAULT 'community',
    status VARCHAR(50) DEFAULT 'upcoming',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);

-- Insert sample events
INSERT INTO events (title, description, date, event_time, location, organizer, contact, email, category, status, featured) VALUES
(
    'Festival Cultural de Chipindo',
    'Celebração da cultura local com música, dança e artesanato tradicional',
    '2025-08-15',
    '18:00:00',
    'Praça Central de Chipindo',
    'Câmara Municipal de Chipindo',
    '+244 123 456 789',
    'cultura@chipindo.gov.ao',
    'cultural',
    'upcoming',
    true
),
(
    'Feira de Agricultura',
    'Exposição de produtos agrícolas locais e demonstrações de técnicas modernas',
    '2025-09-20',
    '09:00:00',
    'Mercado Municipal',
    'Direção de Agricultura',
    '+244 987 654 321',
    'agricultura@chipindo.gov.ao',
    'business',
    'upcoming',
    false
),
(
    'Campeonato de Futebol Local',
    'Torneio de futebol entre equipas locais',
    '2025-07-30',
    '15:00:00',
    'Estádio Municipal',
    'Direção de Desporto',
    '+244 555 123 456',
    'desporto@chipindo.gov.ao',
    'sports',
    'upcoming',
    false
),
(
    'Workshop de Empreendedorismo',
    'Formação sobre criação e gestão de pequenos negócios',
    '2025-08-10',
    '14:00:00',
    'Sala de Conferências',
    'Direção de Economia',
    '+244 777 888 999',
    'economia@chipindo.gov.ao',
    'educational',
    'upcoming',
    true
),
(
    'Limpeza Comunitária',
    'Iniciativa de limpeza e preservação ambiental',
    '2025-07-25',
    '08:00:00',
    'Várias localizações',
    'Direção de Ambiente',
    '+244 111 222 333',
    'ambiente@chipindo.gov.ao',
    'community',
    'upcoming',
    false
);

-- Create RPC functions for events management
CREATE OR REPLACE FUNCTION get_events(
    p_category VARCHAR DEFAULT NULL,
    p_status VARCHAR DEFAULT NULL,
    p_featured BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    description TEXT,
    date DATE,
    event_time TIME,
    location VARCHAR,
    organizer VARCHAR,
    contact VARCHAR,
    email VARCHAR,
    website VARCHAR,
    price VARCHAR,
    max_participants INTEGER,
    current_participants INTEGER,
    category VARCHAR,
    status VARCHAR,
    featured BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.date,
        e.event_time,
        e.location,
        e.organizer,
        e.contact,
        e.email,
        e.website,
        e.price,
        e.max_participants,
        e.current_participants,
        e.category,
        e.status,
        e.featured,
        e.created_at,
        e.updated_at
    FROM events e
    WHERE (p_category IS NULL OR e.category = p_category)
      AND (p_status IS NULL OR e.status = p_status)
      AND (p_featured IS NULL OR e.featured = p_featured)
    ORDER BY e.date ASC, e.event_time ASC;
END;
$$;

CREATE OR REPLACE FUNCTION create_event(
    p_title VARCHAR,
    p_description TEXT,
    p_date DATE,
    p_event_time TIME,
    p_location VARCHAR,
    p_organizer VARCHAR,
    p_contact VARCHAR,
    p_email VARCHAR,
    p_website VARCHAR DEFAULT NULL,
    p_price VARCHAR DEFAULT 'Gratuito',
    p_max_participants INTEGER DEFAULT 0,
    p_category VARCHAR DEFAULT 'community',
    p_status VARCHAR DEFAULT 'upcoming',
    p_featured BOOLEAN DEFAULT false
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_event_id INTEGER;
BEGIN
    INSERT INTO events (
        title, description, date, event_time, location, organizer,
        contact, email, website, price, max_participants,
        category, status, featured
    ) VALUES (
        p_title, p_description, p_date, p_event_time, p_location, p_organizer,
        p_contact, p_email, p_website, p_price, p_max_participants,
        p_category, p_status, p_featured
    ) RETURNING id INTO new_event_id;
    
    RETURN new_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_event(
    p_id INTEGER,
    p_title VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_date DATE DEFAULT NULL,
    p_event_time TIME DEFAULT NULL,
    p_location VARCHAR DEFAULT NULL,
    p_organizer VARCHAR DEFAULT NULL,
    p_contact VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_website VARCHAR DEFAULT NULL,
    p_price VARCHAR DEFAULT NULL,
    p_max_participants INTEGER DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_status VARCHAR DEFAULT NULL,
    p_featured BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE events SET
        title = COALESCE(p_title, title),
        description = COALESCE(p_description, description),
        date = COALESCE(p_date, date),
        event_time = COALESCE(p_event_time, event_time),
        location = COALESCE(p_location, location),
        organizer = COALESCE(p_organizer, organizer),
        contact = COALESCE(p_contact, contact),
        email = COALESCE(p_email, email),
        website = COALESCE(p_website, website),
        price = COALESCE(p_price, price),
        max_participants = COALESCE(p_max_participants, max_participants),
        category = COALESCE(p_category, category),
        status = COALESCE(p_status, status),
        featured = COALESCE(p_featured, featured),
        updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION delete_event(p_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM events WHERE id = p_id;
    RETURN FOUND;
END;
$$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_events_updated_at();

-- Set up Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public can view events" ON events
    FOR SELECT USING (true);

-- Policy for authenticated users to manage events (admin only)
CREATE POLICY "Authenticated users can manage events" ON events
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'content_manager')
        )
    );

-- Grant permissions
GRANT SELECT ON events TO anon, authenticated;
GRANT ALL ON events TO authenticated;
GRANT USAGE ON SEQUENCE events_id_seq TO authenticated; 
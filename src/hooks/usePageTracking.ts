import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const VISITOR_ID_KEY = 'chipindo_visitor_id';

export const usePageTracking = () => {
    const location = useLocation();
    const initialized = useRef(false);

    useEffect(() => {
        // Get or create persistent visitor ID
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
            visitorId = uuidv4();
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        const trackVisit = async () => {
            try {
                await supabase.from('site_visits').insert({
                    page_path: location.pathname,
                    visitor_id: visitorId,
                    user_agent: navigator.userAgent
                });
            } catch (error) {
                console.error('Error tracking visit:', error);
            }
        };

        trackVisit();
    }, [location.pathname]);
};

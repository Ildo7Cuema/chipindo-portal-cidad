import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';

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
                // Parse User Agent
                const parser = new UAParser();
                const result = parser.getResult();

                // Get IP and Location Data
                let ipData = {
                    ip: undefined,
                    city: undefined,
                    region: undefined,
                    country_name: undefined
                };

                try {
                    const response = await fetch('https://ipapi.co/json/');
                    if (response.ok) {
                        const data = await response.json();
                        ipData = data;
                    }
                } catch (e) {
                    console.warn('Could not fetch IP location data', e);
                }

                await supabase.from('site_visits').insert({
                    page_path: location.pathname,
                    visitor_id: visitorId,
                    user_agent: navigator.userAgent,
                    ip_address: ipData.ip,
                    city: ipData.city,
                    region: ipData.region,
                    country: ipData.country_name,
                    device_type: result.device.type || 'desktop',
                    browser: `${result.browser.name} ${result.browser.version}`,
                    os: `${result.os.name} ${result.os.version}`
                });
            } catch (error) {
                console.error('Error tracking visit:', error);
            }
        };

        trackVisit();
    }, [location.pathname]);
};


import { supabase } from '@/lib/supabase';

export const useAnalytics = () => {
  const trackEvent = async (eventName: string) => {
    try {
      console.log(`Analytics: tracking event ${eventName}`);
      
      const { error } = await supabase.rpc('increment_analytics_event', {
        _event_name: eventName
      });
      
      if (error) {
        console.error('Analytics error:', error);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  return { trackEvent };
};

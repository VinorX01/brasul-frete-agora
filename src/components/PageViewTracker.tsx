
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PageViewTrackerProps {
  eventName: string;
}

const PageViewTracker = ({ eventName }: PageViewTrackerProps) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent(eventName);
  }, [trackEvent, eventName]);

  return null; // This component doesn't render anything
};

export default PageViewTracker;

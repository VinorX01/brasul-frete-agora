
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface PromotionalBanner {
  id: string;
  image_url: string;
  redirect_url: string;
  is_active: boolean;
  created_at: string;
}

const PromotionalBanner = () => {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('promotional_banners')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching promotional banners:', error);
          return;
        }

        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (error) {
        console.error('Error fetching promotional banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex(prevIndex => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 15000); // 15 segundos

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleBannerClick = (redirectUrl: string) => {
    window.open(redirectUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center w-full mb-6 px-4">
        <div className="w-full max-w-md">
          <div 
            className="bg-white rounded-2xl p-1 shadow-sm w-full"
            style={{
              aspectRatio: '2/1'
            }}
          >
            <div className="w-full h-full bg-gray-300 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="flex justify-center w-full mb-6 px-4">
      <div className="w-full max-w-md">
        <div 
          className="bg-white rounded-2xl p-1 shadow-sm w-full"
          style={{
            aspectRatio: '2/1'
          }}
        >
          <div 
            className="w-full h-full rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => handleBannerClick(currentBanner.redirect_url)}
          >
            <img 
              src={currentBanner.image_url} 
              alt="Banner promocional" 
              className="w-full h-full object-cover rounded-xl" 
            />
          </div>
        </div>
        
        {banners.length > 1 && (
          <div className="flex justify-center space-x-1 mt-3">
            {banners.map((_, index) => (
              <div 
                key={index} 
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentBannerIndex ? 'bg-primary' : 'bg-gray-300'
                }`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalBanner;

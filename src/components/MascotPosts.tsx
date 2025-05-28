
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MascotPost {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
}

const MascotPosts = () => {
  const [posts, setPosts] = useState<MascotPost[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('mascot_posts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching mascot posts:', error);
          return;
        }

        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching mascot posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 1) {
      const interval = setInterval(() => {
        setIsSliding(true);
        
        setTimeout(() => {
          setCurrentPostIndex((prevIndex) => 
            prevIndex === posts.length - 1 ? 0 : prevIndex + 1
          );
          setIsSliding(false);
        }, 300); // Half of the transition duration
      }, 10000); // 10 segundos

      return () => clearInterval(interval);
    }
  }, [posts.length]);

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('mascot_posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId);

      if (error) {
        console.error('Error updating likes:', error);
        return;
      }

      // Atualizar estado local
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { ...p, likes_count: p.likes_count + 1 }
            : p
        )
      );
      
      setLikedPosts(prev => new Set(prev).add(postId));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm h-[200px]">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
          <div>
            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
            <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const currentPost = posts[currentPostIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-sm h-[200px]">
      <div 
        className={`bg-white rounded-2xl p-4 h-full flex flex-col transition-transform duration-600 ease-in-out ${
          isSliding ? 'transform -translate-x-full' : 'transform translate-x-0'
        }`}
      >
        <div className="flex items-center mb-3">
          <img 
            src="/lovable-uploads/3b6b5518-b391-4631-9e1c-e22b9ce9fe48.png" 
            alt="Bino Estradeiro" 
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800">Bino Estradeiro</p>
            <p className="text-xs text-gray-500">@bino</p>
          </div>
        </div>
        
        <div className="mb-3 flex-grow overflow-hidden">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-6">
            {currentPost.content}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={() => handleLike(currentPost.id)}
            className={`flex items-center space-x-1 transition-colors ${
              likedPosts.has(currentPost.id) 
                ? 'text-red-500' 
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart 
              className={`w-4 h-4 ${
                likedPosts.has(currentPost.id) ? 'fill-current' : ''
              }`} 
            />
            <span className="text-xs">{currentPost.likes_count}</span>
          </button>
          
          {posts.length > 1 && (
            <div className="flex space-x-1">
              {posts.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentPostIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MascotPosts;


import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const LastFreightUpdate = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastFreight = async () => {
      try {
        const { data, error } = await supabase
          .from('freights')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching last freight:', error);
          return;
        }

        if (data && data.length > 0) {
          setLastUpdate(new Date(data[0].created_at));
        }
      } catch (error) {
        console.error('Error fetching last freight:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastFreight();
  }, []);

  const formatUpdateTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const updateDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const timeString = date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (updateDate.getTime() === today.getTime()) {
      return `Hoje, ${timeString}h`;
    } else if (updateDate.getTime() === yesterday.getTime()) {
      return `Ontem, ${timeString}h`;
    } else {
      return `${date.toLocaleDateString('pt-BR')}, ${timeString}h`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-3 mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <span className="text-xs text-gray-500">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-3 mb-6 shadow-sm">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-bright"></div>
        <span className="text-xs text-gray-600">
          Fretes atualizados: {lastUpdate ? formatUpdateTime(lastUpdate) : 'Não disponível'}
        </span>
      </div>
    </div>
  );
};

export default LastFreightUpdate;

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Market } from '@/types/market';
import { supabase } from '@/integrations/supabase/client';



interface MarketContextType {
  markets: Market[];
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  updateMarketChecklist: (marketId: string, checklistItemId: string) => Promise<void>;
  addChecklistItem: (marketId: string, newItem: { id: string; label: string; completed: boolean }) => Promise<void>;
  addMarket: (market: Market) => Promise<void>;
  updateMarket: (market: Market) => Promise<void>;
  closeMarket: (marketId: string, actualRevenue: number) => Promise<void>;
  getUpcomingMarkets: () => Market[];
  getPastMarkets: () => Market[];
  isLoading: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

// Helper function to convert database row to Market object
const convertDbToMarket = (dbMarket: any): Market => ({
  id: dbMarket.id,
  name: dbMarket.name,
  date: dbMarket.date,
  loadInTime: dbMarket.load_in_time || 'TBA',
  marketStartTime: dbMarket.market_start_time || 'TBA',
  marketEndTime: dbMarket.market_end_time || 'TBA',
  address: {
    street: dbMarket.street,
    city: dbMarket.city,
    state: dbMarket.state,
    zipCode: dbMarket.zip_code,
    country: dbMarket.country || 'US'
  },
  fee: parseFloat(dbMarket.fee),
  estimatedProfit: parseFloat(dbMarket.estimated_profit),
  actualRevenue: dbMarket.actual_revenue ? parseFloat(dbMarket.actual_revenue) : undefined,
  status: dbMarket.status,
  description: dbMarket.description,
  organizerContact: dbMarket.organizer_contact,
  requirements: dbMarket.requirements || [],
  checklist: dbMarket.checklist || [],
  completed: dbMarket.completed,
  completedDate: dbMarket.completed_date
});

// Helper function to convert Market object to database format
const convertMarketToDb = (market: Market, userId: string) => ({
  id: market.id,
  user_id: userId,
  name: market.name,
  date: market.date,
  load_in_time: market.loadInTime === 'TBA' ? null : market.loadInTime,
  market_start_time: market.marketStartTime === 'TBA' ? null : market.marketStartTime,
  market_end_time: market.marketEndTime === 'TBA' ? null : market.marketEndTime,
  street: market.address.street,
  city: market.address.city,
  state: market.address.state,
  zip_code: market.address.zipCode,
  country: market.address.country || 'US',
  fee: market.fee,
  estimated_profit: market.estimatedProfit,
  actual_revenue: market.actualRevenue,
  status: market.status,
  description: market.description,
  organizer_contact: market.organizerContact,
  requirements: market.requirements || [],
  checklist: market.checklist || [],
  completed: market.completed || false,
  completed_date: market.completedDate
});

// Helper function to get auth token and make Supabase REST API calls
const getAuthToken = () => {
  const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
  if (authToken) {
    try {
      const parsed = JSON.parse(authToken);
      return parsed.access_token;
    } catch (e) {
      console.error('Failed to parse auth token:', e);
    }
  }
  return null;
};

const supabaseFetch = async (path: string, options: RequestInit = {}) => {
  const accessToken = getAuthToken();
  const response = await fetch(`https://drlnhierscrldlijdhdo.supabase.co/rest/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }

  return data;
};

export function MarketProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load user's markets from database
  useEffect(() => {
    const loadMarkets = async (user: any) => {
      if (!user) {
        setMarkets([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Loading markets for user:', user.id);
        const dbMarkets = await supabaseFetch(`/markets?user_id=eq.${user.id}&order=date.asc`, {
          method: 'GET'
        });

        if (dbMarkets && dbMarkets.length > 0) {
          const convertedMarkets = dbMarkets.map(convertDbToMarket);
          setMarkets(convertedMarkets);
        } else {
          setMarkets([]);
        }
      } catch (error) {
        console.error('Error in loadMarkets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUserId(session.user.id);
          setIsLoading(true);
          await loadMarkets(session.user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUserId(null);
          setMarkets([]);
          setIsLoading(false);
        }
      }
    );

    // Also check current user on mount
    const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
    if (authToken) {
      try {
        const parsed = JSON.parse(authToken);
        const user = parsed.user;
        if (user?.id) {
          setCurrentUserId(user.id);
          loadMarkets(user);
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Failed to parse auth token on mount:', e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  

  const updateMarketChecklist = async (marketId: string, checklistItemId: string) => {
    const market = markets.find(m => m.id === marketId);
    if (!market) return;

    const updatedChecklist = market.checklist.map(item =>
      item.id === checklistItemId
        ? { ...item, completed: !item.completed }
        : item
    );

    // Update in database
    await supabaseFetch(`/markets?id=eq.${marketId}`, {
      method: 'PATCH',
      body: JSON.stringify({ checklist: updatedChecklist })
    });

    // Update local state
    setMarkets(prev => prev.map(m =>
      m.id === marketId
        ? { ...m, checklist: updatedChecklist }
        : m
    ));
  };

  const addChecklistItem = async (marketId: string, newItem: { id: string; label: string; completed: boolean }) => {
    const market = markets.find(m => m.id === marketId);
    if (!market) return;

    const updatedChecklist = [...market.checklist, newItem];

    // Update in database
    await supabaseFetch(`/markets?id=eq.${marketId}`, {
      method: 'PATCH',
      body: JSON.stringify({ checklist: updatedChecklist })
    });

    // Update local state
    setMarkets(prev => prev.map(m =>
      m.id === marketId
        ? { ...m, checklist: updatedChecklist }
        : m
    ));
  };

  const addMarket = async (market: Market) => {
    try {
      if (!currentUserId) {
        throw new Error('You must be logged in to add a market');
      }

      const dbMarket = convertMarketToDb(market, currentUserId);
      const { id, ...dbMarketWithoutId } = dbMarket;

      const responseData = await supabaseFetch('/markets', {
        method: 'POST',
        body: JSON.stringify(dbMarketWithoutId)
      });

      const data = Array.isArray(responseData) ? responseData[0] : responseData;
      const newMarket = convertDbToMarket(data);

      setMarkets(prev => [newMarket, ...prev]);
    } catch (error: any) {
      console.error('Error adding market to database:', error);
      throw error;
    }
  };

  const updateMarket = async (updatedMarket: Market) => {
    try {
      if (!currentUserId) return;

      const dbMarket = convertMarketToDb(updatedMarket, currentUserId);
      await supabaseFetch(`/markets?id=eq.${updatedMarket.id}`, {
        method: 'PATCH',
        body: JSON.stringify(dbMarket)
      });

      // Update local state
      setMarkets(prev => prev.map(market =>
        market.id === updatedMarket.id ? updatedMarket : market
      ));
    } catch (error) {
      console.error('Error in updateMarket:', error);
    }
  };

  const closeMarket = async (marketId: string, actualRevenue: number) => {
    try {
      const completedDate = new Date().toISOString().split('T')[0];
      await supabaseFetch(`/markets?id=eq.${marketId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'completed',
          actual_revenue: actualRevenue,
          completed: true,
          completed_date: completedDate
        })
      });

      // Update local state
      setMarkets(prev => prev.map(market =>
        market.id === marketId
          ? {
              ...market,
              status: "completed" as const,
              actualRevenue,
              completed: true,
              completedDate
            }
          : market
      ));
    } catch (error) {
      console.error('Error in closeMarket:', error);
    }
  };

  const getUpcomingMarkets = () => {
    return markets.filter(market => market.status !== "completed");
  };

  const getPastMarkets = () => {
    return markets.filter(market => market.status === "completed");
  };

  return (
    <MarketContext.Provider value={{
      markets,
      setMarkets,
      updateMarketChecklist,
      addChecklistItem,
      addMarket,
      updateMarket,
      closeMarket,
      getUpcomingMarkets,
      getPastMarkets,
      isLoading
    }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarkets() {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarkets must be used within a MarketProvider');
  }
  return context;
}
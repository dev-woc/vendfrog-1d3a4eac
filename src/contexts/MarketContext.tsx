import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Market } from '@/types/market';
import { supabase } from '@/integrations/supabase/client';

const getInitialMarkets = (): Market[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30);
  const lastMonth = new Date(today);
  lastMonth.setDate(today.getDate() - 30);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setDate(today.getDate() - 60);

  return [
    {
      id: "sample-1",
      name: "Downtown Farmers Market",
      date: nextWeek.toISOString().split('T')[0],
      loadInTime: "6:00 AM",
      marketStartTime: "8:00 AM",
      marketEndTime: "2:00 PM",
      address: {
        street: "123 Main Street Plaza",
        city: "Portland",
        state: "OR",
        zipCode: "97201",
        country: "US"
      },
      fee: 85,
      estimatedProfit: 400,
      status: "confirmed",
      organizerContact: "sarah@downtownmarket.com",
      requirements: ["Valid business license", "Liability insurance", "Setup by 7:30 AM"],
      checklist: [
        { id: "insurance", label: "Insurance Documents", completed: true },
        { id: "permit", label: "Business Permit", completed: true },
        { id: "inventory", label: "Inventory Prepared", completed: false },
        { id: "setup", label: "Setup Plan Ready", completed: false },
      ],
    },
    {
      id: "sample-2",
      name: "Weekend Artisan Fair",
      date: nextMonth.toISOString().split('T')[0],
      loadInTime: "8:00 AM",
      marketStartTime: "10:00 AM",
      marketEndTime: "5:00 PM",
      address: {
        street: "456 City Park Pavilion",
        city: "Portland",
        state: "OR",
        zipCode: "97202",
        country: "US"
      },
      fee: 120,
      estimatedProfit: 650,
      status: "pending",
      organizerContact: "info@artisanfair.org",
      requirements: ["Handmade items only", "Tent required", "Insurance certificate"],
      checklist: [
        { id: "insurance", label: "Insurance Documents", completed: true },
        { id: "permit", label: "Business Permit", completed: false },
        { id: "inventory", label: "Inventory Prepared", completed: false },
        { id: "setup", label: "Setup Plan Ready", completed: false },
      ],
    },
    // Past markets
    {
      id: "sample-past-1",
      name: "Winter Holiday Market",
      date: lastMonth.toISOString().split('T')[0],
      loadInTime: "7:00 AM",
      marketStartTime: "9:00 AM",
      marketEndTime: "4:00 PM",
      address: {
        street: "456 Festival Square",
        city: "Portland",
        state: "OR",
        zipCode: "97204",
        country: "US"
      },
      fee: 100,
      estimatedProfit: 500,
      actualRevenue: 580,
      status: "completed",
      organizerContact: "events@festivalsquare.com",
      requirements: ["Holiday-themed products", "Festive decorations"],
      checklist: [
        { id: "insurance", label: "Insurance Documents", completed: true },
        { id: "permit", label: "Business Permit", completed: true },
        { id: "inventory", label: "Inventory Prepared", completed: true },
        { id: "setup", label: "Setup Plan Ready", completed: true },
      ],
      completed: true,
      completedDate: lastMonth.toISOString().split('T')[0],
    },
    {
      id: "sample-past-2",
      name: "Autumn Craft Fair",
      date: twoMonthsAgo.toISOString().split('T')[0],
      loadInTime: "6:30 AM",
      marketStartTime: "8:00 AM",
      marketEndTime: "3:00 PM",
      address: {
        street: "789 Community Center",
        city: "Portland",
        state: "OR",
        zipCode: "97205",
        country: "US"
      },
      fee: 75,
      estimatedProfit: 350,
      actualRevenue: 320,
      status: "completed",
      organizerContact: "info@communitycenter.org",
      requirements: ["Handmade crafts only", "Setup by 7:30 AM"],
      checklist: [
        { id: "insurance", label: "Insurance Documents", completed: true },
        { id: "permit", label: "Business Permit", completed: true },
        { id: "inventory", label: "Inventory Prepared", completed: true },
        { id: "setup", label: "Setup Plan Ready", completed: true },
      ],
      completed: true,
      completedDate: twoMonthsAgo.toISOString().split('T')[0],
    }
  ];
};

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
        const { data: dbMarkets, error } = await supabase
          .from('markets')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) {
          console.error('Error loading markets:', error);
          setIsLoading(false);
          return;
        }

        if (dbMarkets && dbMarkets.length > 0) {
          const convertedMarkets = dbMarkets.map(convertDbToMarket);
          console.log('Loaded markets from database:', convertedMarkets);
          setMarkets(convertedMarkets);
          
          // If user has only one market, add some sample data to showcase the functionality
          if (dbMarkets.length <= 1) {
            console.log('User has limited markets, adding sample data for demo');
            await addSampleData(user.id);
          }
        } else {
          // New user - add some sample data
          console.log('New user detected, adding sample data');
          await addSampleData(user.id);
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
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
      }
      loadMarkets(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Add sample data for new users
  const addSampleData = async (userId: string) => {
    try {
      const sampleMarkets = getInitialMarkets().map(market => convertMarketToDb(market, userId));
      const { error } = await supabase
        .from('markets')
        .insert(sampleMarkets);

      if (error) {
        console.error('Error adding sample data:', error);
      } else {
        console.log('Sample data added successfully');
        // Reload markets after adding sample data
        const { data: dbMarkets, error: loadError } = await supabase
          .from('markets')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: true });

        if (!loadError && dbMarkets) {
          const convertedMarkets = dbMarkets.map(convertDbToMarket);
          setMarkets(convertedMarkets);
        }
      }
    } catch (error) {
      console.error('Error in addSampleData:', error);
    }
  };

  const updateMarketChecklist = async (marketId: string, checklistItemId: string) => {
    const market = markets.find(m => m.id === marketId);
    if (!market) return;

    const updatedChecklist = market.checklist.map(item => 
      item.id === checklistItemId 
        ? { ...item, completed: !item.completed }
        : item
    );

    // Update in database
    const { error } = await supabase
      .from('markets')
      .update({ checklist: updatedChecklist })
      .eq('id', marketId);

    if (error) {
      console.error('Error updating checklist:', error);
      return;
    }

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
    const { error } = await supabase
      .from('markets')
      .update({ checklist: updatedChecklist })
      .eq('id', marketId);

    if (error) {
      console.error('Error adding checklist item:', error);
      return;
    }

    // Update local state
    setMarkets(prev => prev.map(m => 
      m.id === marketId 
        ? { ...m, checklist: updatedChecklist }
        : m
    ));
  };

  const addMarket = async (market: Market) => {
    try {
      console.log('addMarket called with:', market);
      console.log('Current user ID from state:', currentUserId);

      if (!currentUserId) {
        console.error('No user ID in state - user not logged in');
        throw new Error('You must be logged in to add a market');
      }

      console.log('User found:', currentUserId);
      console.log('Converting market to DB format...');
      const dbMarket = convertMarketToDb(market, currentUserId);
      console.log('DB market object:', dbMarket);

      // Remove id to let database auto-generate UUID
      const { id, ...dbMarketWithoutId } = dbMarket;
      console.log('DB market without ID:', dbMarketWithoutId);

      console.log('Inserting market into database...');

      // Try direct fetch as workaround for hanging Supabase client
      console.log('Using direct fetch to Supabase REST API...');
      const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
      let accessToken = null;
      if (authToken) {
        try {
          const parsed = JSON.parse(authToken);
          accessToken = parsed.access_token;
          console.log('Access token found:', accessToken ? 'exists' : 'missing');
        } catch (e) {
          console.error('Failed to parse auth token:', e);
        }
      }

      const response = await fetch('https://drlnhierscrldlijdhdo.supabase.co/rest/v1/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(dbMarketWithoutId)
      });

      console.log('Fetch response status:', response.status);
      const responseData = await response.json();
      console.log('Fetch response data:', responseData);

      if (!response.ok) {
        const error = responseData;
        console.error('Fetch error:', error);
        throw new Error(`Failed to add market: ${error.message || JSON.stringify(error)}`);
      }

      const data = Array.isArray(responseData) ? responseData[0] : responseData;

      console.log('Market added successfully to database:', data);
      // Convert the database result back to Market format and add to local state
      const newMarket = convertDbToMarket(data);
      console.log('Converted market for local state:', newMarket);
      setMarkets(prev => {
        console.log('Updating local markets state, prev length:', prev.length);
        const updated = [newMarket, ...prev];
        console.log('New markets state length:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('Unexpected error in addMarket:', error);
      throw error;
    }
  };

  const updateMarket = async (updatedMarket: Market) => {
    try {
      if (!currentUserId) return;

      const dbMarket = convertMarketToDb(updatedMarket, currentUserId);
      const { error } = await supabase
        .from('markets')
        .update(dbMarket)
        .eq('id', updatedMarket.id);

      if (error) {
        console.error('Error updating market:', error);
        return;
      }

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
      const { error } = await supabase
        .from('markets')
        .update({ 
          status: 'completed',
          actual_revenue: actualRevenue,
          completed: true,
          completed_date: completedDate
        })
        .eq('id', marketId);

      if (error) {
        console.error('Error closing market:', error);
        return;
      }

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
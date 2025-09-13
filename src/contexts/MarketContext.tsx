import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Market } from '@/types/market';

const initialMarkets: Market[] = [
  {
    id: "1",
    name: "Downtown Farmers Market",
    date: "2024-01-15",
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
    checklist: {
      insurance: true,
      permit: true,
      inventory: false,
      setup: false,
    },
  },
  {
    id: "2",
    name: "Weekend Artisan Fair",
    date: "2024-01-20",
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
    status: "upcoming",
    organizerContact: "info@artisanfair.org",
    requirements: ["Handmade items only", "Tent required", "Insurance certificate"],
    checklist: {
      insurance: true,
      permit: false,
      inventory: false,
      setup: false,
    },
  },
  {
    id: "3",
    name: "Holiday Night Market",
    date: "2024-01-25",
    loadInTime: "4:00 PM",
    marketStartTime: "6:00 PM",
    marketEndTime: "10:00 PM",
    address: {
      street: "789 Harbor District Way",
      city: "Portland",
      state: "OR",
      zipCode: "97203",
      country: "US"
    },
    fee: 150,
    estimatedProfit: 800,
    status: "pending",
    organizerContact: "events@harbordistrict.com",
    requirements: ["Holiday themed products", "Lighting setup", "Extended hours"],
    checklist: {
      insurance: false,
      permit: false,
      inventory: false,
      setup: false,
    },
  },
  // Past markets
  {
    id: "past-1",
    name: "Winter Holiday Market",
    date: "2023-12-15",
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
    checklist: {
      insurance: true,
      permit: true,
      inventory: true,
      setup: true,
    },
    completed: true,
    completedDate: "2023-12-15",
  },
  {
    id: "past-2",
    name: "Autumn Craft Fair",
    date: "2023-10-28",
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
    checklist: {
      insurance: true,
      permit: true,
      inventory: true,
      setup: true,
    },
    completed: true,
    completedDate: "2023-10-28",
  }
];

interface MarketContextType {
  markets: Market[];
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  updateMarketChecklist: (marketId: string, item: keyof Market['checklist']) => void;
  addMarket: (market: Market) => void;
  updateMarket: (market: Market) => void;
  closeMarket: (marketId: string, actualRevenue: number) => void;
  getUpcomingMarkets: () => Market[];
  getPastMarkets: () => Market[];
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);

  const updateMarketChecklist = (marketId: string, item: keyof Market['checklist']) => {
    setMarkets(prev => prev.map(market => 
      market.id === marketId 
        ? { ...market, checklist: { ...market.checklist, [item]: !market.checklist[item] } }
        : market
    ));
  };

  const addMarket = (market: Market) => {
    setMarkets(prev => [market, ...prev]);
  };

  const updateMarket = (updatedMarket: Market) => {
    setMarkets(prev => prev.map(market => 
      market.id === updatedMarket.id ? updatedMarket : market
    ));
  };

  const closeMarket = (marketId: string, actualRevenue: number) => {
    setMarkets(prev => prev.map(market => 
      market.id === marketId 
        ? { 
            ...market, 
            status: "completed" as const,
            actualRevenue,
            completed: true,
            completedDate: new Date().toISOString().split('T')[0]
          }
        : market
    ));
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
      addMarket,
      updateMarket,
      closeMarket,
      getUpcomingMarkets,
      getPastMarkets
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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FindMarkets from './FindMarkets';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';
import { MarketContext } from '@/contexts/MarketContext';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        then: vi.fn((cb) => cb({ data: [], error: null }))
      }))
    }))
  }
}));

// Mock geocodeAddress (placeholder for now)
vi.mock('./FindMarkets', async () => {
  const actual = await vi.importActual('./FindMarkets');
  return {
    ...actual,
    geocodeAddress: vi.fn(() => Promise.resolve({ lat: 0, lng: 0 })),
  };
});

// Mock MarketContext and useMarkets
const mockMarketContextValue = {
  markets: [],
  setMarkets: vi.fn(),
  updateMarketChecklist: vi.fn(),
  addChecklistItem: vi.fn(),
  addMarket: vi.fn(),
  updateMarket: vi.fn(),
  closeMarket: vi.fn(),
  getUpcomingMarkets: vi.fn(() => []),
  getPastMarkets: vi.fn(() => []),
  isLoading: false,
};

vi.mock('@/contexts/MarketContext', () => ({
  useMarkets: vi.fn(() => mockMarketContextValue),
  MarketContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

describe('FindMarkets', () => {
  it('renders search input and view toggle', () => {
    render(
      <BrowserRouter>
        <MarketContext.Provider value={mockMarketContextValue}>
          <FindMarkets />
        </MarketContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Search by name, city, or state')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Map View/i })).toBeInTheDocument();
  });

  it('toggles between list and map view', () => {
    render(
      <BrowserRouter>
        <MarketContext.Provider value={mockMarketContextValue}>
          <FindMarkets />
        </MarketContext.Provider>
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole('button', { name: /Map View/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /List View/i })).toBeInTheDocument();
  });

  it('filters markets based on search query', async () => {
    const mockMarkets = [
      {
        id: '1',
        name: 'Farmers Market',
        address: { city: 'Portland', state: 'OR' },
        lat: 0, lng: 0
      },
      {
        id: '2',
        name: 'Craft Fair',
        address: { city: 'Seattle', state: 'WA' },
        lat: 0, lng: 0
      },
    ];

    // Mock supabase to return data
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        then: vi.fn((cb) => cb({ data: mockMarkets, error: null }))
      }))
    });

    render(
      <BrowserRouter>
        <MarketContext.Provider value={mockMarketContextValue}>
          <FindMarkets />
        </MarketContext.Provider>
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search by name, city, or state');
    fireEvent.change(searchInput, { target: { value: 'Portland' } });

    await waitFor(() => {
      expect(screen.getByText('Farmers Market')).toBeInTheDocument();
      expect(screen.queryByText('Craft Fair')).not.toBeInTheDocument();
    });
  });
});

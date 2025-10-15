
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MarketProfile from './MarketProfile';
import { supabase } from '@/integrations/supabase/client';
import { useDocuments } from '@/hooks/use-documents';
import { vi } from 'vitest';
import { MarketContext } from '@/contexts/MarketContext';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockMarket, error: null }))
        }))
      }))
    }))
  }
}));

// Mock useDocuments
vi.mock('@/hooks/use-documents', () => ({
  useDocuments: vi.fn(() => ({
    documents: [],
    loading: false,
  }))
}));

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

describe('MarketProfile', () => {
  const mockMarket = {
    id: '1',
    name: 'Farmers Market',
    date: '2025-12-31',
    loadInTime: '08:00',
    marketStartTime: '09:00',
    marketEndTime: '17:00',
    address: {
      street: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
      country: 'USA',
    },
    fee: 100,
    estimatedProfit: 500,
    status: 'upcoming',
    checklist: [],
    description: 'A test market description',
    organizerContact: 'test@example.com',
    requirements: ['Business License', 'Liability Insurance'],
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockMarket, error: null }))
        }))
      }))
    });
    useDocuments.mockReturnValue({
      documents: [],
      loading: false,
    });
  });

  it('renders market details correctly', async () => {
    render(
      <BrowserRouter>
        <MarketContext.Provider value={mockMarketContextValue}>
          <Routes>
            <Route path="/market/:id" element={<MarketProfile />} />
          </Routes>
        </MarketContext.Provider>
      </BrowserRouter>,
      { wrapper: ({ children }) => <Routes><Route path="/market/:id" element={children} /></Routes> }
    );

    // Navigate to the market profile page
    window.history.pushState({}, 'Market Profile', '/market/1');

    await waitFor(() => {
      expect(screen.getByText('Farmers Market')).toBeInTheDocument();
      expect(screen.getByText('A test market description')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Fee: $100')).toBeInTheDocument();
      expect(screen.getByText('Estimated Profit: $500')).toBeInTheDocument();
    });
  });

  it('displays document checklist status', async () => {
    useDocuments.mockReturnValue({
      documents: [{ id: 'doc1', document_type: 'Business License', file_name: 'biz.pdf' }],
      loading: false,
    });

    render(
      <BrowserRouter>
        <MarketContext.Provider value={mockMarketContextValue}>
          <Routes>
            <Route path="/market/:id" element={<MarketProfile />} />
          </Routes>
        </MarketContext.Provider>
      </BrowserRouter>,
      { wrapper: ({ children }) => <Routes><Route path="/market/:id" element={children} /></Routes> }
    );

    window.history.pushState({}, 'Market Profile', '/market/1');

    await waitFor(() => {
      expect(screen.getByText('Business License')).toBeInTheDocument();
      expect(screen.getByText('Uploaded')).toBeInTheDocument();
      expect(screen.getByText('Liability Insurance')).toBeInTheDocument();
      expect(screen.getByText('Missing')).toBeInTheDocument();
    });
  });
});

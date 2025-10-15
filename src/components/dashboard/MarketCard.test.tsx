
import { render, screen } from '@testing-library/react';
import { MarketCard } from './MarketCard';
import { BrowserRouter } from 'react-router-dom';

describe('MarketCard', () => {
  const mockMarket = {
    id: '1',
    name: 'Test Market',
    description: 'A test market',
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
    date: '2025-12-31',
    loadInTime: '08:00',
    marketStartTime: '09:00',
    marketEndTime: '17:00',
  };

  it('renders market details correctly', () => {
    render(
      <BrowserRouter>
        <MarketCard market={mockMarket} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Market')).toBeInTheDocument();
    expect(screen.getByText('A test market')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/market/1');
  });
});

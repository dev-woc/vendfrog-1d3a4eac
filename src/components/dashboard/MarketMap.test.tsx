
import { render, screen } from '@testing-library/react';
import MarketMap from './MarketMap';
import { vi } from 'vitest';

// Mock react-leaflet components
vi.mock('react-leaflet', async () => {
  const actual = await vi.importActual('react-leaflet');
  return {
    ...actual,
    MapContainer: vi.fn(({ children }) => <div data-testid="map-container">{children}</div>),
    TileLayer: vi.fn(() => <div data-testid="tile-layer" />),
    Marker: vi.fn(({ children }) => <div data-testid="marker">{children}</div>),
    Popup: vi.fn(({ children }) => <div data-testid="popup">{children}</div>),
  };
});

describe('MarketMap', () => {
  const mockMarkets = [
    {
      id: '1',
      name: 'Farmers Market',
      address: { city: 'Portland', state: 'OR' },
      lat: 45.523064, lng: -122.676483
    },
    {
      id: '2',
      name: 'Craft Fair',
      address: { city: 'Seattle', state: 'WA' },
      lat: 47.606209, lng: -122.332069
    },
  ];

  it('renders the map container', () => {
    render(<MarketMap markets={mockMarkets} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('renders markers for each market', () => {
    render(<MarketMap markets={mockMarkets} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(mockMarkets.length);
  });

  it('renders market name in popup', () => {
    render(<MarketMap markets={mockMarkets} />);
    const popups = screen.getAllByTestId('popup');
    expect(popups[0]).toHaveTextContent('Farmers Market');
    expect(popups[1]).toHaveTextContent('Craft Fair');
  });
});

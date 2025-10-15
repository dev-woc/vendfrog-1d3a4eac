
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

const MarketMap = ({ markets }: { markets: any[] }) => {
  const position: LatLngExpression = [51.505, -0.09]; // Default position

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markets.map(market => (
        <Marker key={market.id} position={[market.lat, market.lng]}>
          <Popup>
            <h3>{market.name}</h3>
            <p>{market.address.street}, {market.address.city}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MarketMap;

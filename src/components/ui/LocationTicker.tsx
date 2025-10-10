import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

interface LocationData {
  timezone: string;
  city: string;
  country: string;
}

export function LocationTicker() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.status === 429) {
          console.warn('Rate limited by ipapi.co. Please try again later.');
          // Fallback to UTC
          setLocation({
            timezone: 'UTC',
            city: 'UTC',
            country: 'UTC'
          });
          setLoading(false);
          return;
        }
        const data = await response.json();
        setLocation({
          timezone: data.timezone || 'UTC',
          city: data.city || 'Unknown',
          country: data.region_code || data.country_code || 'Unknown'
        });
      } catch (error) {
        // Fallback to UTC if IP geolocation fails
        setLocation({
          timezone: 'UTC',
          city: 'UTC',
          country: 'UTC'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="text-xs text-muted-foreground animate-pulse">
        Loading location...
      </div>
    );
  }

  if (!location) return null;

  const formattedTime = formatInTimeZone(
    currentTime, 
    location.timezone, 
    'h:mm:ss a'
  );
  
  const formattedDate = formatInTimeZone(
    currentTime, 
    location.timezone, 
    'MMM dd, yyyy'
  );

  return (
    <div className="text-xs text-muted-foreground font-mono">
      <div className="flex flex-col items-end">
        <span className="font-semibold">{formattedTime}</span>
        <span>{formattedDate}</span>
        <span className="text-[10px] opacity-75">{location.city}, {location.country}</span>
      </div>
    </div>
  );
}
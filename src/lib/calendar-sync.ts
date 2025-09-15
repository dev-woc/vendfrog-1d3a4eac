import { Market } from "@/types/market";
import { format, parseISO } from "date-fns";

export interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export function marketToCalendarEvent(market: Market): CalendarEvent {
  try {
    const marketDate = parseISO(market.date);
    const startTime = market.loadInTime || market.marketStartTime;
    const endTime = market.marketEndTime;
    
    if (!startTime || !endTime) {
      throw new Error(`Missing time information for market: ${market.name}`);
    }
    
    // Combine date with times - handle different time formats
    const parseTime = (timeStr: string) => {
      // Handle formats like "09:00", "9:00 AM", "09:00:00"
      const cleanTime = timeStr.replace(/\s*(AM|PM)\s*/i, '').split(':');
      if (cleanTime.length < 2) {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
      return [parseInt(cleanTime[0]), parseInt(cleanTime[1])];
    };
    
    const [startHour, startMinute] = parseTime(startTime);
    const [endHour, endMinute] = parseTime(endTime);
    
    const startDateTime = new Date(marketDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(marketDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    const location = `${market.address.street}, ${market.address.city}, ${market.address.state} ${market.address.zipCode}`;
    
    return {
      title: market.name,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      location,
      description: market.description || `Market at ${location}. Fee: $${market.fee}. Expected profit: $${market.estimatedProfit}.`
    };
  } catch (error) {
    console.error('Error converting market to calendar event:', error, market);
    throw new Error(`Failed to process market data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: string) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const escapeText = (text: string) => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  };

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Market Calendar//Event//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@marketcalendar.com`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return ics;
}

export function downloadICSFile(event: CalendarEvent) {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function syncToAppleCalendar(event: CalendarEvent) {
  const startDate = format(new Date(event.startDate), 'yyyyMMdd\'T\'HHmmss');
  const endDate = format(new Date(event.endDate), 'yyyyMMdd\'T\'HHmmss');
  
  const params = new URLSearchParams({
    title: event.title,
    startdate: startDate,
    enddate: endDate,
    location: event.location,
    notes: event.description
  });

  // Try Apple Calendar URL scheme first
  const appleUrl = `calshow://calendar.apple.com/action?${params.toString()}`;
  window.open(appleUrl, '_blank');
  
  // Fallback to webcal if available
  setTimeout(() => {
    const icsContent = generateICSFile(event);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const webcalUrl = url.replace('blob:', 'webcal:');
    window.open(webcalUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 1000);
}

export function syncToGoogleCalendar(event: CalendarEvent) {
  const formatGoogleDate = (date: string) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
    location: event.location,
    details: event.description
  });

  const googleUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
  window.open(googleUrl, '_blank');
}

export function bulkSyncMarkets(markets: Market[], platform: 'apple' | 'google' | 'ics') {
  markets.forEach((market, index) => {
    const event = marketToCalendarEvent(market);
    
    setTimeout(() => {
      switch (platform) {
        case 'apple':
          syncToAppleCalendar(event);
          break;
        case 'google':
          syncToGoogleCalendar(event);
          break;
        case 'ics':
          downloadICSFile(event);
          break;
      }
    }, index * 500); // Stagger the syncs to avoid overwhelming the browser
  });
}
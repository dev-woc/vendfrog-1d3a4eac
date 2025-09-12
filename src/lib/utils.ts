import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMapUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  
  // Detect iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Detect Android devices
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isIOS) {
    // Use Apple Maps for iOS devices
    return `maps://maps.apple.com/?q=${encodedAddress}`;
  } else if (isAndroid) {
    // Use native maps app for Android
    return `geo:0,0?q=${encodedAddress}`;
  } else {
    // Use OpenStreetMap for desktop/other devices
    return `https://www.openstreetmap.org/search?query=${encodedAddress}`;
  }
}

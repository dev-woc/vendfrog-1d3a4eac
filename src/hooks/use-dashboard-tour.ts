import { useState, useCallback } from 'react';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'stats-cards',
    title: 'Performance Overview',
    content: 'These cards show your key metrics: total revenue, active markets, and success rate. They update in real-time based on your market activity.',
    target: '[data-tour="stats-cards"]',
    position: 'bottom'
  },
  {
    id: 'upcoming-markets',
    title: 'Market Management',
    content: 'View and manage your upcoming markets. Use the status tabs to filter by confirmed, pending, or upcoming markets within 30 days.',
    target: '[data-tour="upcoming-markets"]',
    position: 'bottom'
  },
  {
    id: 'file-upload',
    title: 'Document Management',
    content: 'Upload important documents like permits, insurance, and vendor agreements. Keep all your paperwork organized in one place.',
    target: '[data-tour="file-upload"]',
    position: 'left'
  },
  {
    id: 'market-calendar',
    title: 'Calendar View',
    content: 'See all your markets in a calendar format. Click on dates to view details or add new market events.',
    target: '[data-tour="market-calendar"]',
    position: 'top'
  },
  {
    id: 'revenue-chart',
    title: 'Revenue Analytics',
    content: 'Track your revenue trends over time. This chart helps you identify your best-performing periods and plan accordingly.',
    target: '[data-tour="revenue-chart"]',
    position: 'top'
  }
];

export const useDashboardTour = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < tourSteps.length) {
      setCurrentStep(stepIndex);
    }
  }, []);

  return {
    isActive,
    currentStep,
    currentStepData: tourSteps[currentStep],
    totalSteps: tourSteps.length,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    tourSteps
  };
};
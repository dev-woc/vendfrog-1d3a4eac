import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useDashboardTour, TourStep } from '@/hooks/use-dashboard-tour';

interface TourOverlayProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const TourOverlay = ({ 
  step, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  onClose 
}: TourOverlayProps) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const element = document.querySelector(step.target) as HTMLElement;
    setTargetElement(element);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Calculate overlay position
      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      switch (step.position) {
        case 'bottom':
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft + (rect.width / 2) - 150;
          break;
        case 'top':
          top = rect.top + scrollTop - 10;
          left = rect.left + scrollLeft + (rect.width / 2) - 150;
          break;
        case 'left':
          top = rect.top + scrollTop + (rect.height / 2) - 100;
          left = rect.left + scrollLeft - 320;
          break;
        case 'right':
          top = rect.top + scrollTop + (rect.height / 2) - 100;
          left = rect.right + scrollLeft + 10;
          break;
        default:
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft + (rect.width / 2) - 150;
      }

      setOverlayStyle({
        position: 'absolute',
        top: `${Math.max(10, top)}px`,
        left: `${Math.max(10, Math.min(left, window.innerWidth - 320))}px`,
        zIndex: 1000,
      });

      // Add highlight to target element
      element.style.position = 'relative';
      element.style.zIndex = '999';
      element.style.boxShadow = '0 0 0 4px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.2)';
      element.style.borderRadius = '8px';
      element.style.transition = 'all 0.3s ease';
    }

    return () => {
      if (element) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.boxShadow = '';
        element.style.borderRadius = '';
        element.style.transition = '';
      }
    };
  }, [step]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[998]"
        onClick={onClose}
      />
      
      {/* Tour Card */}
      <Card 
        className="w-80 bg-background border shadow-lg z-[1000]"
        style={overlayStyle}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.content}
          </p>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </Button>
            
            {currentStep === totalSteps - 1 ? (
              <Button size="sm" onClick={onClose}>
                Finish Tour
              </Button>
            ) : (
              <Button size="sm" onClick={onNext} className="flex items-center gap-1">
                Next
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
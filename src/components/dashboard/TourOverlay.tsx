import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, ArrowRight, GripVertical } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.querySelector(step.target) as HTMLElement;
    setTargetElement(element);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Mobile-first responsive card dimensions
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? Math.min(window.innerWidth - 32, 320) : 320;
      const cardHeight = isMobile ? 220 : 200;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = isMobile ? 16 : 20;
      
      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      if (isMobile) {
        // On mobile, always center horizontally and position based on available space
        left = (viewportWidth - cardWidth) / 2 + scrollLeft;
        
        // Check if there's space below the element
        const spaceBelow = viewportHeight - (rect.bottom - scrollTop + scrollTop);
        const spaceAbove = rect.top - scrollTop + scrollTop;
        
        if (spaceBelow >= cardHeight + padding) {
          top = rect.bottom + scrollTop + 10;
        } else if (spaceAbove >= cardHeight + padding) {
          top = rect.top + scrollTop - cardHeight - 10;
        } else {
          // Center vertically if no good space above or below
          top = scrollTop + (viewportHeight - cardHeight) / 2;
        }
      } else {
        // Desktop positioning logic
        switch (step.position) {
          case 'bottom':
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + (rect.width / 2) - (cardWidth / 2);
            break;
          case 'top':
            top = rect.top + scrollTop - cardHeight - 10;
            left = rect.left + scrollLeft + (rect.width / 2) - (cardWidth / 2);
            break;
          case 'left':
            top = rect.top + scrollTop + (rect.height / 2) - (cardHeight / 2);
            left = rect.left + scrollLeft - cardWidth - 10;
            break;
          case 'right':
            top = rect.top + scrollTop + (rect.height / 2) - (cardHeight / 2);
            left = rect.right + scrollLeft + 10;
            break;
          default:
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + (rect.width / 2) - (cardWidth / 2);
        }
      }

      // Ensure the overlay stays within viewport bounds
      const minTop = scrollTop + padding;
      const maxTop = scrollTop + viewportHeight - cardHeight - padding;
      const minLeft = scrollLeft + padding;
      const maxLeft = scrollLeft + viewportWidth - cardWidth - padding;

      top = Math.max(minTop, Math.min(top, maxTop));
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setOverlayStyle({
        position: 'fixed',
        top: `${Math.max(padding, Math.min(top - scrollTop, viewportHeight - cardHeight - padding))}px`,
        left: `${Math.max(padding, Math.min(left - scrollLeft, viewportWidth - cardWidth - padding))}px`,
        width: `${cardWidth}px`,
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

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !cardRef.current) return;
    
    e.preventDefault();
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - cardRef.current.offsetWidth;
    const maxY = window.innerHeight - cardRef.current.offsetHeight;
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setOverlayStyle(prev => ({
      ...prev,
      left: `${boundedX}px`,
      top: `${boundedY}px`,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Tour Card */}
      <Card 
        ref={cardRef}
        className={`bg-background border shadow-xl z-[1000] max-w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={overlayStyle}
      >
        <CardHeader className="pb-3 px-4 md:px-6" onMouseDown={handleMouseDown}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <CardTitle className="text-base md:text-lg truncate">{step.title}</CardTitle>
              <Badge variant="secondary" className="text-xs shrink-0">
                {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 shrink-0 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4 px-4 md:px-6 pb-4 md:pb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.content}
          </p>
          
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 min-h-[44px] px-4"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            
            {currentStep === totalSteps - 1 ? (
              <Button size="sm" onClick={onClose} className="min-h-[44px] px-4">
                Finish Tour
              </Button>
            ) : (
              <Button size="sm" onClick={onNext} className="flex items-center gap-1 min-h-[44px] px-4">
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
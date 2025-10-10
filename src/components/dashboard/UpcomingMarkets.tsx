import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarkets } from "@/contexts/MarketContext";
import { useToast } from "@/hooks/use-toast";
import { MarketDetailsModal } from "./MarketDetailsModal";
import { ChecklistModal } from "./ChecklistModal";
import { AddMarketModal } from "./AddMarketModal";
import { CloseMarketModal } from "./CloseMarketModal";
import { Market } from "@/types/market";
import {
  MapPin,
  DollarSign,
  CheckSquare,
  Calendar,
  Edit,
  Eye,
  Archive,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

interface MarketCardProps {
  market: Market;
  onViewDetails?: (market: Market) => void;
  onEditMarket?: (market: Market) => void;
  onCloseMarket?: (market: Market) => void;
  onViewChecklist?: (market: Market) => void;
}

function MarketCard({ market, onViewDetails, onEditMarket, onCloseMarket, onViewChecklist }: MarketCardProps) {
  const completedTasks = market.checklist.filter(item => item.completed).length;
  const totalTasks = market.checklist.length;
  
  // Create full address string for display and mapping
  const fullAddress = `${market.address.street}, ${market.address.city}, ${market.address.state} ${market.address.zipCode}${market.address.country ? `, ${market.address.country}` : ''}`;

  // Check if market date has passed
  const marketDate = new Date(market.date);
  const today = new Date();
  const canClose = marketDate < today && market.status !== "completed";

  // Calculate days until market
  const daysUntilMarket = Math.ceil((marketDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine display status with automatic logic
  const getDisplayStatus = () => {
    if (market.status === "completed") return "completed";
    if (market.status === "confirmed") return "confirmed";
    if (market.status === "pending") return "pending";
    
    // Auto-determine based on time
    if (daysUntilMarket <= 7) return "upcoming";
    return "pending";
  };

  const displayStatus = getDisplayStatus();

  return (
    <Card className="border border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg">{market.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={
              displayStatus === "confirmed" ? "default" :
              displayStatus === "pending" ? "secondary" : 
              displayStatus === "upcoming" ? "default" : "outline"
            }>
              {displayStatus}
            </Badge>
            {daysUntilMarket > 0 && daysUntilMarket <= 14 && (
              <Badge variant="outline" className="text-xs">
                {daysUntilMarket} day{daysUntilMarket !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(market.date).toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span className="truncate">{market.address.city}, {market.address.state}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>Fee: ${market.fee} | Est. Profit: ${market.estimatedProfit}</span>
          </div>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground border-t pt-2 sm:pt-3">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
          <span className="font-medium">Market Hours:</span>
          <span className="ml-2 truncate">{market.marketStartTime} - {market.marketEndTime}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>Checklist: {completedTasks}/{totalTasks} ({Math.round((completedTasks / totalTasks) * 100)}%)</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewChecklist?.(market)} className="min-h-[36px] text-xs">
              <CheckSquare className="h-3 w-3 mr-1" />
              View Checklist
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEditMarket?.(market)} className="min-h-[36px] text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            {canClose && onCloseMarket && (
              <Button variant="outline" size="sm" onClick={() => onCloseMarket(market)} className="min-h-[36px] text-xs">
                <Archive className="h-3 w-3 mr-1" />
                Close
              </Button>
            )}
            {!canClose && marketDate > today && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails?.(market)} className="min-h-[36px] text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            )}
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2" 
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          >
            {completedTasks > 0 && (
              <span className="text-xs text-primary-foreground font-medium">
                {Math.round((completedTasks / totalTasks) * 100)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PastMarketCard({ market }: { market: Market }) {
  const actualProfit = (market.actualRevenue || 0) - market.fee;
  const profitDifference = actualProfit - market.estimatedProfit;
  const isProfit = profitDifference >= 0;
  
  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{market.name}</CardTitle>
          <Badge variant="outline">Completed</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(market.date).toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Est. Profit:</span>
            <p className="font-medium">${market.estimatedProfit}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Actual Profit:</span>
            <p className={`font-medium ${actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${actualProfit}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Revenue:</span>
            <p className="font-medium">${market.actualRevenue || 0}</p>
          </div>
          <div>
            <span className="text-muted-foreground">vs. Estimate:</span>
            <p className={`font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}${profitDifference.toFixed(0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingMarkets({ showAll = false }: { showAll?: boolean }) {
  const { getUpcomingMarkets, getPastMarkets, updateMarketChecklist, updateMarket, closeMarket, addMarket, addChecklistItem } = useMarkets();
  const { toast } = useToast();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [checklistMarket, setChecklistMarket] = useState<Market | null>(null);
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [marketToClose, setMarketToClose] = useState<Market | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all-upcoming");

  const upcomingMarkets = getUpcomingMarkets();
  const pastMarkets = getPastMarkets();

  const getFilteredMarkets = (filter: string) => {
    switch (filter) {
      case "pending":
        return upcomingMarkets.filter(market => market.status === "pending");
      case "confirmed":
        return upcomingMarkets.filter(market => market.status === "confirmed");
      case "upcoming":
        return upcomingMarkets.filter(market => {
          const daysUntil = Math.ceil((new Date(market.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil <= 7;
        });
      case "completed":
        return pastMarkets;
      default:
        return upcomingMarkets;
    }
  };

  const handleViewDetails = (market: Market) => {
    setSelectedMarket(market);
    setIsDetailsModalOpen(true);
  };

  const handleViewChecklist = (market: Market) => {
    setChecklistMarket(market);
    setIsChecklistModalOpen(true);
  };

  const handleEditMarket = (market: Market) => {
    setEditingMarket(market);
    setIsEditModalOpen(true);
  };

  const handleCloseMarket = (market: Market) => {
    setMarketToClose(market);
    setIsCloseModalOpen(true);
  };

  const handleEditComplete = (updatedMarket: Market) => {
    updateMarket(updatedMarket);
    setIsEditModalOpen(false);
    setEditingMarket(null);
  };

  const handleCloseComplete = (marketId: string, actualRevenue: number) => {
    closeMarket(marketId, actualRevenue);
    setIsCloseModalOpen(false);
    setMarketToClose(null);
  };

  if (!showAll) {
    // Show summary view (first 2 upcoming markets)
    const displayedMarkets = upcomingMarkets.slice(0, 2);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Markets</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddModalOpen(true)}
                className="min-h-[36px] sm:min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Add New Market</span>
                <span className="sm:hidden">Add Market</span>
              </Button>
              <Link to="/markets">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedMarkets.map((market) => (
              <MarketCard 
                key={market.id} 
                market={market} 
                onViewDetails={handleViewDetails} 
                onEditMarket={handleEditMarket}
                onCloseMarket={handleCloseMarket}
                onViewChecklist={handleViewChecklist}
              />
            ))}
            {upcomingMarkets.length > 2 && (
              <div className="text-center pt-4 border-t">
                <Link to="/markets">
                  <Button variant="outline" className="w-full min-h-[44px] text-sm">
                    Show More Markets ({upcomingMarkets.length - 2} more)
                  </Button>
                </Link>
              </div>
            )}
            {displayedMarkets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming markets.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first market to get started.
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Modals */}
        <MarketDetailsModal
          market={selectedMarket}
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          onUpdateChecklist={updateMarketChecklist}
          onEditMarket={handleEditMarket}
        />

        <ChecklistModal
          market={checklistMarket}
          open={isChecklistModalOpen}
          onOpenChange={setIsChecklistModalOpen}
          onUpdateChecklist={updateMarketChecklist}
          onEditMarket={handleEditMarket}
          onAddChecklistItem={addChecklistItem}
        />

        <AddMarketModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onUpdateMarket={handleEditComplete}
          editingMarket={editingMarket}
        />

        <CloseMarketModal
          market={marketToClose}
          open={isCloseModalOpen}
          onOpenChange={setIsCloseModalOpen}
          onCloseMarket={handleCloseComplete}
        />

        <AddMarketModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddMarket={async (market) => {
            try {
              await addMarket(market);
              setIsAddModalOpen(false);
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to add market",
                variant: "destructive"
              });
            }
          }}
        />
      </Card>
    );
  }

  // Show full view with tabs/filters
  const currentMarkets = getFilteredMarkets(activeFilter);

  return (
    <div className="space-y-6">
      {/* Mobile Filter Dropdown */}
      <div className="block sm:hidden">
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-upcoming">All Upcoming</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="upcoming">This Week</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all-upcoming">All Upcoming</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="upcoming">This Week</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[44px] px-4 text-sm"
            >
              <span className="hidden sm:inline">Add New Market</span>
              <span className="sm:hidden">Add Market</span>
            </Button>
          </div>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {activeFilter === "completed" ? (
          pastMarkets.map((market) => (
            <PastMarketCard key={market.id} market={market} />
          ))
        ) : (
          currentMarkets.map((market) => (
            <MarketCard 
              key={market.id} 
              market={market} 
              onViewDetails={handleViewDetails} 
              onEditMarket={handleEditMarket}
              onCloseMarket={handleCloseMarket}
              onViewChecklist={handleViewChecklist}
            />
          ))
        )}
        {currentMarkets.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No markets found</h3>
            <p className="text-muted-foreground mb-4">
              {activeFilter === "completed" 
                ? "You haven't completed any markets yet." 
                : "No markets match the current filter."}
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[44px] px-4 text-sm"
            >
              <span className="hidden sm:inline">Add Your First Market</span>
              <span className="sm:hidden">Add Market</span>
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <MarketDetailsModal
        market={selectedMarket}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onUpdateChecklist={updateMarketChecklist}
        onEditMarket={handleEditMarket}
      />

      <ChecklistModal
        market={checklistMarket}
        open={isChecklistModalOpen}
        onOpenChange={setIsChecklistModalOpen}
        onUpdateChecklist={updateMarketChecklist}
        onEditMarket={handleEditMarket}
        onAddChecklistItem={addChecklistItem}
      />

      <AddMarketModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onUpdateMarket={handleEditComplete}
        editingMarket={editingMarket}
      />

      <AddMarketModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddMarket={async (market) => {
          try {
            await addMarket(market);
            setIsAddModalOpen(false);
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message || "Failed to add market",
              variant: "destructive"
            });
          }
        }}
      />

      <CloseMarketModal
        market={marketToClose}
        open={isCloseModalOpen}
        onOpenChange={setIsCloseModalOpen}
        onCloseMarket={handleCloseComplete}
      />
    </div>
  );
}
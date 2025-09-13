import { useState } from "react";
import { MapPin, Clock, CheckSquare, DollarSign, TrendingUp, Calendar, Plus, Edit, Archive, TrendingDown, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketDetailsModal } from "./MarketDetailsModal";
import { AddMarketModal } from "./AddMarketModal";
import { CloseMarketModal } from "./CloseMarketModal";
import { Link } from "react-router-dom";
import { getMapUrl } from "@/lib/utils";
import { Market } from "@/types/market";
import { useMarkets } from "@/contexts/MarketContext";


function MarketCard({ market, onViewDetails, onEditMarket, onCloseMarket }: { 
  market: Market; 
  onViewDetails: (market: Market) => void; 
  onEditMarket: (market: Market) => void;
  onCloseMarket?: (market: Market) => void;
}) {
  const completedTasks = Object.values(market.checklist).filter(Boolean).length;
  const totalTasks = Object.keys(market.checklist).length;
  
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
    if (daysUntilMarket <= 30 && daysUntilMarket >= 0) return "upcoming";
    return market.status;
  };

  const displayStatus = getDisplayStatus();

  return (
    <Card className="border border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg leading-tight">{market.name}</CardTitle>
          <Badge 
            variant={displayStatus === "confirmed" ? "default" : displayStatus === "pending" ? "secondary" : displayStatus === "upcoming" ? "outline" : "outline"}
          >
            {displayStatus}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(market.date).toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
          {daysUntilMarket >= 0 && daysUntilMarket <= 30 && (
            <span className="ml-2 text-primary font-medium">
              ({daysUntilMarket === 0 ? "Today" : daysUntilMarket === 1 ? "Tomorrow" : `${daysUntilMarket} days`})
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span className="truncate">Load: {market.loadInTime}</span>
          </div>
          <div className="flex items-center text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <a 
              href={getMapUrl(fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline cursor-pointer truncate"
            >
              {market.address.street}, {market.address.city}
            </a>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>Fee: ${market.fee}</span>
          </div>
          <div className="flex items-center text-success">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>Est. ${market.estimatedProfit}</span>
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
            <span>Checklist: {completedTasks}/{totalTasks}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {canClose && onCloseMarket && (
              <Button variant="outline" size="sm" onClick={() => onCloseMarket(market)} className="min-h-[36px] text-xs">
                <Archive className="h-3 w-3 mr-1" />
                Close
              </Button>
            )}
            {!canClose && marketDate > today && (
              <div className="text-xs text-muted-foreground italic">
                Close available after {new Date(market.date).toLocaleDateString()}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditMarket(market)} className="min-h-[36px] text-xs flex-1 sm:flex-none">
                <Edit className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(market)} className="min-h-[36px] text-xs flex-1 sm:flex-none">
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span className="truncate">{market.marketStartTime} - {market.marketEndTime}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span className="truncate">{market.address.city}, {market.address.state}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>Fee: ${market.fee}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>Revenue: ${market.actualRevenue || 0}</span>
          </div>
        </div>

        <div className="border-t pt-2 sm:pt-3 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Estimated Profit:</span>
            <span>${market.estimatedProfit}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Actual Profit:</span>
            <span className="font-medium">${actualProfit}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Difference:</span>
            <div className={`flex items-center ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
              {isProfit ? '+' : ''}${profitDifference}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingMarkets({ showAll = false }: { showAll?: boolean }) {
  const { getUpcomingMarkets, getPastMarkets, updateMarketChecklist, addMarket, updateMarket, closeMarket } = useMarkets();
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [marketToClose, setMarketToClose] = useState<Market | null>(null);
  const [activeFilter, setActiveFilter] = useState("all-upcoming");

  const upcomingMarkets = getUpcomingMarkets();
  const pastMarkets = getPastMarkets();

  const handleViewDetails = (market: Market) => {
    setSelectedMarket(market);
    setShowDetails(true);
  };

  const handleUpdateChecklist = (marketId: string, checklistItemId: string) => {
    updateMarketChecklist(marketId, checklistItemId);
    
    // Update selected market if it's the one being modified
    if (selectedMarket?.id === marketId) {
      setSelectedMarket(prev => prev ? {
        ...prev,
        checklist: prev.checklist.map(item => 
          item.id === checklistItemId 
            ? { ...item, completed: !item.completed }
            : item
        )
      } : null);
    }
  };

  const handleAddMarket = (newMarket: Market) => {
    addMarket(newMarket);
  };

  const handleEditMarket = (market: Market) => {
    setEditingMarket(market);
    setShowAddModal(true);
  };

  const handleUpdateMarket = (updatedMarket: Market) => {
    updateMarket(updatedMarket);
    setEditingMarket(null);
  };

  const handleModalClose = (open: boolean) => {
    setShowAddModal(open);
    if (!open) {
      setEditingMarket(null);
    }
  };

  const handleCloseMarket = (market: Market) => {
    setMarketToClose(market);
    setShowCloseModal(true);
  };

  const handleCloseMarketConfirm = (marketId: string, actualRevenue: number) => {
    closeMarket(marketId, actualRevenue);
    setMarketToClose(null);
  };

  const displayedMarkets = showAll ? upcomingMarkets : upcomingMarkets.slice(0, 2);

  // Filter markets by status for the showAll view with automatic status logic
  const getMarketDisplayStatus = (market: any) => {
    if (market.status === "completed") return "completed";
    if (market.status === "confirmed") return "confirmed";
    const daysUntil = Math.ceil((new Date(market.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 30 && daysUntil >= 0) return "upcoming";
    return market.status;
  };

  const pendingMarkets = upcomingMarkets.filter(market => getMarketDisplayStatus(market) === 'pending');
  const confirmedMarkets = upcomingMarkets.filter(market => getMarketDisplayStatus(market) === 'confirmed');
  const upcomingStatusMarkets = upcomingMarkets.filter(market => getMarketDisplayStatus(market) === 'upcoming');
  const completedMarkets = pastMarkets;

  const filterOptions = [
    { value: "all-upcoming", label: `All Upcoming (${upcomingMarkets.length})`, markets: upcomingMarkets },
    { value: "pending", label: `Pending (${pendingMarkets.length})`, markets: pendingMarkets },
    { value: "confirmed", label: `Confirmed (${confirmedMarkets.length})`, markets: confirmedMarkets },
    { value: "upcoming", label: `Upcoming (${upcomingStatusMarkets.length})`, markets: upcomingStatusMarkets },
    { value: "completed", label: `Completed (${completedMarkets.length})`, markets: completedMarkets }
  ];

  const currentFilterData = filterOptions.find(option => option.value === activeFilter);
  const currentMarkets = currentFilterData?.markets || [];

  if (showAll) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              All Markets
            </CardTitle>
            <Button onClick={() => setShowAddModal(true)} size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Market
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mobile/Tablet Filter Dropdown */}
          <div className="block lg:hidden">
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                {filterOptions.map((option) => (
                  <TabsTrigger key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Market Content */}
          <div className="space-y-4">
            {currentMarkets.map((market) => (
              activeFilter === "completed" ? (
                <PastMarketCard key={market.id} market={market} />
              ) : (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  onViewDetails={handleViewDetails} 
                  onEditMarket={handleEditMarket}
                  onCloseMarket={handleCloseMarket}
                />
              )
            ))}
            {currentMarkets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {activeFilter === "completed" ? "No completed markets yet." : `No ${activeFilter.replace('-', ' ')} markets.`}
                </p>
                {(activeFilter === "all-upcoming" || activeFilter === "completed") && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeFilter === "completed" 
                      ? "Markets will appear here once you close them out with actual revenue data."
                      : "Add your first market to get started."
                    }
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <MarketDetailsModal
          market={selectedMarket}
          open={showDetails}
          onOpenChange={setShowDetails}
          onUpdateChecklist={handleUpdateChecklist}
        />

        <AddMarketModal
          open={showAddModal}
          onOpenChange={handleModalClose}
          onAddMarket={handleAddMarket}
          onUpdateMarket={handleUpdateMarket}
          editingMarket={editingMarket}
        />

        <CloseMarketModal
          market={marketToClose}
          open={showCloseModal}
          onOpenChange={setShowCloseModal}
          onCloseMarket={handleCloseMarketConfirm}
        />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Upcoming Markets
          </CardTitle>
          <Button onClick={() => setShowAddModal(true)} size="sm" className="min-h-[36px] text-xs sm:text-sm self-start sm:self-auto">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Add Market
          </Button>
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
            />
          ))}
          {!showAll && upcomingMarkets.length > 2 && (
            <div className="pt-3 sm:pt-4 border-t">
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

      <MarketDetailsModal
        market={selectedMarket}
        open={showDetails}
        onOpenChange={setShowDetails}
        onUpdateChecklist={handleUpdateChecklist}
      />

      <AddMarketModal
        open={showAddModal}
        onOpenChange={handleModalClose}
        onAddMarket={handleAddMarket}
        onUpdateMarket={handleUpdateMarket}
        editingMarket={editingMarket}
      />

      <CloseMarketModal
        market={marketToClose}
        open={showCloseModal}
        onOpenChange={setShowCloseModal}
        onCloseMarket={handleCloseMarketConfirm}
      />
    </Card>
  );
}
import { useState } from "react";
import { MapPin, Clock, CheckSquare, DollarSign, TrendingUp, Calendar, Plus, Edit, Archive, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Load: {market.loadInTime}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <a 
              href={getMapUrl(fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline cursor-pointer"
            >
              {market.address.street}, {market.address.city}
            </a>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Fee: ${market.fee}
          </div>
          <div className="flex items-center text-success">
            <TrendingUp className="h-4 w-4 mr-2" />
            Est. ${market.estimatedProfit}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground border-t pt-3">
          <Clock className="h-4 w-4 mr-2" />
          <span className="font-medium">Market Hours:</span>
          <span className="ml-2">{market.marketStartTime} - {market.marketEndTime}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist: {completedTasks}/{totalTasks}
          </div>
          <div className="flex gap-2">
            {canClose && onCloseMarket && (
              <Button variant="outline" size="sm" onClick={() => onCloseMarket(market)}>
                <Archive className="h-4 w-4 mr-1" />
                Close
              </Button>
            )}
            {!canClose && marketDate > today && (
              <div className="text-xs text-muted-foreground italic">
                Close available after {new Date(market.date).toLocaleDateString()}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => onEditMarket(market)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onViewDetails(market)}>
              View Details
            </Button>
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {market.marketStartTime} - {market.marketEndTime}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {market.address.city}, {market.address.state}
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Fee: ${market.fee}
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue: ${market.actualRevenue || 0}
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated Profit:</span>
            <span>${market.estimatedProfit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Actual Profit:</span>
            <span className="font-medium">${actualProfit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Difference:</span>
            <div className={`flex items-center ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
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

  if (showAll) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              All Markets
            </CardTitle>
            <Button onClick={() => setShowAddModal(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Market
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-upcoming" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all-upcoming">All Upcoming ({upcomingMarkets.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingMarkets.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({confirmedMarkets.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcomingStatusMarkets.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedMarkets.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-upcoming">
              <div className="space-y-4">
                {upcomingMarkets.map((market) => (
                  <MarketCard 
                    key={market.id} 
                    market={market} 
                    onViewDetails={handleViewDetails} 
                    onEditMarket={handleEditMarket}
                    onCloseMarket={handleCloseMarket}
                  />
                ))}
                {upcomingMarkets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming markets.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your first market to get started.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="space-y-4">
                {pendingMarkets.map((market) => (
                  <MarketCard 
                    key={market.id} 
                    market={market} 
                    onViewDetails={handleViewDetails} 
                    onEditMarket={handleEditMarket}
                    onCloseMarket={handleCloseMarket}
                  />
                ))}
                {pendingMarkets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending markets.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="confirmed">
              <div className="space-y-4">
                {confirmedMarkets.map((market) => (
                  <MarketCard 
                    key={market.id} 
                    market={market} 
                    onViewDetails={handleViewDetails} 
                    onEditMarket={handleEditMarket}
                    onCloseMarket={handleCloseMarket}
                  />
                ))}
                {confirmedMarkets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No confirmed markets.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="space-y-4">
                {upcomingStatusMarkets.map((market) => (
                  <MarketCard 
                    key={market.id} 
                    market={market} 
                    onViewDetails={handleViewDetails} 
                    onEditMarket={handleEditMarket}
                    onCloseMarket={handleCloseMarket}
                  />
                ))}
                {upcomingStatusMarkets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming status markets.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="space-y-4">
                {completedMarkets.map((market) => (
                  <PastMarketCard key={market.id} market={market} />
                ))}
                {completedMarkets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No completed markets yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Markets will appear here once you close them out with actual revenue data.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Markets
          </CardTitle>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
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
            <div className="pt-4 border-t">
              <Link to="/markets">
                <Button variant="outline" className="w-full">
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { useDocuments, Document } from "@/hooks/use-documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const MarketProfile = () => {
  const { id } = useParams();
  const [market, setMarket] = useState<any>(null);
  const { documents, loading: documentsLoading } = useDocuments();

  useEffect(() => {
    const fetchMarket = async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching market:", error);
      } else {
        setMarket(data);
      }
    };

    if (id) {
      fetchMarket();
    }
  }, [id]);

  const getDocumentStatus = (docType: string) => {
    if (documentsLoading) {
      return { status: 'loading', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> };
    }
    const userDoc = documents.find(doc => doc.document_type === docType);
    if (userDoc) {
      return { status: 'Uploaded', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
    } else {
      return { status: 'Missing', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    }
  };

  if (!market) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <BreadcrumbNav />
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{market.name}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {market.address.street}, {market.address.city}, {market.address.state}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Date:</strong> {new Date(market.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {market.marketStartTime} - {market.marketEndTime}</p>
                <p><strong>Load-in Time:</strong> {market.loadInTime}</p>
                <p><strong>Organizer Contact:</strong> {market.organizerContact}</p>
                <p><strong>Fee:</strong> ${market.fee}</p>
                <p><strong>Estimated Profit:</strong> ${market.estimatedProfit}</p>
                <p><strong>Description:</strong> {market.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {market.requirements?.map((req: string) => {
                  const { status, icon } = getDocumentStatus(req);
                  return (
                    <div key={req} className="flex items-center justify-between">
                      <span className="flex items-center">{icon}<span className="ml-2">{req}</span></span>
                      <Badge variant={status === 'Uploaded' ? 'default' : 'destructive'}>{status}</Badge>
                    </div>
                  );
                })}
                {!market.requirements || market.requirements.length === 0 && <p>No specific documents required for this market.</p>}
              </CardContent>
            </Card>
            <Button className="w-full">Apply to Market</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketProfile;

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Zap, 
  CreditCard, 
  BarChart3, 
  Smartphone,
  Send,
  Mail,
  Phone,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Help = () => {
  const [showChatForm, setShowChatForm] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !email.trim() || !subject.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending message
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setChatMessage("");
    setEmail("");
    setSubject("");
    setShowChatForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <BreadcrumbNav />
        
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Help & Support
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get help with VendFrog and learn about upcoming features.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Support */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  support@vendfrog.com
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  1-800-VENDFROG
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Mon-Fri 9AM-6PM EST
                </div>
              </div>
              
              {!showChatForm ? (
                <Button 
                  onClick={() => setShowChatForm(true)}
                  className="w-full"
                >
                  Let's Chat
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <Textarea
                    placeholder="Tell us how we can help..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSendMessage} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowChatForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Future Integrations */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Coming Soon: Powerful Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">Shopify Integration</span>
                      <Badge variant="secondary">Q1 2026</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sync your online store inventory with market setups automatically.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="font-medium">Square Real-time Tracking</span>
                      <Badge variant="secondary">Q1 2026</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live sales data and payment processing integration.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <span className="font-medium">Mobile App</span>
                      <Badge variant="secondary">Q2 2026</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage your markets on the go with our native mobile app.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium">AI Assistant</span>
                      <Badge variant="secondary">Q3 2026</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Smart recommendations for market optimization and planning.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Want to be notified when these features launch? 
                    <Button variant="link" className="p-0 ml-1 h-auto text-sm" onClick={() => setShowChatForm(true)}>
                      Let us know!
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How do I add my first market?</h4>
                <p className="text-sm text-muted-foreground">
                  Go to the Markets page and click "Add New Market" or use the "+" button in the upcoming markets section on your dashboard.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Can I track multiple markets at once?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! VendFrog supports unlimited markets. Add as many as you need and track them all in one place.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">How do I upload documents?</h4>
                <p className="text-sm text-muted-foreground">
                  Visit the Documents page and either drag & drop files or click "Browse Files" to upload permits, insurance, and other important documents.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use enterprise-grade encryption and security measures to protect your business data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Help;
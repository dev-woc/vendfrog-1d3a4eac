
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MarketCard = ({ market }: { market: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{market.name}</CardTitle>
        <CardDescription>{market.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{market.address}</p>
      </CardContent>
      <CardFooter>
        <Button>View Market</Button>
      </CardFooter>
    </Card>
  );
};

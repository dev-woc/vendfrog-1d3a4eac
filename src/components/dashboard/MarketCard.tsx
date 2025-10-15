
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const MarketCard = ({ market }: { market: any }) => {
  return (
    <Link to={`/market/${market.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{market.name}</CardTitle>
          <CardDescription>{market.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{market.address.street}</p>
        </CardContent>
        <CardFooter>
          <Button>View Market</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

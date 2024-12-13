import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Points } from "./Points";

export const UserStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Points />
      </CardContent>
    </Card>
  );
};

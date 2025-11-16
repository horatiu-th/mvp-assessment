import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center text-muted-foreground">
          Select a team above to view financial data
        </div>
      </CardContent>
    </Card>
  );
}

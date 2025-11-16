"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchRevenues, formatCurrency } from "../utils";

type RevenueChartProps = {
  teamId: string;
  teamName?: string;
};

export function RevenueChart({ teamId, teamName }: RevenueChartProps) {
  const revenuesQuery = useQuery({
    queryKey: ["revenues", teamId],
    queryFn: () => fetchRevenues(teamId),
    enabled: !!teamId,
  });

  const revenueData = revenuesQuery.data?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>
          {teamName ? `${teamName} revenue trends` : "Revenue trends"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {revenuesQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : revenuesQuery.isError ? (
          <div className="text-destructive py-8 text-center">
            Failed to load revenue data. Please try again.
          </div>
        ) : revenueData.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No revenue data available for this team
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="season_year"
                label={{
                  value: "Season Year",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Revenue ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Season Year: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

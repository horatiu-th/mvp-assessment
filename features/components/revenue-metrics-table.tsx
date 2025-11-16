"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { fetchRevenues, computeYoY, formatCurrency, formatYoY } from "../utils";
import type { RevenueWithYoY } from "../types";

type RevenueMetricsTableProps = {
  teamId: string;
  teamName?: string;
};

type SortColumn =
  | "season_year"
  | "revenue"
  | "revenueYoy"
  | "ebitda"
  | "ebitdaYoy";
type SortDirection = "asc" | "desc" | null;

export function RevenueMetricsTable({
  teamId,
  teamName,
}: RevenueMetricsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("season_year");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const revenuesQuery = useQuery({
    queryKey: ["revenues", teamId],
    queryFn: () => fetchRevenues(teamId),
    enabled: !!teamId,
  });

  const revenueData = revenuesQuery.data?.data || [];
  const revenueWithYoY = computeYoY(revenueData);

  const sortedData = useMemo(() => {
    if (!sortDirection) return revenueWithYoY;

    return [...revenueWithYoY].sort((a, b) => {
      let aValue: number | null;
      let bValue: number | null;

      switch (sortColumn) {
        case "season_year":
          aValue = a.season_year;
          bValue = b.season_year;
          break;
        case "revenue":
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case "revenueYoy":
          aValue = a.revenueYoy;
          bValue = b.revenueYoy;
          break;
        case "ebitda":
          aValue = a.ebitda;
          bValue = b.ebitda;
          break;
        case "ebitdaYoy":
          aValue = a.ebitdaYoy;
          bValue = b.ebitdaYoy;
          break;
        default:
          return 0;
      }

      // Handle null values - treat them as 0
      const aNum = aValue === null ? 0 : aValue;
      const bNum = bValue === null ? 0 : bValue;

      if (sortDirection === "asc") {
        return aNum < bNum ? -1 : aNum > bNum ? 1 : 0;
      } else {
        return aNum > bNum ? -1 : aNum < bNum ? 1 : 0;
      }
    });
  }, [revenueWithYoY, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: desc -> asc -> null -> desc
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection(null);
      } else {
        setSortDirection("desc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Metrics</CardTitle>
        <CardDescription>
          Year-over-year changes for {teamName || "selected team"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {revenuesQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : revenuesQuery.isError ? (
          <div className="text-destructive py-8 text-center">
            Failed to load revenue data. Please try again.
          </div>
        ) : revenueWithYoY.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No revenue data available for this team
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("season_year")}
                >
                  <div className="flex items-center">
                    Season Year
                    {getSortIcon("season_year")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("revenue")}
                >
                  <div className="flex items-center justify-end">
                    Revenue
                    {getSortIcon("revenue")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("revenueYoy")}
                >
                  <div className="flex items-center justify-end">
                    Revenue YoY
                    {getSortIcon("revenueYoy")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("ebitda")}
                >
                  <div className="flex items-center justify-end">
                    EBITDA
                    {getSortIcon("ebitda")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("ebitdaYoy")}
                >
                  <div className="flex items-center justify-end">
                    EBITDA YoY
                    {getSortIcon("ebitdaYoy")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.season_year}>
                  <TableCell className="font-medium">
                    {row.season_year}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.revenueYoy !== null ? (
                      <div className="flex items-center justify-end gap-1">
                        {row.revenueYoy >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={
                            row.revenueYoy >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatYoY(row.revenueYoy)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.ebitda)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.ebitdaYoy !== null ? (
                      <div className="flex items-center justify-end gap-1">
                        {row.ebitdaYoy >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={
                            row.ebitdaYoy >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatYoY(row.ebitdaYoy)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

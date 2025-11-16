"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTeams } from "../utils";

type TeamSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function TeamSelector({ value, onValueChange }: TeamSelectorProps) {
  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Selection</CardTitle>
        <CardDescription>Choose a team to view financial data</CardDescription>
      </CardHeader>
      <CardContent>
        {teamsQuery.isLoading ? (
          <Skeleton className="h-10 w-full max-w-sm" />
        ) : teamsQuery.isError ? (
          <div className="text-destructive">
            Failed to load teams. Please try again.
          </div>
        ) : !teamsQuery.data?.data.length ? (
          <div className="text-muted-foreground">No teams available</div>
        ) : (
          <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teamsQuery.data.data.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
}


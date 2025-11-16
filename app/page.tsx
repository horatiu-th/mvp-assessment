"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardHeader,
  TeamSelector,
  RevenueChart,
  RevenueMetricsTable,
  EmptyState,
} from "@/features/components";
import { fetchTeams } from "@/features/utils";

export default function Home() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const selectedTeamName = teamsQuery.data?.data.find(
    (t) => t.id === selectedTeamId
  )?.name;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="space-y-6">
        <DashboardHeader />

        <TeamSelector
          value={selectedTeamId}
          onValueChange={setSelectedTeamId}
        />

        {selectedTeamId && (
          <>
            <RevenueChart teamId={selectedTeamId} teamName={selectedTeamName} />
            <RevenueMetricsTable
              teamId={selectedTeamId}
              teamName={selectedTeamName}
            />
          </>
        )}

        {!selectedTeamId && <EmptyState />}
      </div>
    </div>
  );
}

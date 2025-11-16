import type { Team, RevenueData, RevenueWithYoY } from "../types";

export async function fetchTeams(): Promise<{ data: Team[] }> {
  const response = await fetch("/api/teams");
  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }
  return response.json();
}

export async function fetchRevenues(
  teamId: string
): Promise<{ data: RevenueData[] }> {
  const response = await fetch(`/api/revenues?teamId=${teamId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenues");
  }
  return response.json();
}

export function computeYoY(rows: RevenueData[]): RevenueWithYoY[] {
  const sorted = [...rows].sort((a, b) => a.season_year - b.season_year);
  return sorted.map((row, idx) => {
    const prev = sorted[idx - 1];
    const revenueYoy = prev
      ? ((row.revenue - prev.revenue) / prev.revenue) * 100
      : null;
    const ebitdaYoy = prev
      ? ((row.ebitda - prev.ebitda) / prev.ebitda) * 100
      : null;
    return { ...row, revenueYoy, ebitdaYoy };
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatYoY(yoy: number | null): string {
  if (yoy === null) return "—";
  const sign = yoy >= 0 ? "+" : "";
  return `${sign}${yoy.toFixed(1)}%`;
}


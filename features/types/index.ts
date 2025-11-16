export type Team = {
  id: string;
  name: string;
};

export type RevenueData = {
  season_year: number;
  revenue: number;
  ebitda: number;
};

export type RevenueWithYoY = RevenueData & {
  revenueYoy: number | null;
  ebitdaYoy: number | null;
};

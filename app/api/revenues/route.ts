export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      return NextResponse.json(
        { error: "teamId is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("financials")
      .select("season_year, revenue, ebitda")
      .eq("team_id", teamId)
      .order("season_year", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Convert numeric strings to numbers
    const formattedData = (data || []).map((item) => ({
      season_year: item.season_year,
      revenue: typeof item.revenue === "string" ? parseFloat(item.revenue) : item.revenue,
      ebitda: typeof item.ebitda === "string" ? parseFloat(item.ebitda) : item.ebitda,
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch revenues" },
      { status: 500 }
    );
  }
}


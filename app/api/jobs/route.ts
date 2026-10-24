import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/jobs";

export const revalidate = 3600; // 1 hour ISR

export async function GET() {
  try {
    const jobs = await getAllJobs();
    return NextResponse.json(
      {
        success: true,
        count: jobs.length,
        updatedAt: new Date().toISOString(),
        jobs,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch jobs aggregator feed",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAllNews } from "@/lib/news";

export const revalidate = 900; // 15 minutes cache

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const category = categoryParam === "AI" ? "AI" : "Top";

    const news = await getAllNews(category);
    return NextResponse.json(
      {
        success: true,
        count: news.length,
        category,
        updatedAt: new Date().toISOString(),
        news,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tech news feed",
      },
      { status: 500 }
    );
  }
}

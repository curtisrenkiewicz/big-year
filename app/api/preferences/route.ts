import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET user preferences
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Ensure User exists in database (required for foreign key constraint)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          email: (session as any)?.user?.email || null,
          name: (session as any)?.user?.name || null,
          image: (session as any)?.user?.image || null,
        },
      });
    }
    let prefs = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!prefs) {
      // Create default preferences
      prefs = await prisma.userPreferences.create({
        data: {
          userId,
          selectedCalendarIds: "[]",
          hiddenEventIds: "[]",
          showDaysOfWeek: true,
          showHidden: false,
          calendarColors: "{}",
          viewType: "year",
        },
      });
    }

    return NextResponse.json({
      selectedCalendarIds: JSON.parse(prefs.selectedCalendarIds),
      hiddenEventIds: JSON.parse(prefs.hiddenEventIds),
      showDaysOfWeek: prefs.showDaysOfWeek,
      showHidden: prefs.showHidden,
      calendarColors: JSON.parse(prefs.calendarColors),
      viewType: prefs.viewType || "year",
    });
  } catch (error: any) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

// PUT/PATCH user preferences
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Ensure User exists in database (required for foreign key constraint)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          email: (session as any)?.user?.email || null,
          name: (session as any)?.user?.name || null,
          image: (session as any)?.user?.image || null,
        },
      });
    }
    let body;
    try {
      body = await req.json();
    } catch (parseError: any) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      selectedCalendarIds,
      hiddenEventIds,
      showDaysOfWeek,
      showHidden,
      calendarColors,
      viewType,
    } = body;

    const updateData: any = {};
    if (selectedCalendarIds !== undefined) {
      try {
        updateData.selectedCalendarIds = JSON.stringify(selectedCalendarIds);
      } catch (e) {
        console.error("Error stringifying selectedCalendarIds:", e);
        return NextResponse.json(
          { error: "Invalid selectedCalendarIds format" },
          { status: 400 }
        );
      }
    }
    if (hiddenEventIds !== undefined) {
      try {
        updateData.hiddenEventIds = JSON.stringify(hiddenEventIds);
      } catch (e) {
        console.error("Error stringifying hiddenEventIds:", e);
        return NextResponse.json(
          { error: "Invalid hiddenEventIds format" },
          { status: 400 }
        );
      }
    }
    if (showDaysOfWeek !== undefined) {
      if (typeof showDaysOfWeek !== "boolean") {
        return NextResponse.json(
          { error: "showDaysOfWeek must be a boolean" },
          { status: 400 }
        );
      }
      updateData.showDaysOfWeek = showDaysOfWeek;
    }
    if (showHidden !== undefined) {
      if (typeof showHidden !== "boolean") {
        return NextResponse.json(
          { error: "showHidden must be a boolean" },
          { status: 400 }
        );
      }
      updateData.showHidden = showHidden;
    }
    if (calendarColors !== undefined) {
      try {
        updateData.calendarColors = JSON.stringify(calendarColors);
      } catch (e) {
        console.error("Error stringifying calendarColors:", e);
        return NextResponse.json(
          { error: "Invalid calendarColors format" },
          { status: 400 }
        );
      }
    }
    if (viewType !== undefined) {
      if (typeof viewType !== "string") {
        return NextResponse.json(
          { error: "viewType must be a string" },
          { status: 400 }
        );
      }
      updateData.viewType = viewType;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      // Nothing to update, just return current preferences
      const existingPrefs = await prisma.userPreferences.findUnique({
        where: { userId },
      });
      if (!existingPrefs) {
        // Create default preferences if they don't exist
        const newPrefs = await prisma.userPreferences.create({
          data: {
            userId,
            selectedCalendarIds: "[]",
            hiddenEventIds: "[]",
            showDaysOfWeek: true,
            showHidden: false,
            calendarColors: "{}",
            viewType: "year",
          },
        });
        return NextResponse.json({
          selectedCalendarIds: JSON.parse(newPrefs.selectedCalendarIds),
          hiddenEventIds: JSON.parse(newPrefs.hiddenEventIds),
          showDaysOfWeek: newPrefs.showDaysOfWeek,
          showHidden: newPrefs.showHidden,
          calendarColors: JSON.parse(newPrefs.calendarColors),
          viewType: newPrefs.viewType || "year",
        });
      }
      return NextResponse.json({
        selectedCalendarIds: JSON.parse(existingPrefs.selectedCalendarIds),
        hiddenEventIds: JSON.parse(existingPrefs.hiddenEventIds),
        showDaysOfWeek: existingPrefs.showDaysOfWeek,
        showHidden: existingPrefs.showHidden,
        calendarColors: JSON.parse(existingPrefs.calendarColors),
        viewType: existingPrefs.viewType || "year",
      });
    }

    const prefs = await prisma.userPreferences.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        selectedCalendarIds: JSON.stringify(selectedCalendarIds || []),
        hiddenEventIds: JSON.stringify(hiddenEventIds || []),
        showDaysOfWeek: showDaysOfWeek ?? true,
        showHidden: showHidden ?? false,
        calendarColors: JSON.stringify(calendarColors || {}),
        viewType: viewType || "year",
      },
    });

    return NextResponse.json({
      selectedCalendarIds: JSON.parse(prefs.selectedCalendarIds),
      hiddenEventIds: JSON.parse(prefs.hiddenEventIds),
      showDaysOfWeek: prefs.showDaysOfWeek,
      showHidden: prefs.showHidden,
      calendarColors: JSON.parse(prefs.calendarColors),
      viewType: prefs.viewType || "year",
    });
  } catch (error: any) {
    console.error("Error updating preferences:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        error: error.message || "Failed to update preferences",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


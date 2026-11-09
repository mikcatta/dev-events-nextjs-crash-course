import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Event from '@/database/event.model';

// GET /api/events/my-event -> a single event, or 404 if it doesn't exist
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug: slugParam } = await params;

        // Slugs are stored trimmed and lowercase, so normalise the input the same way.
        const slug = slugParam.trim().toLowerCase();
        if (!slug) {
            return NextResponse.json({ message: 'Slug cannot be empty' }, { status: 400 });
        }

        await connectToDB();

        const event = await Event.findOne({ slug });
        if (!event) {
            return NextResponse.json({ message: `Event with slug "${slug}" not found` }, { status: 404 });
        }

        return NextResponse.json({ message: 'Event fetched successfully', event: event }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to fetch event', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}

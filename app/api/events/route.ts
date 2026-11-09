import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const formData = await req.formData();
        let event;

        try {
            //event = Object.fromEntries
            event = Object.fromEntries(formData.entries())
            //event = await req.json();

        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 400 });
        }

        const file = formData.get('image') as File | null;
        if (!file) {
            return NextResponse.json({ message: 'Image is required' }, { status: 400 });
        }

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);


        const uploadResult = await new Promise((resolve, reject) => {
            const cloudinary = require('cloudinary').v2;
            
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);  
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createEvent = await Event.create({
            ... event, tags: tags, agenda: agenda
        });
        return NextResponse.json({ message: 'Event created successfully', data: createEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to create event', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
   }
}

// GET /api/events               -> all events
// GET /api/events?slug=my-event -> a single event, or 404 if it doesn't exist
export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const slugParam = req.nextUrl.searchParams.get('slug');

        if (slugParam !== null) {
            // Slugs are stored trimmed and lowercase, so normalise the input the same way.
            const slug = slugParam.trim().toLowerCase();
            if (!slug) {
                return NextResponse.json({ message: 'Slug cannot be empty' }, { status: 400 });
            }

            const event = await Event.findOne({ slug });
            if (!event) {
                return NextResponse.json({ message: `Event with slug "${slug}" not found` }, { status: 404 });
            }

            return NextResponse.json({ message: 'Event fetched successfully', data: event }, { status: 200 });
        }

        const events = (await Event.find({}));
        return NextResponse.json({ message: 'Events fetched successfully', data: events }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to fetch events', error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
}


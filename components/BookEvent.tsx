'use client';

import { useState } from "react";
import { createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({eventId, slug}: {eventId:'string', slug:'string'}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        const {success} = await createBooking({eventId, slug, email});

        if (success) {
            setSubmitted(true);
            posthog.capture('event_booked', {eventId, slug, email})
        } else {
            console.log('Booking creation failed');
            posthog.captureException('Booking creation failed!');
        }
        e.preventDefault;

        /*setTimeout(() => {
            setSubmitted(true);
        }, 1000);*/
    }

    return (
        <div id="book-event" className="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for booking your spot! We will send you a confirmation email shortly.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email address"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="button-submit" onClick={(e) => {
                            e.preventDefault();
                            setSubmitted(true);
                        }}>
                            Book Event
                        </button>


                    </div>
                </form>
            )}
        </div>
    )
}

export default BookEvent

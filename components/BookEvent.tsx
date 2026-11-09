'use client';

import { useState } from "react";

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault;

        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
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

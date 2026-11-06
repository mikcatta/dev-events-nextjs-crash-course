import Link from 'next/link'
import Image from 'next/image'


const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src="/icons/logo.svg" alt="Logo" width={24} height={24} />
                    <p>Dev Events</p>
                </Link>

                <ul className="nav-links">
                    <Link href="/">Home</Link>
                    <Link href="/about">Events</Link>
                    <Link href="/contact">Create Event</Link>
                </ul>
            </nav>
        </header>


    )
}

export default Navbar

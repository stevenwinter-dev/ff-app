import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <ul className="flex space-x-4 p-4">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
                <li>
                    <Link href="/polls">Polls</Link>
                </li>
                <li>
                    <Link href="/players">Players</Link>
                </li>
            </ul>
        </nav>
    );
};

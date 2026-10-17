import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Every Time We Touch · Piano & lyrics', description: 'A quiet space to sing. Piano accompaniment with synchronized lyrics.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

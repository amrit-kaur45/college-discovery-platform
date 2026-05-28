import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CampusIQ — College Discovery Platform',
  description: 'Discover, compare and choose the best college for your future.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">
            <p className="font-display text-white text-lg font-semibold mb-1">CampusIQ</p>
            <p>© 2024 CampusIQ. Built for the College Discovery Track.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

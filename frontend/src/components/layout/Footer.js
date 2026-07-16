import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ApiStatus from './ApiStatus';

const FOOTER_LINKS = {
  Product: [
    { label: 'Predict a Match', href: '/predict' },
    { label: 'Upcoming Schedule', href: '/schedule' },
    { label: 'Team Analytics', href: '/analytics' },
  ],
  Account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  Info: [
    { label: 'About', href: '/about' },
    { label: 'API Docs', href: '/docs' },
    { label: 'GitHub', href: 'https://github.com/Vansh2905/Winlytics' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-bold text-base">Winlytics</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered cricket match predictions. Accurate, fast, data-driven.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold mb-3">{group}</h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Winlytics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <ApiStatus />
          </div>
        </div>
      </div>
    </footer>
  );
}

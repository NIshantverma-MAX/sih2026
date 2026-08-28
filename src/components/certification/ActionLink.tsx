import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface ActionLinkProps {
  /** Internal app route. Takes precedence over `href`. */
  to?: string;
  /** External URL — opens in a new tab and gets an external-link icon. */
  href?: string;
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

/**
 * A link that looks like a `Button`.
 *
 * The certification page is full of navigation actions, and wrapping a `<button>` in an
 * anchor is invalid markup, so these stay real links. The classes mirror `ui/Button`'s
 * primary/outline + sm styles — keep them in step if Button's tokens change.
 */
export const ActionLink: React.FC<ActionLinkProps> = ({ to, href, variant = 'outline', children, className }) => {
  const styles = cn(
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variant === 'primary'
      ? 'bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900'
      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200',
    className
  );

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
      {children}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
};

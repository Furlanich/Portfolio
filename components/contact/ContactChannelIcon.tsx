import { Mail, Phone } from 'lucide-react';
import type { ContactAction } from '@/components/foundation/content-types';

type ContactChannelIconProps = {
  kind: ContactAction['kind'];
  className: string;
};

export function ContactChannelIcon({ kind, className }: ContactChannelIconProps) {
  const props = { className, width: 20, height: 20, strokeWidth: 1.8, 'aria-hidden': true, focusable: false } as const;

  if (kind === 'email') return <Mail {...props} />;
  if (kind === 'phone') return <Phone {...props} />;

  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 11.75a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.3-4.85a8.5 8.5 0 1 1 16.2-3.9Z" />
      <path d="m8.3 7.3 1.5-.3 1 2.4-1.1 1.2a9 9 0 0 0 3.7 3.7l1.2-1.1 2.4 1-.3 1.5c-.1.6-.7 1-1.3.9-4.3-.6-7.7-4-8.3-8.3-.1-.6.3-1.2.9-1.3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

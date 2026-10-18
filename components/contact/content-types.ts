import type { ContactContent } from '@/components/foundation/content-types';
import type { ConnectedWordBinding } from '@/lib/connected-studio/types';

export type ContactPageContent = ContactContent & {
  wordBindings: readonly ConnectedWordBinding[];
  channels: { heading: string; note: string; privacyContext: string };
  privacyLabel: string;
};

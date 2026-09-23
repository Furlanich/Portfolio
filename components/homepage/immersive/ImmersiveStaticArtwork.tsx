import Image from 'next/image';
import { withBasePath } from '@/lib/paths';
import type { InstrumentMediaEntry } from '@/lib/immersive-home/types';
import styles from './immersive-home.module.css';

interface ImmersiveStaticArtworkProps {
  poster: InstrumentMediaEntry;
  className: string;
  priority?: boolean;
}

// Decorative brand-motion poster: the adjacent HTML heading and description carry the
// chapter meaning, so the image has an empty alternative text and no caption.
export function ImmersiveStaticArtwork({ poster, className, priority = false }: ImmersiveStaticArtworkProps) {
  return (
    <div
      data-instrument-artwork={poster.chapter}
      className={`${styles.frame} ${className}`}
    >
      <Image
        src={withBasePath(poster.src)}
        alt=""
        width={poster.width}
        height={poster.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        sizes="(min-width: 1024px) 54vw, 100vw"
      />
    </div>
  );
}

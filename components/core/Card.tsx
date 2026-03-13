'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <motion.div
      whileHover={
        hoverable
          ? {
              y: -4,
              boxShadow: '0 16px 35px -20px rgba(15, 17, 21, 0.35)'
            }
          : undefined
      }
      className={cn(
        'rounded-xl border border-paper-200 bg-white/90 shadow-soft transition-shadow duration-200',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
import React, { ReactNode } from 'react';
import { cn } from '../components/ui/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'purple' | 'purple-dark' | 'purple-light';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = false,
  glow = false,
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20',
    purple: 'bg-[#7700CE]/10 border-[#7700CE]/20 hover:bg-[#7700CE]/15 hover:border-[#7700CE]/30',
    'purple-dark': 'bg-[#5500AA]/10 border-[#5500AA]/20 hover:bg-[#5500AA]/15 hover:border-[#5500AA]/30',
    'purple-light': 'bg-[#9933FF]/10 border-[#9933FF]/20 hover:bg-[#9933FF]/15 hover:border-[#9933FF]/30',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl md:rounded-3xl p-4 md:p-5',
        'backdrop-blur-md',
        'border',
        'transition-all duration-300',
        variantStyles[variant],
        hover && 'hover:scale-[1.02]',
        glow && 'shadow-[0_0_30px_rgba(119,0,206,0.15)]',
        className
      )}
    >
      {children}
    </div>
  );
};
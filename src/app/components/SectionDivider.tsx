import { motion } from 'motion/react';

interface SectionDividerProps {
  variant?: 'line' | 'gradient' | 'dots';
  color?: 'purple' | 'white';
}

export default function SectionDivider({ variant = 'gradient', color = 'purple' }: SectionDividerProps) {
  if (variant === 'line') {
    return (
      <div className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`h-px w-full ${
              color === 'purple' 
                ? 'bg-gradient-to-r from-transparent via-[#7700CE] to-transparent' 
                : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
            }`}
          />
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`w-2 h-2 rounded-full ${
                  color === 'purple' ? 'bg-[#7700CE]' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gradient variant (default)
  return null;
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  /** 'light' = tarjetas claras (default historico). 'dark' = hairline sobre lienzo oscuro. */
  variant?: 'light' | 'dark';
}

export default function FAQAccordion({ items, variant = 'light' }: FAQAccordionProps) {
  const isDark = variant === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Schema markup para SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  return (
    <>
      {/* Schema markup para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
        {items.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <GlassCard
              className={
                isDark
                  ? 'overflow-hidden !rounded-lg bg-white/[0.02] border-white/10 hover:border-[#9933FF]/30'
                  : 'overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200'
              }
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-start justify-between gap-4 text-left transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3
                  className={`heading text-sm md:text-base flex-1 pr-4 ${isDark ? 'text-white' : 'text-black'}`}
                  itemProp="name"
                >
                  {faq.q}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                    isDark ? 'rounded-md border border-white/10 bg-white/[0.03]' : 'rounded-full bg-[#7700CE]/20'
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className={isDark ? 'text-[#CC66FF]' : 'text-[#7700CE]'} size={20} />
                  ) : (
                    <Plus className={isDark ? 'text-[#CC66FF]' : 'text-[#7700CE]'} size={20} />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p
                      className={`pt-4 leading-relaxed text-sm md:text-base ${isDark ? 'text-white/60' : 'text-gray-700'}`}
                      itemProp="text"
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </>
  );
}
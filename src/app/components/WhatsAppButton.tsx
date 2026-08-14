import { MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

interface WhatsAppButtonProps {
  message?: string;
}

export default function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const { openAssistant } = useApp();
  
  const handleClick = () => {
    openAssistant(undefined, 'recibir información sobre los servicios de marketing digital');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black border-2 border-[#7700CE] shadow-[0_0_30px_rgba(119,0,206,0.6),0_0_60px_rgba(119,0,206,0.3)] flex items-center justify-center group hover:scale-110 hover:shadow-[0_0_40px_rgba(119,0,206,0.8),0_0_80px_rgba(119,0,206,0.4)] transition-all duration-300 overflow-hidden cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      aria-label="Abrir asistente virtual"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="w-full h-full flex items-center justify-center relative z-10"
      >
        <img 
          src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/robot-asistente.webp" 
          alt="Asistente Virtual"
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
      </motion.div>
      
      {/* Sparkle */}
      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 text-yellow-300 animate-pulse z-20" />
    </motion.button>
  );
}
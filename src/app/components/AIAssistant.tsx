import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { contenido } from '../cms';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

type Step = 'welcome' | 'service' | 'name' | 'email' | 'phone' | 'company' | 'objective' | 'budget' | 'urgency' | 'final';

export default function AIAssistant() {
  const tVen = contenido('asistente', 'ventana');
  const tCon = contenido('asistente', 'conversacion');
  const tOpc = contenido('asistente', 'opciones');
  const { addLead, services, settings, isAssistantOpen, preselectedService, initialContext, closeAssistant } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [inputValue, setInputValue] = useState('');
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    objective: '',
    budget: '',
    urgency: ''
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar con servicio preseleccionado y contexto
  useEffect(() => {
    if (isAssistantOpen && !hasInitialized) {
      setHasInitialized(true);
      setMessages([]);
      
      setTimeout(() => {
        addMessage(tCon('saludo', '¡Hola! 👋 Soy el asistente virtual de INÉDITO DIGITAL. Estoy aquí para ayudarte a encontrar la solución perfecta para hacer crecer tu negocio.'), 'bot');
        
        // Si hay contexto inicial (ej: "cotizar", "agendar consulta")
        if (initialContext) {
          setTimeout(() => {
            addMessage(`Entiendo que quieres ${initialContext}. ${preselectedService ? `¡Perfecto! Te ayudaré con ${preselectedService}. 🎯` : '¡Genial! Te ayudaré con eso. 🎯'}`, 'bot');
            
            if (preselectedService) {
              setLeadData(prev => ({ ...prev, service: preselectedService }));
            }
            
            setTimeout(() => {
              if (!preselectedService) {
                // Si hay contexto pero no servicio, preguntar servicio
                addMessage(tCon('que_servicio', '¿Qué servicio te interesa más?'), 'bot');
                setTimeout(() => {
                  const serviceOptions = services.slice(0, 6).map((s, i) => `${i + 1}️⃣ ${s.title}`).join('\n');
                  addMessage(`Tenemos:\n${serviceOptions}\n\nEscribe el número del servicio que te interesa.\n\n💡 Si no encuentras lo que buscas, no estás seguro o tienes una necesidad muy específica, escríbeme brevemente qué necesitas y lo analizaremos juntos.`, 'bot');
                  setCurrentStep('service');
                }, 800);
              } else {
                // Si hay servicio, ir directo a captura de datos
                addMessage(tCon('pedir_datos', 'Déjame capturar tus datos para prepararte una cotización personalizada.'), 'bot');
                setTimeout(() => {
                  addMessage(tCon('p_nombre', '¿Cuál es tu nombre?'), 'bot');
                  setCurrentStep('name');
                }, 800);
              }
            }, 800);
          }, 1000);
        } else if (preselectedService) {
          // Si hay servicio preseleccionado pero no contexto
          setLeadData(prev => ({ ...prev, service: preselectedService }));
          setTimeout(() => {
            addMessage(`Perfecto, veo que te interesa ${preselectedService}. 🎯`, 'bot');
            setTimeout(() => {
              addMessage(tCon('pedir_datos', 'Déjame capturar tus datos para prepararte una cotización personalizada.'), 'bot');
              setTimeout(() => {
                addMessage(tCon('p_nombre', '¿Cuál es tu nombre?'), 'bot');
                setCurrentStep('name');
              }, 800);
            }, 800);
          }, 1000);
        } else {
          // Flujo normal sin preselección
          setTimeout(() => {
            addMessage(tCon('que_servicio', '¿Qué servicio te interesa más?'), 'bot');
            setTimeout(() => {
              const serviceOptions = services.slice(0, 6).map((s, i) => `${i + 1}️⃣ ${s.title}`).join('\n');
              addMessage(`Tenemos:\n${serviceOptions}\n\nEscribe el número del servicio que te interesa.\n\n💡 Si no encuentras lo que buscas, no estás seguro o tienes una necesidad muy específica, escríbeme brevemente qué necesitas y lo analizaremos juntos.`, 'bot');
              setCurrentStep('service');
            }, 800);
          }, 1000);
        }
      }, 300);
    }
  }, [isAssistantOpen, hasInitialized, preselectedService, initialContext]);

  // Reset cuando se cierra
  useEffect(() => {
    if (!isAssistantOpen) {
      setHasInitialized(false);
      setCurrentStep('welcome');
      setLeadData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        objective: '',
        budget: '',
        urgency: ''
      });
    }
  }, [isAssistantOpen]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOpen = () => {
    // No se usa en este caso, ya que el asistente se abre desde el contexto
  };

  const handleClose = () => {
    closeAssistant();
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    processInput(inputValue);
    setInputValue('');
  };

  const processInput = (input: string) => {
    switch (currentStep) {
      case 'welcome':
      case 'service':
        // Mapear número a servicio
        const serviceMap: Record<string, string> = {};
        services.slice(0, 6).forEach((s, i) => {
          serviceMap[(i + 1).toString()] = s.title;
        });
        
        // Detectar si es un número o texto libre
        const isNumericChoice = input.trim() in serviceMap;
        const selectedService = serviceMap[input.trim()] || input;
        
        setLeadData(prev => ({ ...prev, service: selectedService }));
        
        setTimeout(() => {
          if (isNumericChoice) {
            // Respuesta para selección numérica
            addMessage(`Perfecto, ${selectedService} es una excelente elección. 🎯`, 'bot');
          } else {
            // Respuesta más natural para texto libre (sin repetir el mensaje del usuario)
            addMessage(tCon('entiendo', '¡Entiendo perfectamente! Esto es justo lo que hacemos. 🎯'), 'bot');
            setTimeout(() => {
              addMessage(tCon('pedir_datos_2', 'Déjame capturar tus datos para que un especialista revise tu proyecto a detalle y te prepare una propuesta personalizada.'), 'bot');
            }, 800);
          }
          setTimeout(() => {
            addMessage(tCon('p_nombre', '¿Cuál es tu nombre?'), 'bot');
            setCurrentStep('name');
          }, isNumericChoice ? 800 : 1600);
        }, 500);
        break;

      case 'name':
        setLeadData(prev => ({ ...prev, name: input }));
        setTimeout(() => {
          addMessage(`Mucho gusto, ${input}. ¿Cuál es tu correo electrónico?`, 'bot');
          setCurrentStep('email');
        }, 500);
        break;

      case 'email':
        if (!/\S+@\S+\.\S+/.test(input)) {
          setTimeout(() => {
            addMessage(tCon('p_email_mal', 'Por favor ingresa un correo electrónico válido.'), 'bot');
          }, 500);
          return;
        }
        setLeadData(prev => ({ ...prev, email: input }));
        setTimeout(() => {
          addMessage(tCon('p_whatsapp', 'Excelente. ¿Cuál es tu número de WhatsApp?'), 'bot');
        }, 500);
        setCurrentStep('phone');
        break;

      case 'phone':
        setLeadData(prev => ({ ...prev, phone: input }));
        setTimeout(() => {
          addMessage(tCon('p_empresa', '¿De qué empresa nos contactas?'), 'bot');
          setTimeout(() => {
            addMessage('💡 Si eres freelancer o emprendedor independiente, escribe el nombre de tu proyecto o "Independiente".', 'bot');
          }, 600);
        }, 500);
        setCurrentStep('company');
        break;

      case 'company':
        setLeadData(prev => ({ ...prev, company: input }));
        setTimeout(() => {
          addMessage(tCon('p_objetivo', 'Perfecto. Ahora, ¿cuál es tu objetivo principal?'), 'bot');
          setTimeout(() => {
            addMessage(`Elige una opción:\n1️⃣ ${tOpc('obj_1', 'Vender más')}\n2️⃣ ${tOpc('obj_2', 'Generar leads')}\n3️⃣ ${tOpc('obj_3', 'Posicionamiento de marca')}\n4️⃣ ${tOpc('obj_4', 'Mejorar presencia digital')}`, 'bot');
          }, 600);
        }, 500);
        setCurrentStep('objective');
        break;

      case 'objective':
        const objectives: Record<string, string> = {
          '1': tOpc('obj_1', 'Vender más'),
          '2': tOpc('obj_2', 'Generar leads'),
          '3': tOpc('obj_3', 'Posicionamiento de marca'),
          '4': tOpc('obj_4', 'Mejorar presencia digital')
        };
        const objective = objectives[input] || input;
        setLeadData(prev => ({ ...prev, objective }));
        setTimeout(() => {
          addMessage(tCon('p_presupuesto', '¿Cuál es tu presupuesto mensual aproximado?'), 'bot');
          setTimeout(() => {
            addMessage(`Elige:\n1️⃣ ${tOpc('pre_1', '$5,000 - $15,000')}\n2️⃣ ${tOpc('pre_2', '$15,000 - $30,000')}\n3️⃣ ${tOpc('pre_3', '$30,000 - $50,000')}\n4️⃣ ${tOpc('pre_4', 'Más de $50,000')}`, 'bot');
          }, 600);
        }, 500);
        setCurrentStep('budget');
        break;

      case 'budget':
        const budgets: Record<string, string> = {
          '1': tOpc('pre_1', '$5,000 - $15,000'),
          '2': tOpc('pre_2', '$15,000 - $30,000'),
          '3': tOpc('pre_3', '$30,000 - $50,000'),
          '4': tOpc('pre_4', 'Más de $50,000')
        };
        const budget = budgets[input] || input;
        setLeadData(prev => ({ ...prev, budget }));
        setTimeout(() => {
          addMessage(tCon('p_cuando', '¿Cuándo te gustaría comenzar?'), 'bot');
          setTimeout(() => {
            addMessage('1️⃣ Esta semana\n2️⃣ Este mes\n3️⃣ En 1-3 meses\n4️⃣ Solo estoy investigando', 'bot');
          }, 600);
        }, 500);
        setCurrentStep('urgency');
        break;

      case 'urgency':
        const urgencies: Record<string, string> = {
          '1': 'Esta semana',
          '2': 'Este mes',
          '3': 'En 1-3 meses',
          '4': 'Solo estoy investigando'
        };
        const urgency = urgencies[input] || input;
        const updatedLeadData = { ...leadData, urgency };
        setLeadData(updatedLeadData);
        
        // Guardar lead
        addLead({
          ...updatedLeadData,
          source: 'AI Assistant',
          message: `Empresa: ${updatedLeadData.company} | Servicio: ${updatedLeadData.service} | Objetivo: ${updatedLeadData.objective} | Presupuesto: ${updatedLeadData.budget} | Urgencia: ${urgency}`
        });

        setTimeout(() => {
          addMessage(`¡Excelente, ${updatedLeadData.name}! `, 'bot');
          setTimeout(() => {
            addMessage(`He guardado tu información. Nuestro equipo revisará tu caso y te contactará pronto para crear una estrategia personalizada.`, 'bot');
            setTimeout(() => {
              addMessage(`¿Te gustaría hablar ahora mismo con un asesor por WhatsApp?`, 'bot');
              setCurrentStep('final');
            }, 1000);
          }, 800);
        }, 500);
        break;
    }
  };

  const handleWhatsApp = () => {
    // Limpiar número de WhatsApp (remover espacios, guiones, paréntesis, etc.)
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
    
    const message = `*NUEVO LEAD - INÉDITO DIGITAL* 🚀

👤 *Nombre:* ${leadData.name}
🏢 *Empresa:* ${leadData.company}

📋 *INFORMACIÓN DEL PROSPECTO*
━━━━━━━━━━━━━━━━━━━━

🎯 *Servicio de Interés:*
${leadData.service}

💼 *Objetivo del Proyecto:*
${leadData.objective}

💰 *Presupuesto Estimado:*
${leadData.budget}

⏰ *Nivel de Urgencia:*
${leadData.urgency}

━━━━━━━━━━━━━━━━━━━━

✅ *Lead capturado desde:* Asistente Virtual Web
📧 *Email:* ${leadData.email}
📱 *Teléfono:* ${leadData.phone}

_El prospecto está esperando respuesta..._`;

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    console.log('WhatsApp URL:', whatsappUrl);
    console.log('Número limpio:', cleanNumber);
    console.log('Lead Data:', leadData);
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[420px] md:max-w-md"
          >
            {/* Glass Card */}
            <div className="relative rounded-2xl md:rounded-3xl bg-black/95 backdrop-blur-2xl border border-white/20 shadow-[0_0_60px_rgba(119,0,206,0.4)] overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] md:max-h-[550px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-4 md:px-5 py-3 md:py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <img 
                      src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/robot-asistente.webp" 
                      alt="Asistente"
                      className="w-5 h-5 md:w-6 md:h-6 object-contain"
                    />
                  </div>
                  <div>
                    <div className="heading text-sm md:text-base text-white">{tVen('titulo', 'ASISTENTE IA')}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] md:text-xs text-white/80">{tVen('estado', 'En línea')}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors w-8 h-8 md:w-9 md:h-9 rounded-full hover:bg-white/10 flex items-center justify-center"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-h-0">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[80%] px-3 md:px-4 py-2 md:py-2.5 rounded-2xl shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-[#7700CE] to-[#9933FF] text-white'
                          : 'bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm'
                      }`}
                    >
                      <p className="text-xs md:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-3 md:p-4 bg-black/40 shrink-0">
                {currentStep === 'final' ? (
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 md:py-3.5 text-sm md:text-base font-bold rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Continuar en WhatsApp
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={tVen('placeholder', 'Escribe tu respuesta...')}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#7700CE] text-sm md:text-base h-11 md:h-12 rounded-xl"
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="bg-[#7700CE] hover:bg-[#9933FF] shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
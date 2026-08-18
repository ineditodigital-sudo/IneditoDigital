import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SERVICES, Service } from '../data/services';
import { BLOG_POSTS, BlogPost } from '../data/blog';
import { PORTFOLIO_ITEMS, PortfolioItem } from '../data/portfolio';

// Data version for cache invalidation
const DATA_VERSION = '2.0'; // Increment this when SERVICES, BLOG_POSTS, or PORTFOLIO_ITEMS structure changes

// Interfaces
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  industry?: string;
  objective?: string;
  urgency?: string;
  budget?: string;
  hasSite?: string;
  message?: string;
  source: string;
  date: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
}

export interface SiteSettings {
  whatsappNumber: string;
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  businessPhone: string;
  businessEmail: string;
  businessHours: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface AdminUser {
  username: string;
  passwordHash: string;
  mustChangePassword: boolean;
  lastLogin?: string;
}

interface AppContextType {
  // Data
  services: Service[];
  blogPosts: BlogPost[];
  portfolioItems: PortfolioItem[];
  leads: Lead[];
  settings: SiteSettings;
  adminUser: AdminUser | null;
  
  // Assistant state
  isAssistantOpen: boolean;
  preselectedService: string | null;
  initialContext: string | null;
  
  // Methods
  addLead: (lead: Omit<Lead, 'id' | 'date' | 'status'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateAdminPassword: (newPassword: string) => void;
  isAdminAuthenticated: () => boolean;
  openAssistant: (preselectedService?: string, context?: string) => void;
  closeAssistant: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LEADS: 'inedito_leads',
  SETTINGS: 'inedito_settings',
  SERVICES: 'inedito_services',
  BLOG: 'inedito_blog',
  PORTFOLIO: 'inedito_portfolio',
  ADMIN: 'inedito_admin',
  SESSION: 'inedito_session',
  DATA_VERSION: 'inedito_data_version'
};

const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: '5214491204353',
  businessName: 'INÉDITO DIGITAL',
  businessAddress: 'Jardines Eternos 902-Loc 2, Panorama',
  businessCity: 'Aguascalientes',
  businessState: 'AGS',
  businessZip: '20040',
  businessPhone: '+52 1 449 120 4353',
  businessEmail: 'contacto@inedito.digital',
  businessHours: 'Lun-Vie: 9:00-18:00'
};

// La autenticación real ocurre en el servidor (/api/admin_login.php) validando
// contra MySQL con bcrypt (password_verify). Ya NO se guardan credenciales en el
// código del cliente. Este objeto solo aporta el nombre de usuario por defecto.
const ADMIN_LOGIN_ENDPOINT = '/api/admin_login.php';
const ADMIN_TOKEN_KEY = 'inedito_admin_token';

const DEFAULT_ADMIN: AdminUser = {
  username: 'admin',
  passwordHash: '',
  mustChangePassword: false
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(DEFAULT_ADMIN);
  const [sessionActive, setSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | null>(null);
  const [initialContext, setInitialContext] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Check data version
      const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
      const isVersionMismatch = storedVersion !== DATA_VERSION;

      if (isVersionMismatch) {
        console.log('Data version mismatch detected. Clearing cached data...');
        // Clear cached content data but keep user data (leads, settings, admin)
        localStorage.removeItem(STORAGE_KEYS.SERVICES);
        localStorage.removeItem(STORAGE_KEYS.BLOG);
        localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
        localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
      }

      const storedLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      // Only load services from localStorage if version matches
      if (!isVersionMismatch) {
        const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (storedServices) {
          const parsedServices = JSON.parse(storedServices);
          // Validate that all required service IDs exist
          const requiredServiceIds = SERVICES.map(s => s.id);
          const storedServiceIds = parsedServices.map((s: Service) => s.id);
          const hasAllServices = requiredServiceIds.every(id => storedServiceIds.includes(id));
          
          if (hasAllServices) {
            setServices(parsedServices);
          } else {
            console.log('Missing services detected. Using default services...');
            setServices(SERVICES);
            localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SERVICES));
          }
        }

        const storedBlog = localStorage.getItem(STORAGE_KEYS.BLOG);
        if (storedBlog) setBlogPosts(JSON.parse(storedBlog));

        const storedPortfolio = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
        if (storedPortfolio) setPortfolioItems(JSON.parse(storedPortfolio));
      } else {
        // Version mismatch: use fresh data and save it
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SERVICES));
        localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(BLOG_POSTS));
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(PORTFOLIO_ITEMS));
      }

      const storedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN);
      if (storedAdmin) setAdminUser(JSON.parse(storedAdmin));

      const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session.expires > Date.now()) {
          setSessionActive(true);
        } else {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // On error, clear potentially corrupted data and use defaults
      console.log('Clearing corrupted localStorage data...');
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.BLOG);
      localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
      setServices(SERVICES);
      setBlogPosts(BLOG_POSTS);
      setPortfolioItems(PORTFOLIO_ITEMS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(adminUser));
    }
  }, [adminUser]);

  // Methods
  const addLead = (leadData: Omit<Lead, 'id' | 'date' | 'status'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      status: 'new'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(service =>
      service.id === id ? { ...service, ...updates } : service
    ));
  };

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog_${Date.now()}`
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(post =>
      post.id === id ? { ...post, ...updates } : post
    ));
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `portfolio_${Date.now()}`
    };
    setPortfolioItems(prev => [newItem, ...prev]);
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(ADMIN_LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok || !data.token) return false;

      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setSessionActive(true);
      const session = { expires: Date.now() + (8 * 60 * 60 * 1000) }; // 8 horas
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      setAdminUser(prev => prev ? {
        ...prev,
        username: data.user || username,
        lastLogin: new Date().toISOString()
      } : null);
      return true;
    } catch {
      return false;
    }
  };

  const logoutAdmin = () => {
    setSessionActive(false);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const updateAdminPassword = (_newPassword: string) => {
    // El cambio de contraseña es ahora una operación de servidor (pendiente de
    // endpoint). Se deja como no-op para NO almacenar credenciales en el cliente.
    setAdminUser(prev => prev ? { ...prev, mustChangePassword: false } : null);
  };

  const isAdminAuthenticated = (): boolean => {
    return sessionActive;
  };

  const openAssistant = (preselectedService?: string, context?: string) => {
    setIsAssistantOpen(true);
    setPreselectedService(preselectedService || null);
    setInitialContext(context || null);
  };

  const closeAssistant = () => {
    setIsAssistantOpen(false);
    setPreselectedService(null);
    setInitialContext(null);
  };

  const value: AppContextType = {
    services,
    blogPosts,
    portfolioItems,
    leads,
    settings,
    adminUser,
    addLead,
    updateLead,
    deleteLead,
    updateSettings,
    updateService,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    loginAdmin,
    logoutAdmin,
    updateAdminPassword,
    isAdminAuthenticated,
    isAssistantOpen,
    preselectedService,
    initialContext,
    openAssistant,
    closeAssistant
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
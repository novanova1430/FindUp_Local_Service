import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CustomerProfile, ProviderProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  customerProfile: CustomerProfile | null;
  providerProfile: ProviderProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  quickSwitch: (role: 'admin' | 'customer' | 'provider' | 'guest') => void;
  registerCustomer: (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => { success: boolean; error?: string; user?: User };
  registerProvider: (data: {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    category: string;
    experienceYears: number;
    bio: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    documentName?: string;
  }) => { success: boolean; error?: string; user?: User; provider?: ProviderProfile };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);

  const syncCurrentUser = () => {
    const currentId = storageService.getCurrentUserId();
    if (!currentId) {
      setUser(null);
      setCustomerProfile(null);
      setProviderProfile(null);
      return;
    }

    const foundUser = storageService.getUserById(currentId);
    if (!foundUser) {
      setUser(null);
      setCustomerProfile(null);
      setProviderProfile(null);
      return;
    }

    setUser(foundUser);
    if (foundUser.role === 'customer') {
      const cust = storageService.getCustomerByUserId(foundUser.id);
      setCustomerProfile(cust || null);
      setProviderProfile(null);
    } else if (foundUser.role === 'provider') {
      const prov = storageService.getProviderByUserId(foundUser.id);
      setProviderProfile(prov || null);
      setCustomerProfile(null);
    } else {
      setCustomerProfile(null);
      setProviderProfile(null);
    }
  };

  useEffect(() => {
    syncCurrentUser();

    const handleDataChanged = () => {
      syncCurrentUser();
    };

    window.addEventListener('fixflow_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('fixflow_data_changed', handleDataChanged);
    };
  }, []);

  const login = (email: string): { success: boolean; error?: string; user?: User } => {
    const found = storageService.getUserByEmail(email);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (!found.isActive) {
      return { success: false, error: 'Your account is deactivated. Please contact support.' };
    }

    storageService.setCurrentUserId(found.id);
    syncCurrentUser();
    return { success: true, user: found };
  };

  const logout = () => {
    storageService.setCurrentUserId(null);
    setUser(null);
    setCustomerProfile(null);
    setProviderProfile(null);
  };

  const quickSwitch = (target: 'admin' | 'customer' | 'provider' | 'guest') => {
    if (target === 'guest') {
      logout();
      return;
    }
    if (target === 'admin') {
      login('admin@fixflow.demo');
    } else if (target === 'customer') {
      login('customer@fixflow.demo');
    } else if (target === 'provider') {
      login('provider@fixflow.demo');
    }
  };

  const registerCustomer = (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    // Check existing email
    const existing = storageService.getUserByEmail(data.email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-cust-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: 'customer',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    storageService.addUser(newUser);

    const newProfile: CustomerProfile = {
      id: `cp-${Date.now()}`,
      userId: newUser.id,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      favoriteProviderIds: [],
    };
    storageService.addCustomer(newProfile);

    storageService.setCurrentUserId(newUser.id);
    syncCurrentUser();
    return { success: true, user: newUser };
  };

  const registerProvider = (data: {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    category: string;
    experienceYears: number;
    bio: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    documentName?: string;
  }) => {
    const existing = storageService.getUserByEmail(data.email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-prov-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: 'provider',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    storageService.addUser(newUser);

    const newProvider: ProviderProfile = {
      id: `prov-${Date.now()}`,
      userId: newUser.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      avatarUrl: newUser.avatarUrl || '',
      title: data.title,
      category: data.category,
      experienceYears: data.experienceYears,
      bio: data.bio,
      serviceCity: data.city,
      address: data.address,
      state: data.state,
      pincode: data.pincode,
      status: 'PENDING', // PENDING administrator review
      rating: 0,
      reviewCount: 0,
      startingPrice: 60,
      verified: false,
      skills: [data.category, 'General Maintenance', 'Inspection'],
      serviceAreas: [data.city],
      documentName: data.documentName || 'license_verification_doc.pdf',
      workingHours: {
        start: '09:00',
        end: '18:00',
        workingDays: [1, 2, 3, 4, 5],
        slotDurationMinutes: 90,
      },
      createdAt: new Date().toISOString(),
    };
    storageService.addProvider(newProvider);

    // Notify admin
    const admins = storageService.getUsers().filter((u) => u.role === 'admin');
    admins.forEach((admin) => {
      storageService.addNotification({
        userId: admin.id,
        title: 'New Provider Application',
        message: `${newProvider.fullName} has applied as a ${newProvider.title} (${newProvider.category}). Review submitted documents.`,
        type: 'approval',
      });
    });

    storageService.setCurrentUserId(newUser.id);
    syncCurrentUser();
    return { success: true, user: newUser, provider: newProvider };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerProfile,
        providerProfile,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        quickSwitch,
        registerCustomer,
        registerProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

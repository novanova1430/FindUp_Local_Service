import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BackNavigationBar } from '../navigation/BackNavigationBar';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      {!isHomePage && <BackNavigationBar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

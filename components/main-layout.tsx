"use client";

import { Header } from "./header";
import { Footer } from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 
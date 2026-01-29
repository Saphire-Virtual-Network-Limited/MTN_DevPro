import React from "react"
import { Sidebar } from "./Sidebar";


interface AuthLayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <div className="w-3/5 bg-gray-50 flex flex-col items-center justify-center p-12">
        {children}
      </div>
    </div>
  );
}

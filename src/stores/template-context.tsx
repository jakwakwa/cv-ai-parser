"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TemplateContextType {
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  resetTemplate: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

const STORAGE_KEY = "resume-template-selection";
const DEFAULT_TEMPLATE = "original";

interface TemplateProviderProps {
  children: ReactNode;
}

export const TemplateProvider: React.FC<TemplateProviderProps> = ({ children }) => {
  const [selectedTemplate, setSelectedTemplateState] = useState<string>(DEFAULT_TEMPLATE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedTemplateState(stored);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, selectedTemplate);
    }
  }, [selectedTemplate, isInitialized]);

  const setSelectedTemplate = (templateId: string) => {
    setSelectedTemplateState(templateId);
  };

  const resetTemplate = () => {
    setSelectedTemplateState(DEFAULT_TEMPLATE);
  };

  return (
    <TemplateContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate,
        resetTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};

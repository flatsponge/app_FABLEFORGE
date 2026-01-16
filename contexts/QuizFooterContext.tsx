import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface QuizFooterConfig {
  nextLabel: string;
  showNextButton: boolean;
}

interface QuizFooterContextType extends QuizFooterConfig {
  setFooter: (config: Partial<QuizFooterConfig> & { onNext?: () => void }) => void;
  triggerNext: () => void;
}

const QuizFooterContext = createContext<QuizFooterContextType | null>(null);

export function QuizFooterProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<QuizFooterConfig>({
    nextLabel: 'Continue',
    showNextButton: false,
  });
  
  const onNextRef = useRef<(() => void) | undefined>(undefined);

  const setFooter = useCallback((newConfig: Partial<QuizFooterConfig> & { onNext?: () => void }) => {
    const { onNext, ...rest } = newConfig;
    if (onNext !== undefined) {
      onNextRef.current = onNext;
    }
    if (Object.keys(rest).length > 0) {
      setConfig(prev => ({ ...prev, ...rest }));
    }
  }, []);

  const triggerNext = useCallback(() => {
    onNextRef.current?.();
  }, []);

  return (
    <QuizFooterContext.Provider value={{ ...config, setFooter, triggerNext }}>
      {children}
    </QuizFooterContext.Provider>
  );
}

export function useQuizFooter() {
  const context = useContext(QuizFooterContext);
  if (!context) {
    throw new Error('useQuizFooter must be used within QuizFooterProvider');
  }
  return context;
}

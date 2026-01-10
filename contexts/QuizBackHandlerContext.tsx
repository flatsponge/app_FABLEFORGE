import React, { createContext, useContext, useCallback, useRef } from 'react';

type BackHandler = () => boolean; // Returns true if handled, false to use default behavior

interface QuizBackHandlerContextType {
    registerBackHandler: (handler: BackHandler) => void;
    unregisterBackHandler: () => void;
    handleBack: () => boolean;
}

const QuizBackHandlerContext = createContext<QuizBackHandlerContextType | undefined>(undefined);

export function QuizBackHandlerProvider({ children }: { children: React.ReactNode }) {
    const handlerRef = useRef<BackHandler | null>(null);

    const registerBackHandler = useCallback((handler: BackHandler) => {
        handlerRef.current = handler;
    }, []);

    const unregisterBackHandler = useCallback(() => {
        handlerRef.current = null;
    }, []);

    const handleBack = useCallback(() => {
        if (handlerRef.current) {
            return handlerRef.current();
        }
        return false;
    }, []);

    return (
        <QuizBackHandlerContext.Provider value={{ 
            registerBackHandler, 
            unregisterBackHandler, 
            handleBack,
        }}>
            {children}
        </QuizBackHandlerContext.Provider>
    );
}

export function useQuizBackHandler() {
    const context = useContext(QuizBackHandlerContext);
    if (!context) {
        throw new Error('useQuizBackHandler must be used within QuizBackHandlerProvider');
    }
    return context;
}

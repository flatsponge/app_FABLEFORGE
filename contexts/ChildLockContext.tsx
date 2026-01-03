import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChildLockContextType {
    isChildLocked: boolean;
    setIsChildLocked: (locked: boolean) => void;
    isOnChildHub: boolean;
    setIsOnChildHub: (onChildHub: boolean) => void;
}

const ChildLockContext = createContext<ChildLockContextType | undefined>(undefined);

interface ChildLockProviderProps {
    children: ReactNode;
}

export function ChildLockProvider({ children }: ChildLockProviderProps) {
    const [isChildLocked, setIsChildLocked] = useState(false);
    const [isOnChildHub, setIsOnChildHub] = useState(false);

    return (
        <ChildLockContext.Provider
            value={{
                isChildLocked,
                setIsChildLocked,
                isOnChildHub,
                setIsOnChildHub,
            }}
        >
            {children}
        </ChildLockContext.Provider>
    );
}

export function useChildLock() {
    const context = useContext(ChildLockContext);
    if (context === undefined) {
        throw new Error('useChildLock must be used within a ChildLockProvider');
    }
    return context;
}

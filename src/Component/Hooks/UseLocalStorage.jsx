import { useEffect, useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key,
                    newValue: JSON.stringify(valueToStore),
                    storageArea: localStorage,
                })
            );
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Sync on external changes 
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.storageArea === localStorage) {
                try {
                    if (e.newValue) {
                        setStoredValue(JSON.parse(e.newValue));
                    } else {
                        setStoredValue(initialValue);
                    }
                } catch (err) {
                    console.warn('Error parsing storage event:', err);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);

    return [storedValue, setValue];
};

export default useLocalStorage;
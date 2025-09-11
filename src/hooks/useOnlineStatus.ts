import { useCallback, useEffect, useRef, useState } from 'react';

type OnlineStatusOptions = {
  onOffline?: () => void;
  onOnline?: () => void;
  onReconnect?: () => void;
};

/**
 * Custom hook to track online/offline status with SSR support
 * @param options - Callbacks for status changes
 * @returns Object containing current online status
 */
export const useOnlineStatus = (options: OnlineStatusOptions = {}) => {
  const { onOffline, onOnline, onReconnect } = options;

  // SSR-safe initialization
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    // During SSR, default to true (assume online)
    // On client, check actual status
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.onLine === 'boolean'
    ) {
      return navigator.onLine;
    }
    return true; // Optimistic default for SSR
  });

  // Track if we were previously offline for reconnection logic
  const wasOfflineRef = useRef(!isOnline);

  // Memoize the handler to avoid recreating on every render
  const handleStatusChange = useCallback(() => {
    if (typeof navigator === 'undefined') return;

    const currentlyOnline = navigator.onLine;
    setIsOnline(currentlyOnline);

    if (!currentlyOnline) {
      // Going offline
      wasOfflineRef.current = true;
      onOffline?.();
    } else {
      // Going online
      onOnline?.();

      // Only trigger reconnect if we were previously offline
      if (wasOfflineRef.current) {
        onReconnect?.();
        wasOfflineRef.current = false;
      }
    }
  }, [onOffline, onOnline, onReconnect]);

  useEffect(() => {
    // Skip in SSR environment
    if (typeof window === 'undefined') return;

    // Check initial status on mount (in case it changed during SSR)
    handleStatusChange();

    // Listen for online/offline events
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [handleStatusChange]);

  return { isOnline };
};

export default useOnlineStatus;

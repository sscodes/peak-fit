import { useState, useEffect } from 'react';

/**
 * Custom hook to track media query matches
 * @param query - Media query string (e.g., '(max-width: 750px)', '750px', '(min-width: 1024px)')
 * @returns boolean indicating if the media query matches
 */
const useMediaQuery = (query: string): boolean => {
  // Helper function to format the query string
  const formatQuery = (queryString: string): string => {
    // If it's just a number with px, assume it's a max-width query
    if (/^\d+px$/.test(queryString)) {
      return `(max-width: ${queryString})`;
    }

    // If it already contains parentheses, use as is
    if (queryString.includes('(') && queryString.includes(')')) {
      return queryString;
    }

    // Otherwise, wrap in parentheses
    return `(${queryString})`;
  };

  const formattedQuery = formatQuery(query);

  // Initialize state with current match
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(formattedQuery).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(formattedQuery);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [formattedQuery]);

  return matches;
};

export default useMediaQuery;

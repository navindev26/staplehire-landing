import { useState, useEffect } from 'react';

function readIsDark() {
  if (typeof document === 'undefined') return true;
  return document.documentElement.classList.contains('dark');
}

export function useTheme() {
  const [isDark, setIsDark] = useState(readIsDark);

  useEffect(() => {
    // Initial sync with localStorage (default to dark)
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme !== 'light';
    document.documentElement.classList.toggle('dark', shouldBeDark);
    setIsDark(shouldBeDark);

    // Keep every instance in sync by observing the global class
    const observer = new MutationObserver(() => setIsDark(readIsDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const next = !readIsDark();
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    // MutationObserver picks this up and updates every consumer.
  };

  return { isDark, toggleDarkMode };
}

import Script from 'next/script';

const themeScript = `
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    
    function applyTheme(themeValue) {
      document.documentElement.setAttribute('data-theme', themeValue);
    }
    
    function initializeTheme() {
      const theme = localStorage.getItem('theme') || 'system';
      applyTheme(theme);
    }
    
    // Initialize theme on load
    initializeTheme();
    
    // Listen for storage changes (from ThemeProvider)
    window.addEventListener('storage', function(e) {
      if (e.key === 'theme' || e.type === 'storage') {
        initializeTheme();
      }
    });
    
    // Listen for system theme changes when using system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme === 'system' || !currentTheme) {
        // Re-apply system theme to trigger CSS media query updates
        applyTheme('system');
      }
    });
    
  } catch (error) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export function ThemeScript() {
  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {themeScript}
    </Script>
  );
}

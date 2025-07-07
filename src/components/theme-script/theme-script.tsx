import Script from 'next/script';

const themeScript = `
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || 'system';
    
    function applyTheme(themeValue) {
      document.documentElement.setAttribute('data-theme', themeValue);
    }
    
    if (theme === 'system') {
      applyTheme('system');
    } else {
      applyTheme(theme);
    }
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', function(e) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'system' || !currentTheme) {
          document.documentElement.setAttribute('data-theme', 'system');
        }
      });
    }
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

import Script from 'next/script';

const themeScript = `
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    
    function applyTheme(themeValue) {
      document.documentElement.setAttribute('data-theme', themeValue);
    }
    
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // If no theme is saved, do not set data-theme here. 
      // Allow useTheme hook to determine initial theme client-side.
    }
    
    if (savedTheme === 'system' || !savedTheme) {
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

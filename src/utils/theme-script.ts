/**
 * Theme initialization script
 * Prevents flash of unstyled content by setting theme before hydration
 * Based on SkillBars theme implementation approach
 */

export const themeScript = `
(function() {
  try {
    // Get saved theme preference or default to system
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || 'system';
    
    // Function to apply theme
    function applyTheme(themeValue) {
      document.documentElement.setAttribute('data-theme', themeValue);
    }
    
    // Apply theme immediately
    if (theme === 'system') {
      // Let CSS media query handle system preference
      applyTheme('system');
    } else {
      // Apply explicit theme
      applyTheme(theme);
    }
    
    // Listen for system theme changes when using system preference
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', function(e) {
        // Only react if still using system theme
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'system' || !currentTheme) {
          // The CSS media query will handle the actual color changes
          // We just need to ensure the data-theme attribute is correct
          document.documentElement.setAttribute('data-theme', 'system');
        }
      });
    }
    
    // Listen for theme changes in localStorage
    window.addEventListener('storage', function(e) {
      if (e.key === 'theme') {
        initializeTheme();
      }
    });
  } catch (error) {
    // Fallback to light theme if anything goes wrong
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export const getThemeScriptTag = () => {
  return `<script>${themeScript}</script>`;
};

// Color palette as JS object for easy import
const _colors = {
  '--mint-light': '#d8b08c',
  '--teal-dark': '#1f3736',
  '--charcoal': '#565854',
  '--mint-background': '#c4f0dc',
  '--bronze-dark': '#a67244',
  '--peach': '#f9b87f',
  '--coffee': '#3e2f22',
  '--teal-main': '#116964',
  '--light-grey-background': '#f5f5f5',
  '--off-white': '#faf4ec',
  '--light-brown-border': '#a49990',
  '--light-grey-border': '#cecac6',
};

const appColors = {
  '--app-teal-main': '#116964',
  '--app-light-grey-background': '#f5f5f5',
  '--app-bronze-dark': '#a67244',
  '--app-coffee': '#3e2f22',
  '--app-charcoal': '#565854',
  '--app-off-white': '#faf4ec',
  '--app-light-brown-border': '#a49990',
  '--app-peach': '#f9b87f',
  '--app-mint-background': '#c4f0dc',
  '--app-mint-light': '#d8b08c',
  '--app-teal-dark': '#1f3736',
};

const resumeColors = {
  '--resume-job-title': '#116964', // ExpJobTitle, SubIcons, ProfileHeaderSubTitle
  '--resume-sub-icons': '#116964',
  '--resume-profile-header-subtitle': '#116964',
  '--resume-sidebar-background': '#f5f5f5', // SidebarBg
  '--resume-main-icons': '#a67244', // MainIcns, SubTitles (Issuer,Companies)
  '--resume-sub-titles-issuer': '#a67244',
  '--resume-sub-titles-companies': '#a67244',
  '--resume-profile-name': '#565854', // ProfileName, SectionTitles, Dates
  '--resume-section-titles': '#565854',
  '--resume-dates': '#565854',
  '--resume-body-text': '#3e2f22', // bodyText
  '--resume-profile-header-background': '#faf4ec', // ProfileHeaderBg
  '--resume-skill-border': '#a49990',
};

const oldToNewResumeColorMap: Record<string, string> = {
  '--mint-light': '--resume-sub-icons',
  '--teal-dark': '--resume-profile-header-subtitle',
  '--charcoal': '--resume-profile-name',
  '--mint-background': '--resume-sidebar-background',
  '--bronze-dark': '--resume-main-icons',
  '--peach': '--resume-sub-icons', // Assuming peach maps to sub-icons for old schemes
  '--coffee': '--resume-body-text',
  '--teal-main': '--resume-job-title',
  '--light-grey-background': '--resume-sidebar-background',
  '--off-white': '--resume-profile-header-background',
  '--light-brown-border': '--resume-skill-border',
  '--light-grey-border': '--resume-skill-border', // Assuming this also maps to skill border
};

function migrateOldResumeColorsToNew(
  oldColors: Record<string, string>
): Record<string, string> {
  const newColors: Record<string, string> = {};
  let changed = false;

  for (const [oldKey, value] of Object.entries(oldColors)) {
    const newKey = oldToNewResumeColorMap[oldKey];
    if (newKey && newKey !== oldKey) {
      newColors[newKey] = value;
      changed = true;
    } else if (oldKey.startsWith('--resume-')) {
      newColors[oldKey] = value; // Keep new keys as is
    } else {
      // If an old key exists but doesn't have a direct new mapping, it might be an 'app' color,
      // or a color that's no longer directly customizable for resume.
      // For now, we'll omit it from the *resume* colors, assuming it's not relevant
      // to what the color picker should control, or it's an app-specific color.
      // If this causes issues, we may need to revisit and map it to a default resume color
      // or ensure all old resume-relevant keys have a mapping.
      console.warn(
        `Old resume color key '${oldKey}' found with no direct new mapping. Omitting from migrated resume colors.`
      );
      changed = true; // Still counts as a change if we omit it
    }
  }

  // If no migration happened but we started with old keys, ensure all new keys are present with their defaults
  if (
    !changed &&
    Object.keys(oldColors).some((key) => !key.startsWith('--resume-'))
  ) {
    return { ...resumeColors, ...newColors }; // Overlay new defaults
  }

  // Ensure all current resumeColors are present, using migrated values if available
  const finalColors = { ...resumeColors }; // Start with all default resume colors
  for (const [newKey, value] of Object.entries(newColors)) {
    finalColors[newKey as keyof typeof finalColors] = value; // Overlay with migrated values
  }

  return finalColors;
}

/* Color Theme Swatches in Hex */
/* Color Theme Swatches in Hex */
export { appColors, resumeColors, migrateOldResumeColorsToNew };

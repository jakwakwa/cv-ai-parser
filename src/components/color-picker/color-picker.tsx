'use client';

import { Palette, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './color-picker.module.css';

interface ColorScheme {
  name: string;
  colors: {
    '--resume-job-title': string;
    '--resume-sub-icons': string;
    '--resume-profile-header-subtitle': string;
    '--resume-sidebar-background': string;
    '--resume-main-icons': string;
    '--resume-sub-titles-issuer': string;
    '--resume-sub-titles-companies': string;
    '--resume-profile-name': string;
    '--resume-section-titles': string;
    '--resume-dates': string;
    '--resume-body-text': string;
    '--resume-profile-header-background': string;
    '--resume-skill-border': string;
  };
}

interface ColorPickerProps {
  currentColors: Record<string, string>;
  onColorsChange: (colors: Record<string, string>) => void;
}

const ColorPicker = ({ currentColors, onColorsChange }: ColorPickerProps) => {
  const defaultColors = {
    '--resume-job-title': '#116964',
    '--resume-sub-icons': '#116964',
    '--resume-profile-header-subtitle': '#116964',
    '--resume-sidebar-background': '#f5f5f5',
    '--resume-main-icons': '#a67244',
    '--resume-sub-titles-issuer': '#a67244',
    '--resume-sub-titles-companies': '#a67244',
    '--resume-profile-name': '#565854',
    '--resume-section-titles': '#565854',
    '--resume-dates': '#565854',
    '--resume-body-text': '#3e2f22',
    '--resume-profile-header-background': '#faf4ec',
    '--resume-skill-border': '#a49990',
  };

  const colorSchemes: ColorScheme[] = [
    {
      name: 'Default (Teal & Bronze)',
      colors: defaultColors,
    },
    {
      name: 'Elegant Gold & Slate',
      colors: {
        '--resume-job-title': '#7a6b3f', // gold
        '--resume-sub-icons': '#7a6b3f',
        '--resume-profile-header-subtitle': '#404143', // slate
        '--resume-sidebar-background': '#F0EEF1', // light background
        '--resume-main-icons': '#3d637f',
        '--resume-sub-titles-issuer': '#7a6b3f',
        '--resume-sub-titles-companies': '#7a6b3f',
        '--resume-profile-name': '#404143', // slate
        '--resume-section-titles': '#404143',
        '--resume-dates': '#404143',
        '--resume-body-text': '#27272F', // dark
        '--resume-profile-header-background': '#F0EEF1',
        '--resume-skill-border': '#A6A6A8', // muted grey
      },
    },
    {
      name: 'Minimalist Sand & Ink',
      colors: {
        '--resume-job-title': '#22211D', // ink
        '--resume-sub-icons': '#22211D',
        '--resume-profile-header-subtitle': '#E6DFD9', // sand
        '--resume-sidebar-background': '#FFFCF9', // lightest
        '--resume-main-icons': '#5d5a4b',
        '--resume-sub-titles-issuer': '#22211D',
        '--resume-sub-titles-companies': '#22211D',
        '--resume-profile-name': '#0D0D0B', // darkest
        '--resume-section-titles': '#0D0D0B',
        '--resume-dates': '#0D0D0D',
        '--resume-body-text': '#22211D',
        '--resume-profile-header-background': '#E6DFD9',
        '--resume-skill-border': '#E6DFD9', // sand
      },
    },
    {
      name: 'Modern Blue & Mint',
      colors: {
        '--resume-job-title': '#2D3340', // blue
        '--resume-sub-icons': '#BAD9D3', // mint
        '--resume-profile-header-subtitle': '#2E3442', // blue
        '--resume-sidebar-background': '#EDEBF0', // light
        '--resume-main-icons': '#9225a7',
        '--resume-sub-titles-issuer': '#9225a7',
        '--resume-sub-titles-companies': '#9225a7',
        '--resume-profile-name': '#2E3442',
        '--resume-section-titles': '#2E3442',
        '--resume-dates': '#2E3442',
        '--resume-body-text': '#2D3340',
        '--resume-profile-header-background': '#EDEBF0',
        '--resume-skill-border': '#9CC4C3', // mint
      },
    },
  ];

  const [selectedScheme, setSelectedScheme] = useState<string>(
    'Default (Teal & Bronze)'
  );

  const handleSchemeSelect = (scheme: ColorScheme) => {
    setSelectedScheme(scheme.name);
    onColorsChange(scheme.colors);
  };

  const handleReset = () => {
    setSelectedScheme('Default (Teal & Bronze)');
    onColorsChange(defaultColors);
  };

  const handleCustomColorChange = (colorKey: string, value: string) => {
    const updatedColors = {
      ...currentColors,
      [colorKey]: value,
    };
    onColorsChange(updatedColors);
    setSelectedScheme('Custom');
  };

  return (
    <Card className={styles.colorPickerCard}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>
          <Palette className={styles.iconSize} />
          Choose Color Scheme
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {/* Preset Color Schemes */}
        <div>
          <h4 className={styles.presetThemesTitle}>Preset Themes</h4>
          <div className={styles.gridContainer}>
            {colorSchemes.map((scheme) => (
              <button
                type="button"
                key={scheme.name}
                onClick={() => handleSchemeSelect(scheme)}
                className={`${styles.schemeButton} ${selectedScheme === scheme.name ? styles.selectedScheme : styles.unselectedScheme}`}
              >
                <div className={styles.schemeColorPreview}>
                  <div
                    className={styles.colorCircle}
                    style={{
                      backgroundColor: scheme.colors['--resume-job-title'],
                    }}
                  />
                  <div
                    className={styles.colorCircle}
                    style={{
                      backgroundColor: scheme.colors['--resume-main-icons'],
                    }}
                  />
                  <div
                    className={styles.colorCircle}
                    style={{
                      backgroundColor: scheme.colors['--resume-profile-name'],
                    }}
                  />
                  <div
                    className={styles.colorCircle}
                    style={{
                      backgroundColor:
                        scheme.colors['--resume-sidebar-background'],
                    }}
                  />
                  <div
                    className={styles.colorCircle}
                    style={{
                      backgroundColor: scheme.colors['--resume-skill-border'],
                    }}
                  />
                </div>
                <p className={styles.schemeName}>{scheme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Controls */}
        <div>
          <div className={styles.customColorHeader}>
            <h4 className={styles.customColorTitle}>Custom Colors</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className={styles.resetButton}
            >
              <RotateCcw className={styles.iconSize} />
              Reset
            </Button>
          </div>

          <div className={styles.customColorGrid}>
            <div>
              <label htmlFor="main-accent" className={styles.colorLabel}>
                Main Accent
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="main-accent"
                  type="color"
                  value={
                    currentColors['--resume-job-title'] ||
                    defaultColors['--resume-job-title']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-job-title',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
              </div>
            </div>

            <div>
              <label htmlFor="secondary" className={styles.colorLabel}>
                Secondary
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="secondary"
                  type="color"
                  value={
                    currentColors['--resume-main-icons'] ||
                    defaultColors['--resume-main-icons']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-main-icons',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Buttons & Main Icons
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="text-color" className={styles.colorLabel}>
                Text Color
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="text-color"
                  type="color"
                  value={
                    currentColors['--resume-profile-name'] ||
                    defaultColors['--resume-profile-name']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-profile-name',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Profile Name, Section Titles, Dates
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-header-background"
                className={styles.colorLabel}
              >
                Profile Header Background
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="profile-header-background"
                  type="color"
                  value={
                    currentColors['--resume-profile-header-background'] ||
                    defaultColors['--resume-profile-header-background']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-profile-header-background',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Background for Profile Header
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="sidebar-background" className={styles.colorLabel}>
                Sidebar Background
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="sidebar-background"
                  type="color"
                  value={
                    currentColors['--resume-sidebar-background'] ||
                    defaultColors['--resume-sidebar-background']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-sidebar-background',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Background for Sidebar
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="accent-light" className={styles.colorLabel}>
                Accent Light (Sub-Icons)
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="accent-light"
                  type="color"
                  value={
                    currentColors['--resume-sub-icons'] ||
                    defaultColors['--resume-sub-icons']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-sub-icons',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Highlights & Sub-Icons
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="body-text" className={styles.colorLabel}>
                Body Text
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="body-text"
                  type="color"
                  value={
                    currentColors['--resume-body-text'] ||
                    defaultColors['--resume-body-text']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-body-text',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Main content text
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="skill-border" className={styles.colorLabel}>
                Skill Border
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="skill-border"
                  type="color"
                  value={
                    currentColors['--resume-skill-border'] ||
                    defaultColors['--resume-skill-border']
                  }
                  onChange={(e) =>
                    handleCustomColorChange(
                      '--resume-skill-border',
                      e.target.value
                    )
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>
                  Border for skill badges
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div>
          <h4 className={styles.previewTitle}>Preview</h4>
          <div
            className={styles.previewSimulation}
            style={{
              backgroundColor:
                currentColors['--resume-profile-header-background'] ||
                defaultColors['--resume-profile-header-background'],
            }}
          >
            <div
              className={styles.previewHeaderText}
              style={{
                color:
                  currentColors['--resume-profile-name'] ||
                  defaultColors['--resume-profile-name'],
              }}
            >
              Name
            </div>
            <div
              className={styles.previewSubheaderText}
              style={{
                color:
                  currentColors['--resume-profile-header-subtitle'] ||
                  defaultColors['--resume-profile-header-subtitle'],
              }}
            >
              Title
            </div>
          </div>
          <div className={styles.previewTwoColumnLayout}>
            <div
              className={styles.previewSidebar}
              style={{
                backgroundColor:
                  currentColors['--resume-sidebar-background'] ||
                  defaultColors['--resume-sidebar-background'],
              }}
            >
              <div
                className={styles.previewSectionTitle}
                style={{
                  color:
                    currentColors['--resume-section-titles'] ||
                    defaultColors['--resume-section-titles'],
                  borderBottomColor:
                    currentColors['--resume-job-title'] ||
                    defaultColors['--resume-job-title'],
                }}
              >
                <span
                  className={styles.previewIcon}
                  style={{
                    color:
                      currentColors['--resume-main-icons'] ||
                      defaultColors['--resume-main-icons'],
                  }}
                >
                  &#9993; {/* Mail icon */}
                </span>
                Contact
              </div>
              <div
                className={styles.previewDetailItem}
                style={{
                  color:
                    currentColors['--resume-body-text'] ||
                    defaultColors['--resume-body-text'],
                }}
              >
                <span
                  className={styles.previewSmallIcon}
                  style={{
                    color:
                      currentColors['--resume-sub-icons'] ||
                      defaultColors['--resume-sub-icons'],
                  }}
                >
                  &#9742; {/* Phone icon */}
                </span>
                email@example.com
              </div>
            </div>
            <div className={styles.previewContentArea}>
              <div
                className={styles.previewSectionTitle}
                style={{
                  color:
                    currentColors['--resume-section-titles'] ||
                    defaultColors['--resume-section-titles'],
                  borderBottomColor:
                    currentColors['--resume-job-title'] ||
                    defaultColors['--resume-job-title'],
                }}
              >
                Experience
              </div>
              <div
                className={styles.previewDetailItem}
                style={{
                  color:
                    currentColors['--resume-job-title'] ||
                    defaultColors['--resume-job-title'],
                }}
              >
                Job Title
              </div>
              <div
                className={styles.previewDetailItem}
                style={{
                  color:
                    currentColors['--resume-sub-titles-companies'] ||
                    defaultColors['--resume-sub-titles-companies'],
                }}
              >
                Company Name
              </div>
              <div
                className={styles.previewDetailItem}
                style={{
                  color:
                    currentColors['--resume-dates'] ||
                    defaultColors['--resume-dates'],
                }}
              >
                2020 - 2023
              </div>
              <div
                className={styles.previewSkillBadge}
                style={{
                  borderColor:
                    currentColors['--resume-skill-border'] ||
                    defaultColors['--resume-skill-border'],
                  color:
                    currentColors['--resume-body-text'] ||
                    defaultColors['--resume-body-text'],
                }}
              >
                Skill
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;

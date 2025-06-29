'use client';

import { Palette, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import styles from './ColorPicker.module.css';

interface ColorScheme {
  name: string;
  colors: {
    '--mint-light': string;
    '--teal-dark': string;
    '--charcoal': string;
    '--mint-background': string;
    '--bronze-dark': string;
    '--peach': string;
    '--coffee': string;
    '--teal-main': string;
    '--light-grey-background': string;
    '--off-white': string;
    '--light-brown-border': string;
    '--light-grey-border': string;
  };
}

interface ColorPickerProps {
  currentColors: Record<string, string>;
  onColorsChange: (colors: Record<string, string>) => void;
}

const ColorPicker = ({ currentColors, onColorsChange }: ColorPickerProps) => {
  const defaultColors = {
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
    '--light-brown-border': '#a49990c7',
    '--light-grey-border': '#cecac6',
  };

  const colorSchemes: ColorScheme[] = [
    {
      name: 'Default (Teal & Bronze)',
      colors: defaultColors,
    },
    {
      name: 'Professional Blue',
      colors: {
        '--mint-light': '#b8d4e3',
        '--teal-dark': '#1e3a5f',
        '--charcoal': '#2c3e50',
        '--mint-background': '#e8f4f8',
        '--bronze-dark': '#34495e',
        '--peach': '#85c1e9',
        '--coffee': '#1b2631',
        '--teal-main': '#2980b9',
        '--light-grey-background': '#f8f9fa',
        '--off-white': '#ffffff',
        '--light-brown-border': '#bdc3c7',
        '--light-grey-border': '#d5dbdb',
      },
    },
    {
      name: 'Modern Purple',
      colors: {
        '--mint-light': '#d1c4e9',
        '--teal-dark': '#4a148c',
        '--charcoal': '#424242',
        '--mint-background': '#f3e5f5',
        '--bronze-dark': '#6a1b9a',
        '--peach': '#ce93d8',
        '--coffee': '#2e1065',
        '--teal-main': '#8e24aa',
        '--light-grey-background': '#fafafa',
        '--off-white': '#ffffff',
        '--light-brown-border': '#b39ddb',
        '--light-grey-border': '#e1bee7',
      },
    },
    {
      name: 'Warm Orange',
      colors: {
        '--mint-light': '#ffcc80',
        '--teal-dark': '#bf360c',
        '--charcoal': '#3e2723',
        '--mint-background': '#fff3e0',
        '--bronze-dark': '#d84315',
        '--peach': '#ffab40',
        '--coffee': '#1e0a00',
        '--teal-main': '#f57c00',
        '--light-grey-background': '#fafafa',
        '--off-white': '#fffde7',
        '--light-brown-border': '#ffb74d',
        '--light-grey-border': '#ffe0b2',
      },
    },
    {
      name: 'Forest Green',
      colors: {
        '--mint-light': '#a5d6a7',
        '--teal-dark': '#1b5e20',
        '--charcoal': '#2e7d32',
        '--mint-background': '#e8f5e8',
        '--bronze-dark': '#388e3c',
        '--peach': '#81c784',
        '--coffee': '#0d3f0f',
        '--teal-main': '#43a047',
        '--light-grey-background': '#f1f8e9',
        '--off-white': '#f9fbe7',
        '--light-brown-border': '#66bb6a',
        '--light-grey-border': '#c8e6c9',
      },
    },
    {
      name: 'Elegant Gray',
      colors: {
        '--mint-light': '#cfd8dc',
        '--teal-dark': '#263238',
        '--charcoal': '#37474f',
        '--mint-background': '#eceff1',
        '--bronze-dark': '#455a64',
        '--peach': '#90a4ae',
        '--coffee': '#102027',
        '--teal-main': '#546e7a',
        '--light-grey-background': '#fafafa',
        '--off-white': '#ffffff',
        '--light-brown-border': '#78909c',
        '--light-grey-border': '#b0bec5',
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
                    style={{ backgroundColor: scheme.colors['--teal-main'] }}
                  />
                  <div
                    className={styles.colorCircle}
                    style={{ backgroundColor: scheme.colors['--bronze-dark'] }}
                  />
                  <div
                    className={styles.colorCircle}
                    style={{ backgroundColor: scheme.colors['--charcoal'] }}
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
                    currentColors['--teal-main'] || defaultColors['--teal-main']
                  }
                  onChange={(e) =>
                    handleCustomColorChange('--teal-main', e.target.value)
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
                    currentColors['--bronze-dark'] ||
                    defaultColors['--bronze-dark']
                  }
                  onChange={(e) =>
                    handleCustomColorChange('--bronze-dark', e.target.value)
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>Buttons</span>
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
                    currentColors['--charcoal'] || defaultColors['--charcoal']
                  }
                  onChange={(e) =>
                    handleCustomColorChange('--charcoal', e.target.value)
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>Body text</span>
              </div>
            </div>

            <div>
              <label htmlFor="background" className={styles.colorLabel}>
                Background
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="background"
                  type="color"
                  value={
                    currentColors['--off-white'] || defaultColors['--off-white']
                  }
                  onChange={(e) =>
                    handleCustomColorChange('--off-white', e.target.value)
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>Sidebar</span>
              </div>
            </div>

            <div>
              <label htmlFor="accent-light" className={styles.colorLabel}>
                Accent Light
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="accent-light"
                  type="color"
                  value={currentColors['--peach'] || defaultColors['--peach']}
                  onChange={(e) =>
                    handleCustomColorChange('--peach', e.target.value)
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>Highlights</span>
              </div>
            </div>

            <div>
              <label htmlFor="dark-text" className={styles.colorLabel}>
                Dark Text
              </label>
              <div className={styles.colorInputContainer}>
                <input
                  id="dark-text"
                  type="color"
                  value={currentColors['--coffee'] || defaultColors['--coffee']}
                  onChange={(e) =>
                    handleCustomColorChange('--coffee', e.target.value)
                  }
                  className={styles.colorInput}
                />
                <span className={styles.colorDescription}>Content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div>
          <h4 className={styles.previewTitle}>Preview</h4>
          <div className={styles.previewContainer}>
            <div
              className={styles.previewName}
              style={{
                color:
                  currentColors['--charcoal'] || defaultColors['--charcoal'],
              }}
            >
              Your Name
            </div>
            <div
              className={styles.previewTitleText}
              style={{
                color:
                  currentColors['--teal-main'] || defaultColors['--teal-main'],
              }}
            >
              Professional Title
            </div>
            <div
              className={styles.previewContentText}
              style={{
                color: currentColors['--coffee'] || defaultColors['--coffee'],
              }}
            >
              This is how your resume content will look with the selected
              colors.
            </div>
            <div
              className={styles.previewButton}
              style={{
                backgroundColor:
                  currentColors['--bronze-dark'] ||
                  defaultColors['--bronze-dark'],
              }}
            >
              Button Style
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;

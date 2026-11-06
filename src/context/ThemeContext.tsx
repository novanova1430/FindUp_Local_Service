import React, { createContext, useContext, useEffect } from 'react';

export interface PaletteColors {
  green: string; // #ABC270 (Sage Olive)
  yellow: string; // #FEC868 (Honey Yellow)
  peach: string; // #FDA769 (Apricot Peach)
  espresso: string; // #473C33 (Deep Roasted Espresso)
  cream: string; // #FAF8F2 (Linen Cream Canvas)
}

export const PALETTE_18: PaletteColors = {
  green: '#ABC270',
  yellow: '#FEC868',
  peach: '#FDA769',
  espresso: '#473C33',
  cream: '#FAF8F2',
};

interface ThemeContextType {
  palette: PaletteColors;
}

const ThemeContext = createContext<ThemeContextType>({ palette: PALETTE_18 });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'palette-18');
    root.style.setProperty('--color-palette-green', PALETTE_18.green);
    root.style.setProperty('--color-palette-yellow', PALETTE_18.yellow);
    root.style.setProperty('--color-palette-peach', PALETTE_18.peach);
    root.style.setProperty('--color-palette-espresso', PALETTE_18.espresso);
    root.style.setProperty('--color-palette-cream', PALETTE_18.cream);
  }, []);

  return (
    <ThemeContext.Provider value={{ palette: PALETTE_18 }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

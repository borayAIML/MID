/**
 * Color Accessibility Utility
 * 
 * This utility provides functions to check and enhance color accessibility:
 * - Calculate contrast ratios between colors
 * - Check if colors meet WCAG accessibility standards
 * - Suggest alternative colors that maintain the same visual feel but with better accessibility
 * - Provide detailed reports on color accessibility
 */

// Define accessibility levels (WCAG 2.1)
export enum AccessibilityLevel {
  AA_SMALL = 'AA Small Text', // 4.5:1 for normal text
  AA_LARGE = 'AA Large Text', // 3:1 for large text
  AAA_SMALL = 'AAA Small Text', // 7:1 for normal text
  AAA_LARGE = 'AAA Large Text', // 4.5:1 for large text
}

// Define contrast ratio thresholds according to WCAG 2.1
export const ContrastThresholds = {
  [AccessibilityLevel.AA_SMALL]: 4.5,
  [AccessibilityLevel.AA_LARGE]: 3.0,
  [AccessibilityLevel.AAA_SMALL]: 7.0,
  [AccessibilityLevel.AAA_LARGE]: 4.5,
};

// Helper types for color values
export type HexColor = string; // '#ffffff'
export type RGBColor = { r: number; g: number; b: number }; // {r: 255, g: 255, b: 255}
export type HSLColor = { h: number; s: number; l: number }; // {h: 0, s: 0, l: 100}

// Result of an accessibility check
export interface AccessibilityCheckResult {
  contrastRatio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
  recommendedColors?: HexColor[];
  issueDescription?: string;
}

/**
 * Converts a HEX color string to RGB object
 */
export function hexToRgb(hex: HexColor): RGBColor | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse as hex
  if (hex.length === 3) {
    // Short notation (#rgb)
    const r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    const g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    const b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    return { r, g, b };
  } else if (hex.length === 6) {
    // Long notation (#rrggbb)
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }
  
  // Invalid hex color
  return null;
}

/**
 * Converts RGB to HEX
 */
export function rgbToHex(rgb: RGBColor): HexColor {
  const toHex = (value: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to RGB
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Calculates the relative luminance of a RGB color according to WCAG 2.1
 * Formula: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function calculateLuminance(rgb: RGBColor): number {
  // Convert RGB to sRGB
  const sR = rgb.r / 255;
  const sG = rgb.g / 255;
  const sB = rgb.b / 255;
  
  // Calculate linear RGB values
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates the contrast ratio between two colors according to WCAG 2.1
 * Formula: https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
export function calculateContrastRatio(color1: HexColor, color2: HexColor): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }
  
  const luminance1 = calculateLuminance(rgb1);
  const luminance2 = calculateLuminance(rgb2);
  
  // Ensure the lighter color is in the numerator
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines if a color combination meets WCAG standards
 */
export function checkAccessibility(foreground: HexColor, background: HexColor): AccessibilityCheckResult {
  const contrastRatio = calculateContrastRatio(foreground, background);
  
  return {
    contrastRatio,
    passesAA: contrastRatio >= ContrastThresholds[AccessibilityLevel.AA_SMALL],
    passesAAA: contrastRatio >= ContrastThresholds[AccessibilityLevel.AAA_SMALL],
    passesAALarge: contrastRatio >= ContrastThresholds[AccessibilityLevel.AA_LARGE],
    passesAAALarge: contrastRatio >= ContrastThresholds[AccessibilityLevel.AAA_LARGE],
  };
}

/**
 * Generates a human-readable description of accessibility issues
 */
export function generateAccessibilityReport(foreground: HexColor, background: HexColor): string {
  const result = checkAccessibility(foreground, background);
  const { contrastRatio } = result;
  
  let report = `Contrast ratio: ${contrastRatio.toFixed(2)}:1\n`;
  
  if (result.passesAAA) {
    report += '✅ Passes all WCAG contrast requirements (AAA)';
  } else if (result.passesAA) {
    report += '✅ Passes WCAG AA standard for all text\n';
    report += '❌ Does not pass AAA for normal text (requires 7:1)';
  } else if (result.passesAALarge) {
    report += '✅ Passes WCAG AA standard for large text only\n';
    report += '❌ Does not pass AA for normal text (requires 4.5:1)';
  } else {
    report += '❌ Fails all WCAG contrast requirements\n';
    report += 'Consider using an alternative color combination.';
  }
  
  return report;
}

/**
 * Adjusts color lightness while maintaining hue to improve contrast
 */
export function adjustColorForContrast(
  color: HexColor,
  backgroundColor: HexColor,
  targetRatio: number
): HexColor {
  const rgb = hexToRgb(color);
  const bgRgb = hexToRgb(backgroundColor);
  
  if (!rgb || !bgRgb) {
    throw new Error('Invalid color format');
  }
  
  const hsl = rgbToHsl(rgb);
  const bgLuminance = calculateLuminance(bgRgb);
  
  // Determine if we should increase or decrease lightness
  const shouldDarken = bgLuminance > 0.5;
  
  // Clone the original color
  const adjustedHsl = { ...hsl };
  
  // Step size for lightness adjustments
  const step = shouldDarken ? -1 : 1;
  let passes = false;
  let attempts = 0;
  const maxAttempts = 100; // Safety to prevent infinite loops
  
  while (!passes && attempts < maxAttempts) {
    // Adjust lightness
    adjustedHsl.l = Math.max(0, Math.min(100, adjustedHsl.l + step));
    
    // Convert to RGB and then to HEX
    const adjustedRgb = hslToRgb(adjustedHsl);
    const adjustedHex = rgbToHex(adjustedRgb);
    
    // Check if we've reached the target contrast ratio
    const currentRatio = calculateContrastRatio(adjustedHex, backgroundColor);
    passes = currentRatio >= targetRatio;
    
    attempts++;
    
    // If we've reached 0% or 100% lightness and still don't pass, break
    if ((adjustedHsl.l <= 0 || adjustedHsl.l >= 100) && !passes) {
      break;
    }
  }
  
  // Return the adjusted color or the original if we couldn't reach the target
  return passes ? rgbToHex(hslToRgb(adjustedHsl)) : color;
}

/**
 * Generates multiple color alternatives for better accessibility
 */
export function suggestAccessibleAlternatives(
  color: HexColor,
  backgroundColor: HexColor
): HexColor[] {
  const result = checkAccessibility(color, backgroundColor);
  
  // If already passes AAA, no need for suggestions
  if (result.passesAAA) {
    return [];
  }
  
  const rgb = hexToRgb(color);
  if (!rgb) return [];
  
  const hsl = rgbToHsl(rgb);
  const suggestions: HexColor[] = [];
  
  // Suggestion 1: Adjust contrast while keeping same hue
  const aaColor = adjustColorForContrast(
    color,
    backgroundColor,
    ContrastThresholds[AccessibilityLevel.AA_SMALL]
  );
  suggestions.push(aaColor);
  
  // Suggestion 2: Adjust for AAA standard
  const aaaColor = adjustColorForContrast(
    color,
    backgroundColor,
    ContrastThresholds[AccessibilityLevel.AAA_SMALL]
  );
  if (aaaColor !== aaColor) {
    suggestions.push(aaaColor);
  }
  
  // Suggestion 3: Try a slight hue variation
  const hueVariation = { ...hsl, h: (hsl.h + 15) % 360 };
  const hueVariationHex = rgbToHex(hslToRgb(hueVariation));
  const hueAccessible = adjustColorForContrast(
    hueVariationHex,
    backgroundColor,
    ContrastThresholds[AccessibilityLevel.AA_SMALL]
  );
  suggestions.push(hueAccessible);
  
  return suggestions;
}

/**
 * Comprehensive color accessibility check
 */
export function checkColorAccessibility(
  foreground: HexColor,
  background: HexColor
): AccessibilityCheckResult {
  const result = checkAccessibility(foreground, background);
  
  // Only suggest alternatives if we fail AA standard
  if (!result.passesAA) {
    result.recommendedColors = suggestAccessibleAlternatives(foreground, background);
    result.issueDescription = 'This color combination does not meet WCAG AA standards for normal text. Consider using one of the suggested alternatives.';
  }
  
  return result;
}

/**
 * Checks a color palette for accessibility issues
 */
export function checkPaletteAccessibility(
  palette: Record<string, string>,
  backgroundColor: HexColor
): Record<string, AccessibilityCheckResult> {
  const results: Record<string, AccessibilityCheckResult> = {};
  
  for (const [name, color] of Object.entries(palette)) {
    // Skip checking the background color against itself
    if (color === backgroundColor) continue;
    
    results[name] = checkColorAccessibility(color, backgroundColor);
  }
  
  return results;
}

/**
 * Checks if a color is dark enough to require white text
 */
export function requiresWhiteText(backgroundColor: HexColor): boolean {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return false;
  
  const luminance = calculateLuminance(rgb);
  return luminance < 0.5;
}
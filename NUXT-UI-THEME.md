# Catppuccin Theme for Nuxt UI

This document describes how the Catppuccin color palette has been applied to Nuxt UI components.

## Overview

The Catppuccin theme has been integrated into the application using:
1. CSS variables in `assets/styles/theme.css`
2. Tailwind color configurations in `tailwind.config.js`
3. Nuxt UI component styling in `app.config.ts`

## Theme Structure

The Catppuccin theme follows a consistent naming convention:

### Light Theme (Default)
- Background: `base`, `crust`, `mantle`
- Surface elements: `surface-0`, `surface-1`, `surface-2`
- Overlay elements: `overlay-0`, `overlay-1`, `overlay-2`
- Typography: `text`, `subtext-0`, `subtext-1`
- Accent colors: `rosewater`, `flamingo`, `pink`, `mauve`, `red`, `maroon`, `peach`, `yellow`, `green`, `teal`, `sky`, `sapphire`, `blue`, `lavender`

### Dark Theme (`.dark` class)
Same structure as light theme with different color values.

## Component Styling

The following Nuxt UI components have been styled with Catppuccin colors:

### NavigationMenu
- Uses neutral colors for borders and backgrounds
- Uses blue colors for badges and active links
- Provides proper hover states for both light and dark themes

### Card
- Light: Background color uses neutral-50
- Dark: Background color uses neutral-300 (surface-0)

### Button
- Multiple color variants: primary (blue), secondary (neutral), success (green), danger (red), warning (yellow)
- Multiple style variants: solid, outline, soft, ghost, link
- Each has proper light/dark mode styling

### Form Components
- FormGroup: Labels, descriptions, hints with proper text colors
- Input/Select/Textarea: Consistent styling with:
  - Light: White background with neutral-900 text
  - Dark: neutral-300 background with neutral-900 text
  - Focus states with blue accents
  - Error states with red accents

## Theme Switching

Theme switching is handled by the `ThemeToggle.vue` component, which:
1. Toggles the `.dark` class on both `document.body` and `document.documentElement`
2. Stores the user's preference in localStorage
3. Respects the user's system preference by default

## Usage

To use the themed components:

```vue
<template>
  <!-- Examples of Nuxt UI components with Catppuccin theme -->
  <UCard>
    <h2 class="text-lg font-medium">Card Title</h2>
    <p class="mt-2">Card content with Catppuccin styling</p>
  </UCard>

  <UButton color="primary">Primary Button</UButton>
  <UButton color="secondary" variant="outline">Secondary Button</UButton>
  
  <UForm>
    <UFormGroup label="Name">
      <UInput placeholder="Enter your name" />
    </UFormGroup>
  </UForm>
</template>
```

## Custom Utility Classes

The theme also provides utility classes for direct color usage:

```vue
<template>
  <div class="bg-surface-0">
    <p class="text-body">Regular text</p>
    <p class="text-blue">Blue text</p>
    <p class="text-mauve">Mauve text</p>
  </div>
</template>
```

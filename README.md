# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Catppuccin Theme

This project uses the [Catppuccin](https://github.com/catppuccin/catppuccin) color palette for its theming system. Catppuccin is a soothing pastel theme for the high-spirited.

### Theme Features

- Complete integration with Nuxt UI components
- Support for both light (Latte) and dark (Mocha) themes
- Custom utility classes for easy theme implementation
- Smooth transitions between themes

### Theme Pages

- `/theme` - Demonstrates the Catppuccin color palette
- `/ui-components` - Showcases themed Nuxt UI components
- `/catppuccin-utils` - Demonstrates utility classes and custom styling

### Documentation

For detailed information about the theme implementation, see:

- [THEME-CHANGES.md](./THEME-CHANGES.md) - Summary of changes made to implement the theme
- [NUXT-UI-THEME.md](./NUXT-UI-THEME.md) - Details about Nuxt UI component theming
- [theme-README.md](./theme-README.md) - General theme documentation

### Usage

To use the theme in your components:

```vue
<template>
  <!-- Use Catppuccin utility classes -->
  <div class="bg-base text-body">
    <h1 class="text-heading">Heading</h1>
    <p class="text-subheading-0">Subheading</p>
    
    <!-- Use custom component classes -->
    <div class="catppuccin-card p-4">
      This card uses Catppuccin styling
    </div>
    
    <!-- Form elements with accent colors -->
    <input type="checkbox" class="accent-blue">
    <input type="text" class="catppuccin-input">
  </div>
</template>
```

The theme automatically switches between light and dark modes using the `.dark` class, which can be toggled with the theme toggle component.

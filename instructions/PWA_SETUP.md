# PWA Setup Guide

## Overview

FoundIt is now configured as a Progressive Web App (PWA), allowing users to install it on their mobile devices and use it like a native app.

## What's Been Set Up

✓ **Manifest File** (`/public/manifest.json`)

- App name, description, and branding
- Display mode: standalone (fullscreen app experience)
- Theme color: #3686C7 (FoundIt blue)
- Icon configuration for 192px and 512px sizes

✓ **Service Worker** (`/public/sw.js`)

- Basic caching strategy (network-first, fallback to cache)
- Offline functionality
- Auto-updates when new version is deployed

✓ **PWA Meta Tags** (`/app/layout.js`)

- Apple-specific meta tags for iOS home screen
- Viewport configuration for mobile optimization
- Theme color for browser UI
- Manifest link

✓ **Service Worker Registration** (`/app/register-sw.js`)

- Automatic registration on page load
- Client-side component for Next.js App Router

## Icons Required

You need to add the following icon files to the `/public` folder:

### Required Icons:

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)
3. **favicon.ico** (optional, for browser tab)

### Icon Guidelines:

- Use the FoundIt logo or a simple, recognizable icon
- Background should be your brand color (#3686C7) or white
- Keep the design simple and clear (looks good at small sizes)
- Icons should be square (1:1 aspect ratio)
- PNG format with transparency or solid background

### Quick Icon Generation:

You can use these free tools to generate PWA icons:

- **Favicon.io**: https://favicon.io/favicon-generator/
- **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
- **RealFaviconGenerator**: https://realfavicongenerator.net/

Simply upload your logo and download all required sizes.

## How to Test PWA

### On iOS (iPhone/iPad):

1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top-right
5. App icon appears on home screen

### On Android:

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen" or "Install app"
4. Follow the prompt to install
5. App icon appears in app drawer

### Features When Installed:

- Fullscreen experience (no browser UI)
- Appears in app switcher like native apps
- Splash screen on launch
- Works offline (cached pages)
- Fast loading with service worker

## Deployment Notes

When you deploy to production:

1. **Update URLs**: Make sure `start_url` in manifest.json points to your production domain
2. **HTTPS Required**: PWAs only work over HTTPS (or localhost for development)
3. **Test Installation**: Always test the "Add to Home Screen" flow after deployment
4. **Update Service Worker**: Increment `CACHE_NAME` in sw.js when you make changes

## Customization

### Update App Colors

Edit `/public/manifest.json`:

```json
{
  "background_color": "#ffffff", // Splash screen background
  "theme_color": "#3686C7" // Browser UI color
}
```

### Update Caching Strategy

Edit `/public/sw.js` to customize what gets cached and how.

### Update App Name

Edit `/public/manifest.json`:

```json
{
  "name": "Your Full App Name",
  "short_name": "Short Name"
}
```

## Troubleshooting

**PWA not installing:**

- Make sure you're using HTTPS (not HTTP)
- Check browser console for errors
- Verify all icon files exist in `/public`
- Clear browser cache and try again

**Service Worker not updating:**

- Increment `CACHE_NAME` in sw.js
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check "Update on reload" in browser DevTools > Application > Service Workers

**Icons not showing:**

- Verify icon files exist in `/public` folder
- Check file names match manifest.json exactly
- Icons must be PNG format
- Try clearing cache and reinstalling

## Status

✅ PWA Configuration Complete
⏳ Icons Needed (add to `/public` folder)

Once icons are added, the PWA setup will be 100% complete!

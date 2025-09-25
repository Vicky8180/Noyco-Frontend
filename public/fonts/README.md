# Font Files Required

⚠️ **IMPORTANT**: You need to place the Mier A font files in this directory to fix the 404 font loading errors.

## Required Files

Please add these 8 font files to this directory:

```
📁 public/fonts/
├── MierA-Regular.woff2
├── MierA-Regular.woff
├── MierA-Medium.woff2
├── MierA-Medium.woff
├── MierA-SemiBold.woff2
├── MierA-SemiBold.woff
├── MierA-Bold.woff2
└── MierA-Bold.woff
```

## Where to Get the Fonts

1. **Purchase from a font foundry** (recommended)
   - Check MyFonts, Adobe Fonts, or FontShop
   - Search for "Mier A" font family

2. **Use alternatives** if Mier A is not available:
   - Inter (free from Google Fonts)
   - SF Pro Display (Apple system font)
   - Helvetica Neue

## Quick Fix

If you want to use a free alternative temporarily:

1. Download Inter font from Google Fonts
2. Replace "Mier A" with "Inter" in `src/styles/fonts.css`
3. Update the font-family declarations

## Current Status

✅ Font loading errors FIXED - Using system font fallbacks
✅ Font CSS configuration complete with fallbacks
✅ Typography classes ready to use

**Current Solution**: The @font-face declarations have been commented out to prevent 404 errors. The application now uses high-quality system fonts (Inter, SF Pro Display, Segoe UI, etc.) as fallbacks.

**To use Mier A fonts**: Add the font files to this directory and uncomment the @font-face declarations in `src/styles/fonts.css`.

For detailed instructions, see the main `FONT_SETUP.md` file in the project root.

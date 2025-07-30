# FoxDash

A modern and sleek Firefox new tab startpage extension built with Vite and Svelte.

## Features

- Clean, modern interface
- Bookmark management
- Search functionality
- Date and time display
- Local storage for settings

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm
- Firefox browser

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd foxdash
```

2. Install dependencies:
```bash
npm install
```

### Development Workflow

**For daily development:**
```bash
# Build and test in Firefox
npm run build && cp manifest.json dist/ && npm run web-ext:run
```

This command:
- Builds your Svelte app with Vite
- Copies the manifest to the dist directory
- Opens Firefox with your extension loaded temporarily
- Auto-reloads the extension when you rebuild

**Available Scripts:**

- `npm run dev` - Start Vite dev server (for web preview)
- `npm run build` - Build the extension with Vite
- `npm run web-ext:run` - Run extension in Firefox (requires build first)
- `npm run web-ext:lint` - Lint the extension for issues
- `npm run web-ext:build` - Package extension for distribution

### Project Structure

```
foxdash/
├── src/
│   ├── App.svelte          # Main app component
│   ├── main.js             # Entry point
│   ├── stores.js           # Svelte stores
│   └── components/         # Svelte components
├── dist/                   # Built extension files
├── manifest.json           # Extension manifest
├── index.html              # HTML template
└── vite.config.js          # Vite configuration
```

## Publishing

### Build for Production

When ready to publish your extension:

```bash
# Build and package for distribution
npm run build && cp manifest.json dist/ && npm run web-ext:build
```

This creates a distributable ZIP file at `web-ext-artifacts/foxdash-1.0.zip`

### Publishing to Firefox Add-ons

1. **Prepare your extension:**
   - Test thoroughly with `npm run web-ext:run`
   - Run `npm run web-ext:lint` to check for issues
   - Update version in `manifest.json`

2. **Build the package:**
   ```bash
   npm run build && cp manifest.json dist/ && npm run web-ext:build
   ```

3. **Submit to Mozilla:**
   - Go to https://addons.mozilla.org/developers/
   - Upload `web-ext-artifacts/foxdash-1.0.zip`
   - Fill out listing details
   - Submit for review

### Quick Commands

**Development:**
```bash
npm run build && cp manifest.json dist/ && npm run web-ext:run
```

**Production:**
```bash
npm run build && cp manifest.json dist/ && npm run web-ext:build
```

## Technical Details

- **Framework:** Svelte 4
- **Build Tool:** Vite 5
- **Extension API:** Web Extensions API
- **Manifest Version:** 3
- **Target Browser:** Firefox

## License

[Add your license here]
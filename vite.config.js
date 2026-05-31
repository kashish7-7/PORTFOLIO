import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// Custom plugin to automatically prepend '/PORTFOLIO' to asset paths in JS/JSX/HTML
function assetPathPlugin() {
  const base = '/PORTFOLIO';
  // Matches any quote (', ", or `) followed by /textures/, /images/, /sounds/, or /fonts/
  const assetRegex = /(['"`])\/(textures|images|sounds|fonts)\//g;

  return {
    name: 'vite-plugin-asset-path-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('/src/') && /\.(js|jsx|ts|tsx)$/.test(id)) {
        return {
          code: code.replace(assetRegex, `$1${base}/$2/`),
          map: null
        };
      }
      return null;
    },
    transformIndexHtml(html) {
      // Matches href="/textures/ or src="/textures/ or favicon paths
      const htmlAssetRegex = /(href|src)=(['"])\/(textures|images|sounds|fonts|favico\.png)/g;
      return html.replace(htmlAssetRegex, `$1=$2${base}/$3`);
    }
  };
}

export default defineConfig({
  base: '/PORTFOLIO/',
  plugins: [
    react(),
    assetPathPlugin(),
    viteCompression()
  ]
})
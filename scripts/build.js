#!/usr/bin/env node

/**
 * Simple build script for ShapeMorpher
 * Minifies and bundles files for production
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building ShapeMorpher...');

// Simple minification function for CSS
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove last semicolon
    .replace(/{\s*/g, '{') // Remove space after {
    .replace(/}\s*/g, '}') // Remove space after }
    .replace(/,\s*/g, ',') // Remove space after ,
    .replace(/:\s*/g, ':') // Remove space after :
    .trim();
}

// Simple minification function for JavaScript
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/\/\/.*$/gm, '') // Remove // comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Clean up semicolons
    .trim();
}

// Build CSS
try {
  console.log('📦 Processing CSS files...');
  const styleCSS = fs.readFileSync('styles/style.css', 'utf8');
  const mainCSS = fs.readFileSync('styles/main.css', 'utf8');
  const combinedCSS = styleCSS + '\n' + mainCSS;
  const minifiedCSS = minifyCSS(combinedCSS);

  // Create build directory
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  fs.writeFileSync('dist/styles.min.css', minifiedCSS);
  console.log('✅ CSS minified and saved to dist/styles.min.css');
} catch (error) {
  console.error('❌ Error processing CSS:', error.message);
}

// Copy HTML and update references
try {
  console.log('📦 Processing HTML...');
  let html = fs.readFileSync('index.html', 'utf8');

  // Update CSS references to use minified version
  html = html.replace(
    /<link[^>]*href="styles\/(style|main)\.css"[^>]*>/gi,
    ''
  );
  html = html.replace(
    '</head>',
    '    <link rel="stylesheet" href="styles.min.css">\n</head>'
  );

  fs.writeFileSync('dist/index.html', html);
  console.log('✅ HTML processed and saved to dist/index.html');
} catch (error) {
  console.error('❌ Error processing HTML:', error.message);
}

// Copy JavaScript files
try {
  console.log('📦 Processing JavaScript files...');

  // Create scripts directory structure in dist
  const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else if (entry.name.endsWith('.js')) {
        const content = fs.readFileSync(srcPath, 'utf8');
        const minified = minifyJS(content);
        fs.writeFileSync(destPath, minified);
      }
    }
  };

  copyDir('scripts', 'dist/scripts');
  console.log('✅ JavaScript files minified and copied to dist/scripts/');
} catch (error) {
  console.error('❌ Error processing JavaScript:', error.message);
}

// Copy assets
try {
  console.log('📦 Copying assets...');

  const copyAssets = ['README.md', 'LICENSE'];

  copyAssets.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, `dist/${file}`);
    }
  });

  console.log('✅ Assets copied');
} catch (error) {
  console.error('❌ Error copying assets:', error.message);
}

console.log('🎉 Build complete! Files are in the dist/ directory');
console.log('💡 Tip: Use "python -m http.server 3000" in the dist/ directory to test the build');

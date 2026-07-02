import * as fs from 'fs';
import * as path from 'path';

function inline() {
  const distDir = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Build index.html not found! Run npm run build first.');
    return;
  }

  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // Find css files
  const assetsDir = path.join(distDir, 'assets');
  const files = fs.readdirSync(assetsDir);
  
  const cssFile = files.find(f => f.endsWith('.css'));
  const jsFile = files.find(f => f.endsWith('.js'));

  if (cssFile) {
    const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
    // Replace the link stylesheet tag
    const linkTagRegex = /<link[^>]*href="\/assets\/index-[^"]+\.css"[^>]*>/;
    htmlContent = htmlContent.replace(linkTagRegex, `<style>${cssContent}</style>`);
  }

  if (jsFile) {
    let jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
    // Replace the script tag
    const scriptTagRegex = /<script[^>]*src="\/assets\/index-[^"]+\.js"[^>]*><\/script>/;
    htmlContent = htmlContent.replace(scriptTagRegex, `<script type="module">${jsContent}</script>`);
  }

  const outputPath = path.join(distDir, 'single-landing.html');
  fs.writeFileSync(outputPath, htmlContent, 'utf8');
  console.log(`Successfully generated self-contained landing HTML at ${outputPath}`);
}

inline();

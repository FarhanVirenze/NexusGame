const fs = require('fs');
const html = fs.readFileSync('./stitch-screens/1_admin_dashboard.html', 'utf-8');
const match = html.match(/tailwind\.config\s*=\s*(\{.*?\})\s*\}catch/s);
if (match) {
  let configStr = match[1];
  // Convert JS object string to JSON (it's already mostly JSON)
  const config = eval('(' + configStr + ')');
  const theme = config.theme.extend;
  
  let css = `@import "tailwindcss";\n\n@theme {\n`;
  for (const [key, value] of Object.entries(theme.colors)) {
    css += `  --color-${key}: ${value};\n`;
  }
  for (const [key, value] of Object.entries(theme.fontFamily)) {
    css += `  --font-${key}: ${value[0].replace(/ /g, '-')};\n`;
  }
  for (const [key, value] of Object.entries(theme.spacing)) {
    css += `  --spacing-${key}: ${value};\n`;
  }
  css += `}\n`;
  
  fs.writeFileSync('./src/app/globals.css', css);
  console.log('globals.css updated');
}

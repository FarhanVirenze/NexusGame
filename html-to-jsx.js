const fs = require('fs');
const path = require('path');

function htmlToJsx(html) {
  let jsx = html;
  
  // Extract body content
  const bodyMatch = jsx.match(/<body[^>]*>(.*?)<\/body>/s);
  if (bodyMatch) {
    jsx = bodyMatch[1];
  }
  
  // Remove script tags
  jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove SVG scripts if any
  
  // Remove HTML comments
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

  // Convert class to className
  jsx = jsx.replace(/class=/g, 'className=');
  
  // Remove inline styles completely
  jsx = jsx.replace(/style="[^"]*"/g, '');
  
  // Self close tags
  const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  for (const tag of voidElements) {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  }
  
  // Convert for to htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Convert tabindex to tabIndex
  jsx = jsx.replace(/tabindex=/g, 'tabIndex=');
  
  // Handle some common HTML entities
  jsx = jsx.replace(/&mdash;/g, '—');
  jsx = jsx.replace(/&copy;/g, '©');
  
  return jsx;
}

const map = {
  '1_admin_dashboard.html': 'admin/page.jsx',
  '6_admin_user.html': 'admin/users/page.jsx',
  '9_admin_transactions.html': 'admin/transactions/page.jsx',
  '10_admin_content.html': 'admin/content/page.jsx',
  '11_admin_settings.html': 'admin/settings/page.jsx',
  '13_admin_game_management.html': 'admin/games/page.jsx',
  '8_home_carousel.html': 'page.jsx',
  '5_game_detail.html': 'game/[id]/page.jsx',
  '2_riwayat_pesanan.html': 'history/page.jsx',
  '4_detail_riwayat.html': 'history/[id]/page.jsx',
  '3_promotions.html': 'promotions/page.jsx',
  '12_berita_update.html': 'news/page.jsx',
  '7_my_account.html': 'settings/page.jsx'
};

const screensDir = path.join(__dirname, 'stitch-screens');
const appDir = path.join(__dirname, 'src', 'app');

for (const [file, route] of Object.entries(map)) {
  const filePath = path.join(screensDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Missing ${file}`);
    continue;
  }
  
  let html = fs.readFileSync(filePath, 'utf-8');
  let jsxContent = htmlToJsx(html);
  
  const destPath = path.join(appDir, route);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  
  const routeParts = route.split('/');
  let prefix = 'Page';
  if (routeParts.length > 1) {
    prefix = routeParts[routeParts.length - 2].replace(/\[|\]/g, '');
  }
  const componentName = prefix.charAt(0).toUpperCase() + prefix.slice(1) + 'Component';
  
  const finalJsx = `
import React from 'react';

export default function ${componentName.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
  
  fs.writeFileSync(destPath, finalJsx);
  console.log(`Created ${route}`);
}

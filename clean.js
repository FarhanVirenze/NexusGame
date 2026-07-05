const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/app/admin/games/page.jsx',
  'src/app/admin/users/page.jsx',
  'src/app/admin/content/page.jsx',
  'src/app/admin/settings/page.jsx'
];

filesToClean.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove <header>...</header>
  content = content.replace(/<header[\s\S]*?<\/header>/g, '');
  // Remove <nav>...</nav> (if it's the top level nav, usually at the start)
  content = content.replace(/<nav className="bg-white\/70[\s\S]*?<\/nav>/g, '');
  // Remove <aside>...</aside>
  content = content.replace(/<aside[\s\S]*?<\/aside>/g, '');
  // Remove <footer>...</footer>
  content = content.replace(/<footer[\s\S]*?<\/footer>/g, '');
  
  // Replace <main> wrapper to standard one
  // <main className="flex-1 flex flex-col min-w-0"> or similar
  content = content.replace(/<main className="flex-grow pt-28[\s\S]*?">/, '<main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">\n<div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">');
  content = content.replace(/<main className="flex-1 flex flex-col min-w-0">/, '<main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">\n<div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">');
  content = content.replace(/<main className="flex-1 flex flex-col pt-24[\s\S]*?">/, '<main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">\n<div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">');
  content = content.replace(/<main className="flex-1 flex flex-col bg-surface-container-lowest[\s\S]*?">/, '<main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">\n<div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">');
  
  // Also we need to close the extra div if we opened one, but the existing pages usually just close </main>.
  // I will replace `</main>` with `</div>\n</main>`.
  content = content.replace(/<\/main>/g, '</div>\n</main>');

  // Prices formatting
  content = content.replace(/\$9\.99/g, 'Rp 99.000');
  content = content.replace(/\$19\.99/g, 'Rp 199.000');
  content = content.replace(/\$49\.99/g, 'Rp 499.000');
  content = content.replace(/\$99\.99/g, 'Rp 999.000');
  content = content.replace(/\$100\.00/g, 'Rp 1.000.000');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Cleaned ${file}`);
});

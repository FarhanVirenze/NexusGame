const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/app/admin/transactions/page.jsx'
];

filesToClean.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;

  // Restore file first from git
  require('child_process').execSync(`git checkout HEAD -- "${file}"`, { cwd: __dirname });

  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove <header>...</header>
  content = content.replace(/<header[\s\S]*?<\/header>/g, '');
  // Remove <nav>...</nav> (top nav)
  content = content.replace(/<nav className="bg-white\/70[\s\S]*?<\/nav>/g, '');
  // Remove <aside>...</aside>
  content = content.replace(/<aside[\s\S]*?<\/aside>/g, '');
  // Remove <footer>...</footer>
  content = content.replace(/<footer[\s\S]*?<\/footer>/g, '');
  
  // Replace <main> wrapper to standard one
  content = content.replace(/<main[^>]*>/, '<main className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-background relative overflow-y-auto">\n<div className="p-6 md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-8 pb-24 mt-4">');

  // Since we replaced <main> with <main> + <div>, we expect 1 more open div. 
  // Let's count them to ensure balance.
  let opens = (content.match(/<div/g) || []).length;
  let closes = (content.match(/<\/div>/g) || []).length;
  let diff = opens - closes;

  if (diff > 0) {
    // Add missing closes BEFORE </main>
    const closesToAdd = '</div>\n'.repeat(diff);
    content = content.replace(/<\/main>/, closesToAdd + '</main>');
  } else if (diff < 0) {
    // Remove extra closes from the end (before </main>)
    for (let i = 0; i < Math.abs(diff); i++) {
        content = content.replace(/<\/div>\s*(?=<\/main>)/, '');
    }
  }

  // Prices formatting
  content = content.replace(/\$9\.99/g, 'Rp 99.000');
  content = content.replace(/\$19\.99/g, 'Rp 199.000');
  content = content.replace(/\$49\.99/g, 'Rp 499.000');
  content = content.replace(/\$99\.99/g, 'Rp 999.000');
  content = content.replace(/\$100\.00/g, 'Rp 1.000.000');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Cleaned ${file} - Balanced divs: ${diff > 0 ? '+' + diff : diff}`);
});

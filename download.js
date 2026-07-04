const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  { name: '1_admin_dashboard.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWMzN2M4ZTI3OTUwMzM4NWE4MGE3MGEyYTc3EgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '2_riwayat_pesanan.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWMzN2MyNjJkMjMwMzRhNGU0NWUxMTE3YmNjEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '3_promotions.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWMzN2NiYWJhNWMwN2M0ZDIxMWNmMzA3MmEzEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '4_detail_riwayat.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JlMzBhZmEyZDZjMTQ1MTE5NDYyZTg2ZWQ4MDEzZTZjEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '5_game_detail.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWMzN2M4MjdlMGYwNWMyZmUxMjdjMGU2ZjM2EgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '6_admin_user.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Y5Y2U1MjljNGRlNDQxMmNhYTdhZDZhYWMxM2ZjNDAwEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '7_my_account.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzllZDc5MDQ0ZDhmOTQwNTk5ZDNlYjY4NmUxMGQ0YTlmEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '8_home_carousel.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWMzODZjMWRjZjkwNWMyZmUxMjdjMGU2ZjM2EgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '9_admin_transactions.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzEwMDM2YzQ0ZDM1NjQzYjJiYTIzNTdkNjc0ZTJjYmIxEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '10_admin_content.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzgwNzVhOTBkZDNiMTQ5MmY5ZjU5ZTNiYjc2MDY3ODQzEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '11_admin_settings.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VmMmUyNzZiMDViYTQwOWU5ZDA4YWFkYjUwNjFhNmE5EgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '12_berita_update.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NWMzN2M3MGY5ZDEwMmE5ODE0ZmY1MTU2M2VmEgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' },
  { name: '13_admin_game_management.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzZhMjdmNzQyZTY3YjQ1YjU5ZWJmYTU4Njk3N2FhMTI5EgsSBxCgisn9-gIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTY1MjEwNzI5NTA5MTQ3MjI1NQ&filename=&opi=89354086' }
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const screen of screens) {
    console.log(`Downloading ${screen.name}...`);
    try {
      await download(screen.url, path.join(__dirname, 'stitch-screens', screen.name));
      console.log(`Downloaded ${screen.name}`);
    } catch (e) {
      console.error(`Error downloading ${screen.name}:`, e);
    }
  }
}

main();

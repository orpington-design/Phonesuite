const fs = require('fs'); 
const lines = fs.readFileSync('src/app/[tenantSlug]/dashboard/page.js', 'utf8').split('\n'); 
lines.forEach((l, i) => { if(l.includes('pos')) console.log(i + 1 + ': ' + l.trim()); });

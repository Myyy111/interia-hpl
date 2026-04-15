import fs from 'fs';
const content = fs.readFileSync('vercel-out.log', 'utf16le');
console.log(content);

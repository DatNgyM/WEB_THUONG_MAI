const fs = require('fs');
const path = require('path');

// Create a simple SVG placeholder image
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f5f5f5"/>
  <text x="50%" y="50%" font-family="Arial" font-size="18" text-anchor="middle" fill="#999">No Image</text>
  <path d="M80,60 L120,60 L120,90 L140,90 L100,130 L60,90 L80,90 Z" fill="#ddd"/>
</svg>
`;

// Define the path to save the image
const imgDirectory = path.join(__dirname, 'Page', 'admin', 'img');
const filePath = path.join(imgDirectory, 'no-image.svg');

// Check if directory exists, if not create it
if (!fs.existsSync(imgDirectory)) {
    fs.mkdirSync(imgDirectory, { recursive: true });
}

// Write the SVG content to a file
fs.writeFileSync(filePath, Buffer.from(svgContent));

console.log(`Placeholder image created at: ${filePath}`);

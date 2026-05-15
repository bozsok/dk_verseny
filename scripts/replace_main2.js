const fs = require('fs');

let content = fs.readFileSync('src/main.js', 'utf8');

// Replace all remaining String(currentGrade) === '4'
content = content.replace(/String\(currentGrade\) === '4'/g, "['4', '5', '6'].includes(String(currentGrade))");

fs.writeFileSync('src/main.js', content, 'utf8');
console.log('src/main.js replaced successfully (Part 2)');

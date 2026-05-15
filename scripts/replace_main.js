const fs = require('fs');

let content = fs.readFileSync('src/main.js', 'utf8');

// Replace isGrade4 declarations and boolean checks
content = content.replace(/const isGrade4 = \(String\(currentGrade\) === '4'\);/g, "const isSeniorGrade = ['4', '5', '6'].includes(String(currentGrade));");
content = content.replace(/let isGrade4 = String\(currentGrade\) === '4';/g, "let isSeniorGrade = ['4', '5', '6'].includes(String(currentGrade));");
content = content.replace(/isGrade4 = String\(currentGrade\) === '4';/g, "isSeniorGrade = ['4', '5', '6'].includes(String(currentGrade));");
content = content.replace(/const isGrade4 = currentGrade === 4;/g, "const isSeniorGrade = [4, 5, 6].includes(currentGrade);");

// Replace gradeClass logic
content = content.replace(
  "const gradeClass = currentGrade ? `dkv-grade-${currentGrade}` : '';",
  "const isSeniorGrade = ['4', '5', '6'].includes(String(currentGrade));\n    const gradeClass = isSeniorGrade ? 'dkv-grade-4' : (currentGrade ? `dkv-grade-${currentGrade}` : '');"
);

// Replace variable usages
content = content.replace(/isGrade4/g, "isSeniorGrade");

fs.writeFileSync('src/main.js', content, 'utf8');
console.log('src/main.js replaced successfully');

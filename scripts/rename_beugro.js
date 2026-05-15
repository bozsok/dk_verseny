const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/gameData/leaderboard.json');

console.log('Renaming Beugro label in leaderboard.json...');
let data;
try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}

let changedCount = 0;

data.forEach(entry => {
    if (!entry.taskResults) return;

    let entryModified = false;
    entry.taskResults.forEach(task => {
        if (task.slideId === 'finale_beugro' || task.label === 'Finálé Beugró (Alappontszám)') {
            task.label = 'Finálé: Frissítőszkript összeillesztése';
            entryModified = true;
        }
    });

    if (entryModified) changedCount++;
});

if (changedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully renamed labels for ${changedCount} entries.`);
} else {
    console.log('No labels needed renaming.');
}

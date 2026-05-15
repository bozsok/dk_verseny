const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/gameData/leaderboard.json');

console.log('Reordering leaderboard.json...');
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

    const beugroIndex = entry.taskResults.findIndex(t => t.slideId === 'finale_beugro' || (t.label && t.label.includes('Beugró')));
    const finaleIndex = entry.taskResults.findIndex(t => t.slideId === 'final_2' || (t.label && t.label.includes('Zár')));

    if (beugroIndex !== -1 && finaleIndex !== -1 && beugroIndex > finaleIndex) {
        // Húzzuk ki a beugrót
        const [beugro] = entry.taskResults.splice(beugroIndex, 1);
        // Tegyük be a finálé elé (mivel kivettük, a finaleIndex lehet hogy változott volna, de mivel beugroIndex > finaleIndex, a finaleIndex nem változott!)
        entry.taskResults.splice(finaleIndex, 0, beugro);
        changedCount++;
    }
});

if (changedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully reordered ${changedCount} entries.`);
} else {
    console.log('No entries needed reordering.');
}

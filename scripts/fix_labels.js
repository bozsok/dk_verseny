const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/gameData/leaderboard.json');

console.log('Fixing labels in leaderboard.json...');
let data;
try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}

const g3Names = {
    'st1_s3': '1. állomás: Labirintuskert',
    'st2_s3': '2. állomás: Adat-tenger',
    'st3_s3': '3. állomás: Tudás Torony',
    'st4_s3': '4. állomás: Pixel Palota',
    'st5_s3': '5. állomás: Hangerdő',
    'final_2': 'Finálé: Nagy Zár - Végjáték'
};

const g4Names = {
    'st1_s3': '1. állomás: Üzenetek kriptája',
    'st2_s3': '2. állomás: Memória tükörterme',
    'st3_s3': '3. állomás: Logikai könyvtár',
    'st4_s3': '4. állomás: Anomáliák szigete',
    'st5_s3': '5. állomás: Bit-folyam zsilip',
    'final_2': 'Finálé: Rendszermag újraindítása'
};

let changedCount = 0;

data.forEach(entry => {
    if (!entry.taskResults) return;

    const isGrade3 = entry.grade == 3 || (entry.playerClass && entry.playerClass.toString().startsWith('3.'));
    const isGrade4 = entry.grade == 4 || (entry.playerClass && entry.playerClass.toString().startsWith('4.'));

    let entryModified = false;
    entry.taskResults.forEach(task => {
        const names = isGrade3 ? g3Names : (isGrade4 ? g4Names : null);
        if (names && names[task.slideId]) {
            if (task.label !== names[task.slideId]) {
                task.label = names[task.slideId];
                entryModified = true;
            }
        }
    });

    if (entryModified) changedCount++;
});

if (changedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully fixed labels for ${changedCount} entries.`);
} else {
    console.log('No labels needed fixing.');
}

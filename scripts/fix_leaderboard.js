const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/gameData/leaderboard.json');

console.log('Reading leaderboard.json...');
let data;
try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContent);
} catch (e) {
    console.error('Failed to read leaderboard.json:', e.message);
    process.exit(1);
}

let modifiedCount = 0;

data.forEach(entry => {
    if (!entry.taskResults) entry.taskResults = [];

    const isGrade3 = entry.grade == 3 || (entry.playerClass && entry.playerClass.toString().startsWith('3.'));
    const isGrade4 = entry.grade == 4 || (entry.playerClass && entry.playerClass.toString().startsWith('4.'));

    const recordedSum = entry.taskResults.reduce((sum, t) => sum + (t.points || 0), 0);
    const hasOnboarding = entry.taskResults.some(t => t.slideId === 'onboarding_summary' || (t.label && t.label.toLowerCase().includes('onboarding')));
    let diff = (entry.score || 0) - recordedSum;

    let missingBeugroPoints = 0;
    const hasFinaleBeugro = entry.taskResults.some(t => t.label && t.label.toLowerCase().includes('beugró'));
    
    // Check if Grade 4 player has Beugro missing
    if (isGrade4 && !hasFinaleBeugro && diff >= 6) {
        missingBeugroPoints = 6;
        diff -= 6;
    }

    // Determine Onboarding points based on the rest of the diff
    let onboardingPoints = 0;
    if (!hasOnboarding && diff > 0) {
        onboardingPoints = diff;
    }

    let modified = false;

    // Add Onboarding result if missing
    if (onboardingPoints > 0) {
        entry.taskResults.unshift({
            slideId: 'onboarding_summary',
            label: 'Onboarding (Regisztráció és Karakter)',
            success: onboardingPoints === 4,
            points: onboardingPoints,
            maxPoints: 4,
            timeElapsed: null
        });
        modified = true;
    }

    // Add Finale Beugro if missing
    if (missingBeugroPoints === 6) {
        entry.taskResults.push({
            slideId: 'finale_beugro',
            label: 'Finálé Beugró (Alappontszám)',
            success: true,
            points: 6,
            maxPoints: 6,
            timeElapsed: null
        });
        modified = true;
    }

    if (modified) {
        modifiedCount++;
    }
});

if (modifiedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully fixed ${modifiedCount} entries in leaderboard.json.`);
} else {
    console.log('No entries needed fixing.');
}

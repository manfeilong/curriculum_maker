const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'clean_courses.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const courses = JSON.parse(rawData);

const structure = {};

courses.forEach(c => {
    if (!c.college || !c.department) return;
    if (!structure[c.college]) {
        structure[c.college] = new Set();
    }
    structure[c.college].add(c.department);
});

const result = Object.keys(structure).map(college => ({
    name: college,
    departments: Array.from(structure[college]).sort()
})).sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(path.join(__dirname, 'data', 'structure.json'), JSON.stringify(result, null, 2));
console.log('Structure extracted to data/structure.json');

const fs = require('fs');
const content = fs.readFileSync('Alimplas API.yaml', 'utf8');

function extractSchema(name) {
    const regex = new RegExp(`\\s{4}${name}:\\s*\\n\\s*type: object\\s*\\n\\s*properties:([\\s\\S]*?)(?=\\n\\s{4}[A-Za-z]+:|$)`, 'm');
    const match = content.match(regex);
    if (match) {
        console.log(`--- ${name} ---`);
        console.log(match[1].slice(0, 1500) + '...');
    } else {
        console.log(`Schema ${name} not found.`);
    }
}

extractSchema('Shift');

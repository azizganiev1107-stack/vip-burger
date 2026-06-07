const fs = require('fs');
const content = fs.readFileSync('Alimplas API.yaml', 'utf8');

const regex = /\s{4}Order:\s*\n\s*type: object\s*\n\s*properties:([\s\S]*?)(?=\n\s{4}[A-Za-z]+:|$)/m;
const match = content.match(regex);
if (match) {
    console.log(match[1].slice(0, 2000) + '...');
} else {
    console.log("Not found");
}

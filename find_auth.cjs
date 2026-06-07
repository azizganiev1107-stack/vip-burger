const fs = require('fs');
const yaml = require('js-yaml');

const content = fs.readFileSync('Alimplas API.yaml', 'utf8');
const doc = yaml.load(content);

const targetTag = "5. Auth & Accounts (Tizimga kirish va Profillar)";
let found = false;

for (const [path, methods] of Object.entries(doc.paths)) {
    for (const [method, details] of Object.entries(methods)) {
        if (details.tags && details.tags.includes(targetTag)) {
            console.log(`${method.toUpperCase()} ${path}`);
            found = true;
        }
    }
}

if (!found) {
    console.log("No endpoints found with this exact tag. Trying partial match...");
    for (const [path, methods] of Object.entries(doc.paths)) {
        for (const [method, details] of Object.entries(methods)) {
            if (details.tags && details.tags.some(t => t.includes('Auth') || t.includes('Account') || t.includes('Profil'))) {
                console.log(`${method.toUpperCase()} ${path} -> ${details.tags.join(', ')}`);
            }
        }
    }
}

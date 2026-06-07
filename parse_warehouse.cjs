const fs = require('fs');
const content = fs.readFileSync('Alimplas API.yaml', 'utf8');

const schemasToFind = [
  'WarehouseCategory', 'Category',
  'WarehouseInventory', 'Inventory',
  'WarehouseItem', 'Item',
  'WarehouseMovement', 'Movement',
  'Supplier',
  'Unit',
  'Warehouse'
];

let out = "";
schemasToFind.forEach(name => {
  const regex = new RegExp(`^\\s{4}${name}:\\s*\\n\\s*type: object\\s*\\n\\s*properties:([\\s\\S]*?)(?=\\n\\s{4}[A-Za-z]+:|$)`, 'm');
  const match = content.match(regex);
  if (match) {
    out += `\n--- ${name} ---\n`;
    out += match[1].slice(0, 1500) + '\n';
  }
});

fs.writeFileSync('warehouse_schemas.txt', out);
console.log("Done");

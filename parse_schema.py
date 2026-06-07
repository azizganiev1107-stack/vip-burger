import yaml
import json

with open('Alimplas API.yaml', 'r', encoding='utf-8') as f:
    data = yaml.safe_load(f)

schemas = data.get('components', {}).get('schemas', {})

def dump_schema(name):
    schema = schemas.get(name)
    if schema:
        print(f"--- {name} ---")
        print(json.dumps(schema.get('properties', {}), indent=2))

dump_schema('Order')
dump_schema('Product')

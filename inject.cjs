const fs = require('fs');

const files = [
  'e:/karsoft/vip-burger/src/routes/warehouse.tsx', 
  'e:/karsoft/vip-burger/src/routes/finance.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('import { toast }')) {
    content = content.replace(/import \{ useTranslation \} from 'react-i18next'/, "import { useTranslation } from 'react-i18next'\nimport { toast } from 'react-hot-toast'");
  }
  
  // replace create
  content = content.replace(/create([A-Za-z]+)\.mutate\(\s*([^,]+),\s*\{\s*onSuccess:\s*closeModal,\s*onError:\s*\(\w+: any\)\s*=>\s*setErrorMsg\(([^)]+)\)\s*\}\s*\)/g, 
    "create$1.mutate($2, { onSuccess: () => { toast.success(t('common.created')); closeModal(); }, onError: (err: any) => { const msg = $3; setErrorMsg(msg); toast.error(msg); } })");

  // replace patch
  content = content.replace(/patch([A-Za-z]+)\.mutate\(\s*([^,]+),\s*\{\s*onSuccess:\s*closeModal,\s*onError:\s*\(\w+: any\)\s*=>\s*setErrorMsg\(([^)]+)\)\s*\}\s*\)/g, 
    "patch$1.mutate($2, { onSuccess: () => { toast.success(t('common.updated')); closeModal(); }, onError: (err: any) => { const msg = $3; setErrorMsg(msg); toast.error(msg); } })");

  // replace delete
  content = content.replace(/delete([A-Za-z]+)\.mutate\(id\)/g, "delete$1.mutate(id, { onSuccess: () => toast.success(t('common.deleted')), onError: () => toast.error(t('common.error')) })");

  fs.writeFileSync(file, content);
});
console.log('Done');

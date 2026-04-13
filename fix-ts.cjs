const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Fix unused React imports
  content = content.replace(/import React, \{ /g, 'import { ');
  content = content.replace(/import React from 'react';\r?\n/g, '');
  
  // Fix inline type imports by forcing type prefix
  content = content.replace(/import \{ ([^}]+) \} from '(\.\.\/)*(\.\.\/)*types';/g, "import type { $1 } from '$2$3types';");
  
  fs.writeFileSync(f, content);
});
console.log('Fixed TS errors');

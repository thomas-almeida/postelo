// Teste simples para verificar se os arquivos estão configurados corretamente
console.log("Verificando configuração do projeto...");

// Importar módulos necessários
try {
  const fs = require('fs');
  const path = require('path');

  // Verificar se os arquivos principais existem
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tsconfig.json',
    'app/page.tsx',
    'app/camera/page.tsx',
    'app/preview/page.tsx',
    'app/gallery/page.tsx',
    'components/StampOverlay.tsx',
    'lib/stampGeometry.ts'
  ];

  console.log("Verificando arquivos necessários:");
  let allFound = true;

  requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✓' : '✗'} ${file}`);
    if (!exists) allFound = false;
  });

  if (allFound) {
    console.log("\n✓ Todos os arquivos necessários estão presentes!");
    console.log("O projeto está configurado corretamente.");
  } else {
    console.log("\n✗ Alguns arquivos estão faltando. Verifique a estrutura do projeto.");
  }
} catch (error) {
  console.error("Erro ao verificar configuração:", error.message);
}
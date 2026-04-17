#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

const templateDir = path.join(__dirname, '../templates');
const targetDir = process.cwd();

const filesToCopy = [
  { src: 'bot.js', dest: 'index.js' },
  { src: '.env.example', dest: '.env' },
];

console.log(`${cyan}[highrise.bot]${reset} Initializing project...`);

filesToCopy.forEach(({ src, dest }) => {
  const sourcePath = path.join(templateDir, src);
  const destPath = path.join(targetDir, dest);

  if (!fs.existsSync(destPath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`${green}  + created${reset} ${dest}`);
    } catch (err) {
      console.error(`${red}  - error${reset} copying ${dest}: ${err.message}`);
    }
  } else {
    console.log(`${yellow}  ! skipping${reset} ${dest} (already exists)`);
  }
});

const pkgPath = path.join(targetDir, 'package.json');
let hasDotenv = false;

if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    pkg.scripts = pkg.scripts || {};
    if (!pkg.scripts.start) {
      pkg.scripts.start = "node index.js";
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(`${green}  + updated${reset} package.json scripts`);
    }

    hasDotenv = !!(pkg.dependencies?.dotenv || pkg.devDependencies?.dotenv);
  } catch (err) {
    console.error(`${red}  ! error${reset} reading package.json`);
  }
} else {
  console.log(`${yellow}  ! warning${reset} No package.json found. Run 'npm init' first.`);
}

console.log(`\n${green}--- Setup Complete ---${reset}`);
if (!hasDotenv) {
  console.log(`${cyan}1.${reset} Run: ${yellow}npm install dotenv${reset}`);
} else {
  console.log(`${cyan}1.${reset} Dependency 'dotenv' already found.`);
}
console.log(`${cyan}2.${reset} Add your credentials to the ${yellow}.env${reset} file`);
console.log(`${cyan}3.${reset} Start your bot with: ${yellow}npm start${reset}\n`);
const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
            if (file.includes('node_modules') || file.includes('.git')) return next();
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.html') || file.endsWith('.css')) {
            results.push(file);
          }
          next();
        }
      });
    })();
  });
}

walk(__dirname, (err, files) => {
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // 1. Swap fonts from VT323 to Cinzel & Lato
        content = content.replace(/family=VT323/g, "family=Cinzel:wght@700&family=Lato:wght@400;700");
        content = content.replace(/font-family:\s*'VT323',\s*monospace;/g, "font-family: 'Lato', sans-serif;");

        // 2. Add Cinzel to headers and buttons
        const addFont = (selector, font) => {
            const regex = new RegExp(`(${selector}\\s*\\{)([^}]*?)`, 'g');
            content = content.replace(regex, (match, p1, p2) => {
                if(p2.includes('font-family')) {
                    return p1 + p2.replace(/font-family:[^;]+;/, `font-family: '${font}', serif;`);
                }
                return p1 + `\n            font-family: '${font}', serif;` + p2;
            });
        }
        
        addFont('h1', 'Cinzel');
        addFont('h2', 'Cinzel');
        addFont('h3', 'Cinzel');
        addFont('\\.menu-button', 'Cinzel');
        addFont('\\.createButton', 'Cinzel');
        addFont('\\.startGame', 'Cinzel');
        addFont('\\.linkHeader', 'Cinzel');

        // 3. Fix nav contrast (Header Menu)
        content = content.replace(/nav\s*\{([^}]+)\}/g, (match, p1) => {
            let res = p1.replace(/background:\s*var\(--board-dark\);/g, "background: #1a1a1a;");
            res = res.replace(/border-bottom:\s*4px solid var\(--board-dark\);/g, "border-bottom: 4px solid #000000;");
            return `nav {${res}}`;
        });

        content = content.replace(/nav a\s*\{([^}]+)\}/g, (match, p1) => {
            let res = p1.replace(/color:\s*var\(--board-light\);/g, "color: #ffffff;");
            res = res.replace(/font-size:\s*22px;/g, "font-size: 26px;"); 
            res = res.replace(/font-size:\s*24px;/g, "font-size: 26px;"); 
            return `nav a {${res}}`;
        });
        
        content = content.replace(/\.hamburger-menu span\s*\{([^}]+)\}/g, (match, p1) => {
            let res = p1.replace(/background-color:\s*var\(--board-light\);/g, "background-color: #ffffff;");
            return `.hamburger-menu span {${res}}`;
        });

        // 4. Tone down retro shadows to elegant soft shadows
        content = content.replace(/text-shadow:\s*4px 4px 0px #000000,\s*-2px -2px 0 #000,\s*2px -2px 0 #000,\s*-2px 2px 0 #000,\s*2px 2px 0 #000;/g, "text-shadow: 2px 2px 6px rgba(0,0,0,0.8);");
        content = content.replace(/text-shadow:\s*3px 3px 0px #000000,\s*-2px -2px 0 #000,\s*2px -2px 0 #000,\s*-2px 2px 0 #000,\s*2px 2px 0 #000;/g, "text-shadow: 2px 2px 5px rgba(0,0,0,0.8);");
        content = content.replace(/text-shadow:\s*2px 2px 0px #000000,\s*-1px -1px 0 #000,\s*1px -1px 0 #000,\s*-1px 1px 0 #000,\s*1px 1px 0 #000;/g, "text-shadow: 1px 1px 4px rgba(0,0,0,0.8);");
        content = content.replace(/text-shadow:\s*2px 2px 0px rgba\(0,0,0,0\.3\);/g, "text-shadow: 1px 1px 4px rgba(0,0,0,0.5);");
        content = content.replace(/text-shadow:\s*2px 2px 0px #000000;/g, "text-shadow: 2px 2px 4px rgba(0,0,0,0.7);");

        // 5. Enhance Button Contrast & Size
        content = content.replace(/background:\s*#4a382e;/g, "background: #2b1e16;");
        
        // 6. Fix tiny mobile media queries for better readability
        content = content.replace(/font-size:\s*11px;/g, "font-size: 18px;");
        content = content.replace(/font-size:\s*10px;/g, "font-size: 16px;");

        if (content !== original) {
            fs.writeFileSync(file, content);
            console.log('Updated elegant design in ' + file);
        }
    });
});

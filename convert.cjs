const fs = require('fs');
let html = fs.readFileSync('/home/manoj-amavasya/.gemini/antigravity-ide/brain/6eddbc2f-5018-4565-a984-018fc097be92/scratch/main.html', 'utf-8');

html = html.replace(/class=/g, 'className=');
html = html.replace(/<img(.*?)>/g, '<img$1 />');
html = html.replace(/<input(.*?)>/g, '<input$1 />');
html = html.replace(/<br>/g, '<br />');
html = html.replace(/<hr>/g, '<hr />');
html = html.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = styleString.split(';').filter(Boolean).reduce((acc, rule) => {
        const [key, value] = rule.split(':').map(str => str.trim());
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc[camelKey] = value;
        return acc;
    }, {});
    return `style={${JSON.stringify(styleObj)}}`;
});

const jsx = `import React from 'react'

export default function AdminDashboard() {
  return (
    ${html}
  )
}
`;

fs.writeFileSync('/home/manoj-amavasya/PROJECTS/GITHUB/zeroabstraction/src/app/(admin)/admin/page.tsx', jsx);

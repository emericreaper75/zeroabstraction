const fs = require('fs');
let html = fs.readFileSync('.gemini/antigravity-ide/brain/6eddbc2f-5018-4565-a984-018fc097be92/scratch/main.html', 'utf-8');

html = html.replace(/class=/g, 'className=');
html = html.replace(/<img(.*?)>/g, '<img$1 />');
html = html.replace(/<input(.*?)>/g, '<input$1 />');
html = html.replace(/<br>/g, '<br />');
html = html.replace(/<hr>/g, '<hr />');

// Remove the surrounding <main> tag from the HTML if we want to wrap it or keep it as is.
// Actually, it's fine to return it as is.

const jsx = `import React from 'react'

export default function AdminDashboard() {
  return (
    ${html}
  )
}
`;

fs.writeFileSync('src/app/(admin)/admin/page.tsx', jsx);

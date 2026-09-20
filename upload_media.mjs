import fs from 'fs';
import { Blob } from 'buffer';

const run = async () => {
  console.log('1. Logging in...');
  let res = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'Test1234!' })
  });
  
  if (res.status !== 200) {
    console.error('Login failed!', await res.text());
    return;
  }
  const cookie = res.headers.get('set-cookie').split(';')[0];
  console.log('Login successful, acquired cookie.');
  
  // Create form data
  const formData = new FormData();
  const buffer = fs.readFileSync('sample.jpg');
  formData.append('file', new Blob([buffer], { type: 'image/jpeg' }), 'sample.jpg');
  formData.append('_payload_', JSON.stringify({ alt_text: 'Test Image' }));
  
  // Upload
  console.log('\n2. Uploading media to /api/media (this will invoke sharp)...');
  const start = Date.now();
  res = await fetch('http://localhost:3000/api/media', {
    method: 'POST',
    headers: {
      cookie,
      'Authorization': `JWT ${cookie.split('=')[1]}`
    },
    body: formData
  });
  console.log(`Upload Status: ${res.status} (Took ${Date.now() - start}ms)`);
  const text = await res.text();
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 2));
  } catch (e) {
    console.log(text);
  }
};

run().catch(console.error);

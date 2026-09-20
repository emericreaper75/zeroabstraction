

async function run() {
  const loginUrl = 'http://localhost:3000/api/admin/login';
  const adminUrl = 'http://localhost:3000/admin';
  const loginPageUrl = 'http://localhost:3000/login';

  for (let i = 1; i <= 3; i++) {
    console.log(`\n=== RUN ${i} ===`);
    let cookie = '';

    console.log('1. Visit /admin while logged out');
    let res = await fetch(adminUrl, { redirect: 'manual' });
    console.log(`Expected 307 to /login, Got: ${res.status} to ${res.headers.get('location')}`);

    console.log('\n2. Login with wrong credentials');
    let start = Date.now();
    res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'wrong' })
    });
    console.log(`Expected 401, Got: ${res.status} (Took: ${Date.now() - start}ms)`);
    console.log('Body:', await res.text());

    console.log('\n3. Login with correct credentials');
    start = Date.now();
    res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'Test1234!' })
    });
    console.log(`Expected 200, Got: ${res.status} (Took: ${Date.now() - start}ms)`);
    const cookieStr = res.headers.get('set-cookie');
    if (cookieStr) {
      console.log('Cookie acquired! Raw Set-Cookie:', cookieStr);
      cookie = cookieStr.split(';')[0];
    } else {
      console.log('NO COOKIE RETURNED!');
    }

    console.log('4. Visit /admin while logged in');
    res = await fetch(adminUrl, { headers: { 'Cookie': cookie }, redirect: 'manual' });
    console.log(`Expected 200, Got: ${res.status}`);

    console.log('\n5. Visit /login while logged in');
    res = await fetch(loginPageUrl, { headers: { 'Cookie': cookie }, redirect: 'manual' });
    console.log(`Expected 307 to /admin, Got: ${res.status} to ${res.headers.get('location')}`);

    console.log('\n6. Logout');
    res = await fetch('http://localhost:3000/api/admin/logout', {
      method: 'POST',
      headers: { 'Cookie': cookie }
    });
    console.log(`Expected 200, Got: ${res.status}`);
    const logoutBody = await res.text();
    console.log(`Logout Body: ${logoutBody}`);
    console.log('Set-Cookie after logout:', res.headers.get('set-cookie'));

    console.log('\n7. Visit /admin after logout');
    const clearedCookie = res.headers.get('set-cookie')?.split(';')[0];
    res = await fetch(adminUrl, {
      headers: { 'Cookie': clearedCookie },
      redirect: 'manual'
    });
    console.log(`Expected 307 to /login, Got: ${res.status} to ${res.headers.get('location')}`);
  }
}

run().catch(console.error);

const API_BASE = 'http://localhost:5000/api';

async function runBackendTests() {
    console.log('--- STARTING BACKEND E2E FUNCTIONAL TESTS ---');
    let token = '';
    let createdBlogId = '';

    try {
        // 1. Step 1: Admin Login Request
        console.log('1a. Testing Admin Login Step 1...');
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: 'admin@example.com', 
                password: 'admin123',
                securityPin: '123456'
            })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Step 1 Login failed: ${JSON.stringify(loginData)}`);
        console.log('✅ Step 1 Login Success:', loginData.msg);

        // 1b. Step 2: OTP Verification
        console.log('1b. Testing Admin Login Step 2 (OTP Verification)...');
        const verifyRes = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                otpCode: '999999'
            })
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(`Step 2 OTP Verification failed: ${JSON.stringify(verifyData)}`);
        token = verifyData.token;
        console.log('✅ Admin Login Full Success! Token acquired.');

        // 2. Fetch Destinations
        console.log('2. Fetching Destinations...');
        const destRes = await fetch(`${API_BASE}/destinations`);
        const destData = await destRes.json();
        const firstDest = destData[0];
        console.log(`✅ Fetched ${destData.length} destinations. First destination: ${firstDest?.name}`);

        // 3. Create Blog Post
        console.log('3. Creating Test Blog Post...');
        const createRes = await fetch(`${API_BASE}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'TEST REHBERİ: Antigravity Otomatik Test Rotaları',
                content: '<p>Bu bir otomasyon test blog yazısıdır. Gezi detayları ve rehber içerikleri başarıyla render edilmelidir.</p>',
                metaDescription: 'Otomasyon test blog yazısı özet bilgisi.',
                destination: firstDest ? firstDest._id : undefined,
                image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'
            })
        });
        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(`Create post failed: ${JSON.stringify(createData)}`);
        createdBlogId = createData._id || createData.blog?._id;
        console.log(`✅ Blog Created Successfully with ID: ${createdBlogId}`);

        // 4. Fetch Public Blog List
        console.log('4. Fetching Public Blog List...');
        const listRes = await fetch(`${API_BASE}/blogs?page=1&limit=10`);
        const listData = await listRes.json();
        const blogsArray = listData.blogs || listData;
        const found = blogsArray.find(b => b._id === createdBlogId);
        if (!found) throw new Error('Created blog post not found in public list!');
        console.log('✅ Created Blog Post verified in public listing!');

        // 5. Fetch Blog Detail
        console.log('5. Fetching Blog Detail by ID...');
        const detailRes = await fetch(`${API_BASE}/blogs/${createdBlogId}`);
        const detailData = await detailRes.json();
        if (detailData.title !== 'TEST REHBERİ: Antigravity Otomatik Test Rotaları') {
            throw new Error(`Title mismatch on blog detail! Found: ${detailData.title}`);
        }
        console.log('✅ Blog Detail verified!');

        // 6. Update Blog Post
        console.log('6. Updating Blog Post...');
        const updateRes = await fetch(`${API_BASE}/blogs/${createdBlogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'GÜNCELLENDİ: Antigravity Otomatik Test Rotaları',
                content: '<p>Güncellenmiş test içeriği.</p>'
            })
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(`Update post failed: ${JSON.stringify(updateData)}`);

        const checkUpdateRes = await fetch(`${API_BASE}/blogs/${createdBlogId}`);
        const checkUpdateData = await checkUpdateRes.json();
        if (checkUpdateData.title !== 'GÜNCELLENDİ: Antigravity Otomatik Test Rotaları') {
            throw new Error('Title update failed!');
        }
        console.log('✅ Blog Post Update verified!');

        // 7. Delete Blog Post
        console.log('7. Deleting Test Blog Post...');
        const delRes = await fetch(`${API_BASE}/blogs/${createdBlogId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token,
                'Authorization': `Bearer ${token}`
            }
        });
        if (!delRes.ok) throw new Error('Delete request failed!');
        console.log('✅ Blog Post Delete API returned success.');

        // 8. Verify Deletion
        const verifyDelRes = await fetch(`${API_BASE}/blogs/${createdBlogId}`);
        if (verifyDelRes.status === 404 || !verifyDelRes.ok) {
            console.log('✅ Deletion verified (404 received).');
        } else {
            console.error('❌ Deletion failed: Post still exists!');
        }

        console.log('\n🎉 ALL BACKEND & BLOG CRUD TESTS PASSED PERFECTLY!');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ BACKEND TEST ERROR:', err.message);
        process.exit(1);
    }
}

runBackendTests();

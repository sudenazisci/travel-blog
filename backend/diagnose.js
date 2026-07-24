const axios = require('axios');

async function test() {
    try {
        console.log('Sending request to http://localhost:5000/api/settings');
        const res = await axios.get('http://localhost:5000/api/settings');
        console.log('Success:', res.status);
        console.log('Data:', res.data);
    } catch (err) {
        if (err.response) {
            console.log('Error Status:', err.response.status);
            console.log('Error Headers:', err.response.headers);
            console.log('Error Data:', err.response.data);
        } else {
            console.error('Connection Error:', err.message);
        }
    }
}

test();

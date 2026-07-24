const express = require('express');
const app = express();

app.use((req, res, next) => {
    try {
        if (req.query) {
            // Test mutating properties
            req.query.foo = 'mutated';
            // Output to console
            console.log('Query after mutation:', req.query);
        }
    } catch(e) {
        console.error('Mutation error:', e);
    }
    res.send('Done');
});

app.listen(5005, () => console.log('Test server ready'));

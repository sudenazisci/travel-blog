const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

async function updateThailand() {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    
    const result = await Blog.findByIdAndUpdate(
        '69bc4f6e55ab9646ce277b6c',
        { 
            image: 'https://images.unsplash.com/photo-1528181304800-2f5402924440?auto=format&fit=crop&w=1200&q=80',
            imagePosition: '50%'
        },
        { new: true }
    );
    
    console.log('Updated:', result?.title, '| Image:', result?.image);
    await mongoose.disconnect();
}

updateThailand().catch(console.error);

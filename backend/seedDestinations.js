const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const destinations = [
    {
        name: 'Bali, Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1038&q=80',
        description: 'Tropical paradise known for its beaches, temples, and rice terraces.',
        lat: -8.4095,
        lng: 115.1889
    },
    {
        name: 'Kyoto, Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        description: 'Famous for its classical Buddhist temples, gardens, imperial palaces, and wooden houses.',
        lat: 35.0116,
        lng: 135.7681
    },
    {
        name: 'Santorini, Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        description: 'One of the Cyclades islands in the Aegean Sea, devastated by a volcanic eruption in the 16th century BC.',
        lat: 36.3932,
        lng: 25.4615
    },
    {
        name: 'Reykjavik, Iceland',
        image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2159&q=80',
        description: 'The capital and largest city of Iceland, located on the coast.',
        lat: 64.1466,
        lng: -21.9426
    },
    {
        name: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
        description: 'The global center for art, fashion, gastronomy and culture.',
        lat: 48.8566,
        lng: 2.3522
    },
    {
        name: 'New York, USA',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e29f122?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        description: 'An iconic city known for its skyscrapers, Broadway shows, and bustling atmosphere.',
        lat: 40.7128,
        lng: -74.0060
    }
];

const importData = async () => {
    try {
        await Destination.deleteMany();
        await Destination.insertMany(destinations);
        console.log('Destinations Imported with Coordinates!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');

dotenv.config();

const regions = [
    { name: 'TÜRKİYE', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=60' },
    { name: 'ASYA', image: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?w=800&auto=format&fit=crop&q=60' },
    { name: 'AVRUPA', image: 'https://images.unsplash.com/photo-1467269204594-9661b133dd2b?w=800&auto=format&fit=crop&q=60' },
    { name: 'GÜNEY AMERİKA', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=60' },
    { name: 'KUZEY AMERİKA', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=60' },
    { name: 'AFRİKA', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=60' }
];

const seedRegions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        for (const region of regions) {
            const existing = await Destination.findOne({ name: region.name });
            if (!existing) {
                await Destination.create({
                    name: region.name,
                    image: region.image,
                    description: `${region.name} bölgesi için seyahat rehberi.`,
                    parent: null,
                    isRegion: true
                });
                console.log(`Created region: ${region.name}`);
            } else {
                await Destination.updateOne({ _id: existing._id }, { isRegion: true });
                console.log(`Updated region: ${region.name}`);
            }
        }

        console.log('Seeding complete');
        process.exit();
    } catch (error) {
        console.error('Error seeding regions:', error);
        process.exit(1);
    }
};

seedRegions();

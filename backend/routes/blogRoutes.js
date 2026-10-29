const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');
const { externalizeDataUriImages, externalizeIfDataUri } = require('../utils/htmlImages');
const cache = require('../services/cacheService');

async function prepareBlogMedia(body) {
    const out = { ...body };
    if (out.content !== undefined) {
        out.content = await externalizeDataUriImages(out.content);
    }
    if (out.image !== undefined) {
        out.image = await externalizeIfDataUri(out.image);
    }
    return out;
}

// @route   GET api/blogs
// @desc    Get all blogs
// @access  Public
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
    try {
        let query = {};
        // Taslaklar yalnızca geçerli admin token'ı ile görülebilir
        const wantsDrafts = req.query.includeDrafts === 'true' && auth.isAdminRequest(req);
        if (!wantsDrafts) {
            query.isDraft = { $ne: true };
        }
        if (req.query.destination) {
            const Destination = require('../models/Destination');
            const childDests = await Destination.find({ parent: req.query.destination }, '_id');
            const childIds = childDests.map(d => d._id);
            query.destination = { $in: [req.query.destination, ...childIds] };
        }
        if (req.query.search) {
            const safeSearch = escapeRegex(String(req.query.search).slice(0, 100));
            query.$or = [
                { title: { $regex: safeSearch, $options: 'i' } },
                { content: { $regex: safeSearch, $options: 'i' } }
            ];
        }

        const selectFields = req.query.fields ? req.query.fields.split(',').join(' ') : null;

        // Pagination Logic
        const page = parseInt(req.query.page);
        const limit = Math.min(parseInt(req.query.limit) || 0, 200);

        const wantsExcerpt = req.query.excerpt === '1';
        const toExcerpt = (blogs) => wantsExcerpt
            ? blogs.map(b => ({ ...b, content: typeof b.content === 'string' ? b.content.replace(/<[^>]*>?/gm, '').substring(0, 300) : b.content }))
            : blogs;

        if (page && limit) {
            const startIndex = (page - 1) * limit;

            const total = await Blog.countDocuments(query);
            let mongoQuery = Blog.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(startIndex);

            if (selectFields) mongoQuery = mongoQuery.select(selectFields);
            if (wantsExcerpt) mongoQuery = mongoQuery.lean();
            const blogs = toExcerpt(await mongoQuery.populate('destination'));

            res.json({
                blogs,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                totalBlogs: total
            });
        } else {
            // Backward compatibility: return all blogs if no pagination params
            let mongoQuery = Blog.find(query).sort({ createdAt: -1 });
            if (selectFields) mongoQuery = mongoQuery.select(selectFields);
            if (wantsExcerpt) mongoQuery = mongoQuery.lean();
            const blogs = toExcerpt(await mongoQuery.populate('destination'));
            res.json(blogs);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/blogs/:id/view
// @desc    Increment blog view count
// @access  Public
router.post('/:id/view', async (req, res) => {
    try {
        // Admin kendi yazısını açınca sayılmaz
        if (auth.isAdminRequest(req)) {
            return res.json({ ignored: true });
        }
        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.id, isDraft: { $ne: true } },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        res.json(blog.views);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/blogs/:id
// @desc    Get blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const cacheKey = `blog:${req.params.id}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }
        const blog = await Blog.findById(req.params.id).populate('destination').lean();
        if (!blog || (blog.isDraft && !auth.isAdminRequest(req))) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        // Store in cache for 5 minutes (taslaklar asla paylaşımlı önbelleğe alınmaz)
        if (!blog.isDraft) cache.set(cacheKey, blog, 300);
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/blogs
// @desc    Create a blog
// @access  Private
router.post('/', auth, async (req, res) => {
    let { title, content, image, destination, slug, metaTitle, metaDescription, imagePosition, isDraft, category, country, city, travelDate } = req.body;

    try {
        ({ content, image } = await prepareBlogMedia({ content, image }));
        const newBlog = new Blog({
            title,
            content,
            image,
            destination,
            slug,
            metaTitle,
            metaDescription,
            imagePosition: imagePosition || '50%',
            isDraft: isDraft !== undefined ? isDraft : false,
            category,
            country,
            city,
            travelDate
        });

        const blog = await newBlog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        if (err.message && err.message.includes('sınırını')) {
            return res.status(413).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', auth, async (req, res) => {
    let { title, content, image, destination, slug, metaTitle, metaDescription, imagePosition, isDraft, category, country, city, travelDate } = req.body;

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        if (title !== undefined) blog.title = title;
        if (content !== undefined) {
            const media = await prepareBlogMedia({ content });
            blog.content = media.content;
        }
        if (image !== undefined) {
            const media = await prepareBlogMedia({ image });
            blog.image = media.image;
        }
        if (destination !== undefined) blog.destination = destination;
        if (slug !== undefined) blog.slug = slug;
        if (metaTitle !== undefined) blog.metaTitle = metaTitle;
        if (metaDescription !== undefined) blog.metaDescription = metaDescription;
        if (imagePosition !== undefined) blog.imagePosition = imagePosition;
        if (isDraft !== undefined) blog.isDraft = isDraft;
        if (category !== undefined) blog.category = category;
        if (country !== undefined) blog.country = country;
        if (city !== undefined) blog.city = city;
        if (travelDate !== undefined) blog.travelDate = travelDate;

        await blog.save();
        // Invalidate cache for this blog
        cache.del(`blog:${req.params.id}`);
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        if (err.message && err.message.includes('sınırını')) {
            return res.status(413).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/blogs/:id
// @desc    Delete a blog
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // findByIdAndDelete is shorter but findById allows for existence check if needed, 
        // though findByIdAndDelete returns null if not found too.
        const blog = await Blog.findByIdAndDelete(req.params.id);
        // Invalidate cache for this blog
        cache.del(`blog:${req.params.id}`);

        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        res.json({ msg: 'Blog removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;

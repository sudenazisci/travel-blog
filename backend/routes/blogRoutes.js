const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');

// @route   GET api/blogs
// @desc    Get all blogs
// @access  Public
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.destination) {
            query.destination = req.query.destination;
        }
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Pagination Logic
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        if (page && limit) {
            const startIndex = (page - 1) * limit;

            const total = await Blog.countDocuments(query);
            const blogs = await Blog.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(startIndex)
                .populate('destination');

            res.json({
                blogs,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                totalBlogs: total
            });
        } else {
            // Backward compatibility: return all blogs if no pagination params
            const blogs = await Blog.find(query).sort({ createdAt: -1 }).populate('destination');
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
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
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
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
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
    const { title, content, image, destination, slug, metaTitle, metaDescription, imagePosition } = req.body;

    try {
        const newBlog = new Blog({
            title,
            content,
            image,
            destination,
            slug,
            metaTitle,
            metaDescription,
            imagePosition: imagePosition || 'center'
        });

        const blog = await newBlog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/blogs/:id
// @desc    Update a blog
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, content, image, destination, slug, metaTitle, metaDescription, imagePosition } = req.body;

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (image) blog.image = image;
        if (destination) blog.destination = destination;
        if (slug) blog.slug = slug;
        if (metaTitle) blog.metaTitle = metaTitle;
        if (metaDescription) blog.metaDescription = metaDescription;
        if (imagePosition) blog.imagePosition = imagePosition;

        await blog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
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

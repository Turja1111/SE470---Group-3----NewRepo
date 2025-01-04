
import Post from '../models/Post.js';
import multer from 'multer';
import path from 'path';




const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
    } });



export const createPost = async (req, res) => {
    console.log("Received request to create post");
    try {
        // Handle file upload
        const uploadResult = await new Promise((resolve, reject) => {
            upload.single('image')(req, res, (err) => {
                if (err) reject(err);
                resolve(req.file);
            });
        });

        // Validate required fields
        if (!req.body.content || !req.body.category) {
            return res.status(400).json({
                message: 'Content and category are required'
            });
        }

        // Create and save post
        const newPost = new Post({
            content: req.body.content,
            category: req.body.category,
            author: req.user.id,
            imageUrl: uploadResult ? `/uploads/${uploadResult.filename}` : null
        });

        await newPost.save();
        console.log('Post created:', newPost);
        return res.status(201).json(newPost);

    } catch (error) {
        console.error('Post creation error:', error);
        return res.status(error.status || 500).json({
            message: error.message || 'Error creating post'
        });
    }
};

export const upvotePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const upvoteIndex = post.upvotes.indexOf(req.user.id);
        if (upvoteIndex === -1) {
            post.upvotes.push(req.user.id);
        } else {
            post.upvotes.splice(upvoteIndex, 1);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating upvote' });
    }
};

export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user.id,
            content: req.body.content
        };
        post.comments.push(comment);
        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('comments.user', 'username avatar _id');

        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
};

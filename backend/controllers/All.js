
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


export const updatePost = async (req, res) => {
    try {
        const uploadResult = await new Promise((resolve, reject) => {
            upload.single('image')(req, res, (err) => {
                if (err) reject(err);
                resolve(req.file);
            });
        });

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        post.content = req.body.content;
        
        // Handle image updates
        console.log(req.body.removeImage);
        if (uploadResult) {
            post.imageUrl = `/uploads/${uploadResult.filename}`;
        } else if (req.body.removeImage === 'true') {
            post.imageUrl = null;
        }
        console.log('Post updated:', post);

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post' });
    }
};


export const getPosts = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category && category !== 'all' ? { category } : {};

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'username avatar');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
};

export const getComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('comments.user', 'username avatar _id');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

export const deleteComment = async (req, res) => {
    console.log("Received request to delete a comment");
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user.id) {
            console.log("Post not authorized to delete this comment");
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        console.log("Comment found and authorized to delete");
        post.comments.pull({ _id: req.params.commentId });
        await post.save();
        console.log("Comment deleted successfully");

        const populatedPost = await Post.findById(post._id)
            .populate('comments.user', 'username avatar');

        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
};


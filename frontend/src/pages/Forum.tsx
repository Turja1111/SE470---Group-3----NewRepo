import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Link as LinkIcon,
    Pencil,
    Trash2,
    ThumbsUp,
    MessageCircle
} from 'lucide-react';


interface Post {
    _id: string;
    content: string;
    imageUrl?: string;
    category: string;
    author: {
        _id: string;
        username: string;
        avatar: string;
    };
    createdAt: string;
    upvotes: string[];
    comments: Array<{
        _id: string;
        user: {
            _id: string;
            username: string;
            avatar: string;
        };
        content: string;
        createdAt: string;
    }>;
}


const Forum = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [postCategory, setPostCategory] = useState<string>('General');
    const categories = ['Welcome Center', 'Mindful Moments', 'Wellness Hub', 'Support Circle', 'General'];

    const [editingPost, setEditingPost] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);



    useEffect(() => {
        fetchPosts();
    }, []);
    const handleUpvote = async (postId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/posts/${postId}/upvote`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    };

    const handleComment = async (postId: string, content: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/posts/${postId}/comments`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/posts');
            console.log('Fetched posts:', response.data);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handlePost = async () => {
        if (!postText.trim()) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('content', postText);
            formData.append('category', postCategory);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await axios.post('http://localhost:5000/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setPostText('');
            setSelectedImage(null);
            setImagePreview(null);
            setPostCategory('General');
            await fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    const handleEditPost = async (postId: string, content: string) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('content', content);
            formData.append('category', postCategory);

            // Handle image updates
            if (editSelectedImage) {
                formData.append('image', editSelectedImage);
            }
            // Explicitly handle image removal
            if (!editImagePreview) {
                formData.append('removeImage', 'true');
            }

            await axios.put(`http://localhost:5000/posts/${postId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEditingPost(null);
            setEditContent('');
            setEditImagePreview(null);
            setEditSelectedImage(null);
            if (editFileInputRef.current) {
                editFileInputRef.current.value = '';
            }

            await fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };



    const handleDeletePost = async (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };
    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('Fetching user...');
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(response.data.user);
                console.log(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);


    return (
        <div className="min-h-screen bg-[#C5C5C5]/10 p-6 flex gap-8">
            <div className="flex-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-[#C5C5C5]">
                    <div className="flex gap-4 items-start">
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            className="w-full p-4 rounded-lg border border-[#C5C5C5] focus:border-[#4D6A6D]"
                            placeholder="Share your thoughts..."
                        />
                        <button
                            onClick={handlePost}
                            disabled={isLoading}
                            className="bg-[#4D6A6D] text-white px-6 py-2 rounded-lg"
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {posts
                        .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
                        .map((post) => (
                            <div key={post._id} className="bg-white p-4 rounded-lg shadow-md border border-[#C5C5C5]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#4D6A6D] rounded-full" />
                                        <div>
                                            <h4 className="font-medium text-[#4C5B61]">{post.author.username}</h4>
                                            <p className="text-sm text-[#949896]">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {String(post.author._id) === String(currentUser?._id) && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingPost(post._id);
                                                    setEditContent(post.content);
                                                    setEditImagePreview(post.imageUrl ? `http://localhost:5000${post.imageUrl}` : null);
                                                }}
                                                className="text-teal-600 hover:text-teal-800"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePost(post._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingPost === post._id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full p-2 border rounded-lg"
                                            rows={3}
                                        />
                                        {/* Current image preview */}
                                        {(post.imageUrl || editImagePreview) && (
                                            <div className="mt-2 relative">
                                                <img
                                                    src={editImagePreview || `http://localhost:5000${post.imageUrl}`}
                                                    alt="Preview"
                                                    className="max-h-48 rounded-lg"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setEditImagePreview(null);
                                                        setEditSelectedImage(null);
                                                        if (editFileInputRef.current) {
                                                            editFileInputRef.current.value = '';
                                                        }
                                                        // Add this line to ensure the post's original image is also cleared from UI
                                                        const updatedPost = posts.find(p => p._id === editingPost);
                                                        if (updatedPost) {
                                                            updatedPost.imageUrl = '';
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        {/* Image upload controls */}
                                        <div className="flex gap-2">
                                            <input
                                                type="file"
                                                ref={editFileInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setEditSelectedImage(file);
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setEditImagePreview(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => editFileInputRef.current?.click()}
                                                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                            >
                                                {post.imageUrl || editImagePreview ? "Replace Image" : "Add Image"}
                                            </button>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => {
                                                    setEditingPost(null);
                                                    setEditImagePreview(null);
                                                    setEditSelectedImage(null);
                                                }}
                                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleEditPost(post._id, editContent)}
                                                className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="mb-3">{post.content}</p>
                                        {post.imageUrl && (
                                            <img
                                                src={`http://localhost:5000${post.imageUrl}`}
                                                alt="Post attachment"
                                                className="rounded-lg w-full"
                                            />
                                        )}
                                    </>
                                )}
                                <div className="flex items-center gap-4 mt-4">
                                    <button
                                        onClick={() => handleUpvote(post._id)}
                                        className={`flex items-center gap-1 ${post.upvotes.includes(currentUser?._id)
                                            ? 'text-teal-600'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <ThumbsUp size={18} />
                                        <span>{post.upvotes.length}</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                                        className="flex items-center gap-1 text-gray-500 hover:text-teal-600"
                                    >
                                        <MessageCircle size={18} />
                                        <span>{post.comments.length}</span>
                                    </button>
                                </div>
                                {activeCommentPost === post._id && (
                                    <div className="mt-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                className="flex-1 p-2 border rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                placeholder="Write a comment..."
                                            />
                                            <button
                                                onClick={() => {
                                                    handleComment(post._id, commentText);
                                                    setCommentText('');
                                                    setActiveCommentPost(null);
                                                }}
                                                className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800"
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-[#C5C5C5]/10 p-3 rounded mt-4">
                                    {post.comments.map((comment, index) => {
                                        console.log('Comment user ID:', comment.user);
                                        console.log('Current user ID:', currentUser?._id);
                                        console.log('Are they equal?:', comment.user === currentUser?._id);
                                        return (
                                            <div key={index} className="bg-gray-50 p-3 rounded">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-[#4D6A6D] rounded-full" />
                                                        <div>
                                                            <span className="font-medium text-[#4C5B61]">{comment.user.username}</span>
                                                            <span className="text-xs text-[#949896] ml-2">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {String(comment.user) === String(currentUser?._id) && (
                                                        <button
                                                            onClick={() => handleDeleteComment(post._id, comment._id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-sm text-[#4C5B61]">{comment.content}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            
        </div>
    );
};

export default Forum;

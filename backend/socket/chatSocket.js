import jwt from 'jsonwebtoken';

const chatSocket = (io) => {
    console.log('Chat socket is running');
    
    io.on('connection', async (socket) => {
        console.log('User connected:', socket.id);
        
        // Get user ID from auth token
        const token = socket.handshake.auth.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id;
                
                // Join a room specific to this user's ID
                socket.join(userId.toString());
                console.log(`User ${userId} joined their personal room`);

                socket.on('join', (chatId) => {
                    if (!chatId) {
                        console.error('Invalid chatId');
                        return;
                    }
                    socket.join(chatId);
                    console.log(`User ${userId} joined chat: ${chatId}`);
                });

                socket.on('leave chat', (chatId) => {
                    socket.leave(chatId);
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected:', socket.id);
                });
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    });
};

export default chatSocket;

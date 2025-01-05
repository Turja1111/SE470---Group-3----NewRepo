import Chat from '../models/Chat.js';

export async function createChat(req, res) {
  try {
      const { participantId } = req.body;
      const userId = req.user.id;

      // Check if chat already exists
      const existingChat = await Chat.findOne({
          participants: { $all: [userId, participantId] }
      }).populate('participants', 'username email isOnline isCompanion');

      if (existingChat) {
          // Emit to both participants even if chat exists
          const io = req.app.get('io');
          [userId, participantId].forEach(id => {
              io.to(id.toString()).emit('newChat', existingChat);
          });
          return res.status(200).json(existingChat);
      }

      // Create new chat
      const newChat = await Chat.create({
          participants: [userId, participantId],
          messages: []
      });

      // Populate the chat with participant details
      const populatedChat = await Chat.findById(newChat._id)
          .populate('participants', 'username email isOnline isCompanion');

      // Get Socket.IO instance
      const io = req.app.get('io');
      
      // Emit to both participants' personal rooms
      [userId, participantId].forEach(id => {
          io.to(id.toString()).emit('newChat', populatedChat);
      });

      res.status(201).json(populatedChat);
  } catch (error) {
      console.error('Create chat error:', error);
      res.status(500).json({ error: error.message });
  }
};

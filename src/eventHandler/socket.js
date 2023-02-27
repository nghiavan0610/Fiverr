const socketIo = require('socket.io');
const { User, Conversation, Message } = require('../db/models');
const { requireAuth } = require('../middlewares/AuthMiddleware');

const initSocket = (server) => {
    const io = socketIo(server);

    // convert a connect middleware to a Socket.IO middleware
    io.use((socket, next) => {
        requireAuth(socket.request, null, () => {
            next();
        });
    });

    // Socket.io event handlers
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        // console.log(socket.request);

        // Join a room for a conversation between a buyer and seller
        socket.on('join-room', async (data) => {
            const { recipient_user_id } = data;
            const conversation = await Conversation.findOrCreate({
                where: {
                    started_by_user_id: id || recipient_user_id,
                    recipient_user_id: recipient_user_id || id,
                },
                include: [
                    { attributes: ['id', 'name', 'avatarUrl', 'slug'], model: User, as: 'StartedByUser' },
                    { attributes: ['id', 'name', 'avatarUrl', 'slug'], model: User, as: 'RecipientUser' },
                ],
                defaults: {},
            });

            console.log(`Conversation ID: ${conversation.id}`);

            // Join the room for the conversation
            socket.join(`conversation-${conversation.id}`);

            // Send the conversation details to the client
            socket.emit('conversation', conversation);

            // Send the conversation messages to the client
            const messages = await Message.findAll({
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'SenderUser',
                },
                where: { conversation_id: conversation.id },
                order: [['createdAt', 'ASC']],
            });
            socket.emit('messages', messages);

            // Handle sending a new message in the conversation
            socket.on('new-message', async (data) => {
                const { sender_id, content } = data;
                console.log(sender_id, content);

                // Create a new message in the conversation
                const message = await Message.create({
                    conversation_id: conversation.id,
                    sender_id,
                    content,
                });

                console.log(`New message in conversation ${conversation.id}: ${content}`);

                // Find the recipient user's socket and send them the new message
                const recipientSocket = Object.values(io.sockets.sockets).find(
                    (s) => s.user_id === conversation.RecipientUser.id,
                );

                if (recipientSocket) {
                    recipientSocket.emit('new-message', message);
                }
            });
        });
    });
};

module.exports = { initSocket };

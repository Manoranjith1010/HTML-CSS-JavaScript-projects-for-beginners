const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Create HTTP server
const server = http.createServer((req, res) => {
    // Serve static files
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }

        // Set content type
        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript'
        };

        res.writeHead(200, {
            'Content-Type': contentTypes[ext] || 'text/plain',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients and their usernames
const clients = new Map();

/**
 * Broadcast message to all connected clients
 */
function broadcast(data, excludeClient = null) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== excludeClient) {
            client.send(JSON.stringify(data));
        }
    });
}

/**
 * Get list of connected usernames
 */
function getConnectedUsers() {
    const users = [];
    clients.forEach((username) => {
        if (username) users.push(username);
    });
    return users;
}

/**
 * Handle new WebSocket connection
 */
wss.on('connection', (ws) => {
    console.log('🔗 New client connected');
    let clientUsername = null;

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'setUsername':
                    handleSetUsername(ws, data, (username) => {
                        clientUsername = username;
                    });
                    break;

                case 'message':
                    handleChatMessage(ws, data, clientUsername);
                    break;

                case 'typing':
                    broadcast({
                        type: 'typing',
                        username: clientUsername
                    }, ws);
                    break;

                case 'stopTyping':
                    broadcast({
                        type: 'stopTyping'
                    }, ws);
                    break;

                default:
                    console.warn('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log(`🔌 Client disconnected: ${clientUsername}`);

        // Remove client from map
        clients.delete(ws);

        // Notify others about user leaving
        if (clientUsername) {
            broadcast({
                type: 'userLeft',
                username: clientUsername,
                users: getConnectedUsers()
            });
        }
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
    });
});

/**
 * Handle username setting
 */
function handleSetUsername(ws, data, callback) {
    const username = data.username.trim();

    if (!username || username.length === 0) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Username cannot be empty'
        }));
        return;
    }

    if (username.length > 20) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Username must be 20 characters or less'
        }));
        return;
    }

    // Store username
    clients.set(ws, username);
    callback(username);

    console.log(`👤 User set username: ${username}`);

    // Notify all clients about user joining
    broadcast({
        type: 'userJoined',
        username: username,
        users: getConnectedUsers()
    });

    // Send updated users list to joining user
    ws.send(JSON.stringify({
        type: 'usersList',
        users: getConnectedUsers()
    }));
}

/**
 * Handle chat messages
 */
function handleChatMessage(ws, data, clientUsername) {
    const message = data.message.trim();

    if (!message) {
        return;
    }

    if (!clientUsername) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Please set a username first'
        }));
        return;
    }

    console.log(`💬 ${clientUsername}: ${message}`);

    // Broadcast message to all clients
    broadcast({
        type: 'message',
        username: clientUsername,
        message: message,
        timestamp: new Date(),
        isOwn: false
    });

    // Send confirmation to sender
    ws.send(JSON.stringify({
        type: 'message',
        username: clientUsername,
        message: message,
        timestamp: new Date(),
        isOwn: true
    }));
}

// Server configuration
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`\n🚀 Chat server running on ws://localhost:${PORT}`);
    console.log(`📡 HTTP server running on http://localhost:${PORT}`);
    console.log(`\n✨ Open http://localhost:${PORT} in your browser to chat!\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    wss.clients.forEach((client) => {
        client.close();
    });
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

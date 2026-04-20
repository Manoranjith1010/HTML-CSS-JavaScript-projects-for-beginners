# 💬 Real-Time Chat Room Application

A real-time chat application built with HTML, CSS, JavaScript, and WebSockets. Multiple users can connect, chat in real-time, see who's typing, and view online users.

## ✨ Features

### ✅ Core Requirements
- **WebSocket Communication** - Real-time messaging using WebSocket API
- **Chat Interface** - Clean, intuitive message display area
- **Message Input** - Type and send messages instantly
- **Live Updates** - Messages appear in real-time for all connected users
- **Auto-scroll** - Chat automatically scrolls to latest message
- **Input Clearing** - Message input clears after sending

### 🎨 Optional Enhancements Included
- **👤 User Profiles** - Set and display usernames
- **⏰ Timestamps** - Every message shows the exact time
- **✍️ Typing Indicator** - "User is typing..." display
- **💬 Message Styling** - Different colors for sent vs. received messages
- **🔗 Connection Status** - Visual indicator (Connected/Disconnected)
- **⌨️ Enter to Send** - Press Enter to quickly send messages
- **👥 User List** - See who's currently online
- **💾 Username Memory** - Username persists across sessions
- **🔄 Auto-reconnect** - Automatically reconnects if connection drops
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

## 📂 Project Structure

```
chat-room/
├── server.js              # Node.js WebSocket server
├── package.json           # Node.js dependencies
├── README.md              # This file
└── public/
    ├── index.html         # Chat interface
    ├── style.css          # Styling and animations
    └── client.js          # Client WebSocket logic
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- A modern web browser

### Installation

1. **Navigate to the chat-room directory:**
   ```bash
   cd chat-room
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   You should see:
   ```
   🚀 Chat server running on ws://localhost:8080
   📡 HTTP server running on http://localhost:8080
   ✨ Open http://localhost:8080 in your browser to chat!
   ```

4. **Open in Browser:**
   - Open your browser and go to `http://localhost:8080`
   - Open multiple tabs/windows to test with multiple users

### Development Mode

For automatic server restart on file changes (requires nodemon):

```bash
npm run dev
```

## 📖 How to Use

1. **Set Your Username:**
   - Enter your desired username in the input field at the top
   - Click "Set Username" or press Enter
   - Your username will appear as a green badge

2. **Send Messages:**
   - Type a message in the input field
   - Click "Send" button or press Enter
   - Your message appears in blue on the right

3. **Receive Messages:**
   - Messages from other users appear in gray on the left
   - Show username and timestamp
   - Messages appear instantly for all connected users

4. **See Typing Indicator:**
   - When someone is typing, you'll see "User is typing..." with animated dots
   - Typing indicator disappears when they stop typing

5. **View Online Users:**
   - See list of connected users at the bottom
   - User count updates in real-time

## 🔧 Technical Details

### WebSocket Events

**Client-side (client.js):**
```javascript
socket.addEventListener('open', ...)       // Connection established
socket.addEventListener('message', ...)    // Receive messages
socket.addEventListener('close', ...)      // Connection closed
socket.addEventListener('error', ...)      // Error handling
```

**Message Types:**
- `setUsername` - Set user's display name
- `message` - Send/receive chat messages
- `typing` - Notify others you're typing
- `stopTyping` - Notify typing stopped
- `userJoined` - User connected
- `userLeft` - User disconnected
- `usersList` - List of online users

### Server-side (server.js)

The server:
- Listens on port 8080
- Maintains list of connected clients
- Broadcasts messages to all clients
- Manages user join/leave events
- Handles typing indicators
- Serves static HTML/CSS/JS files

## 🎨 Customization

### Change Server Port
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 8080; // Change 8080 to your port
```

### Change Colors
Edit `public/style.css`:
- Primary color: `#667eea` (purple)
- Secondary color: `#764ba2` (darker purple)
- Success color: `#4caf50` (green)

### Custom Emojis
Edit `public/index.html` to change emoji icons in:
- Header: `💬`
- Set Username button: `👤`
- Users online indicator: Status dot

## 🌐 Deployment

### Deploy to Heroku

1. Create a Heroku account and install Heroku CLI
2. From the chat-room directory:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

3. Update the WebSocket URL in `public/client.js`:
   ```javascript
   const SERVER_URL = `wss://${window.location.hostname}`;
   ```

### Deploy to Other Cloud Services

The server works with:
- AWS EC2
- Google Cloud Platform
- DigitalOcean
- Azure
- Any platform supporting Node.js

Remember to use `wss://` (secure WebSocket) for HTTPS connections.

## ⚠️ Important Notes

### Why This Needs a Server

This chat application requires a **backend WebSocket server** because:
- It needs to handle multiple simultaneous connections
- Messages must be broadcast to all connected clients
- The server maintains the source of truth for user data
- Real-time communication requires a persistent connection

### Connection Troubleshooting

If you see "Disconnected":
1. Ensure the server is running (`npm start`)
2. Check that port 8080 is not blocked by firewall
3. Verify both client and server are on the same network
4. The client automatically reconnects after 3 seconds

### Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Internet Explorer: ❌ No WebSocket support

## 📝 Code Highlights

### Fisher-Yates Shuffle (if using for randomization)
Not used in chat app, but here's how it's implemented in other projects.

### Auto-scroll Implementation
```javascript
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
```

### WebSocket Connection
```javascript
const socket = new WebSocket("ws://localhost:8080");
socket.addEventListener("open", () => console.log("Connected"));
socket.addEventListener("message", (event) => console.log(event.data));
```

## 🚀 Enhancements You Can Add

- **Private Messaging** - Send direct messages to specific users
- **Message History** - Store chat logs in a database
- **User Avatars** - Display profile pictures
- **Emojis** - Emoji picker for messages
- **File Sharing** - Upload and share files
- **Voice/Video** - Audio/video chat (use WebRTC)
- **Chat Rooms** - Multiple separate chat channels
- **User Status** - Online/Away/Offline status
- **Message Search** - Find old messages
- **Sound Notifications** - Alert sounds for new messages

## 📄 License

MIT License - Feel free to use for personal and commercial projects.

## 🤝 Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check server console for messages
3. Ensure all files are in correct locations
4. Verify Node.js is installed: `node --version`

---

**Happy Chatting! 💬**

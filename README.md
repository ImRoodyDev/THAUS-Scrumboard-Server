<div align="center">
  <h1>📱 THAUS Scrumboard Server</h1>
  <p>A RESTful API server for managing agile projects with real-time chat functionality</p>
  
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" />
</div>

## 📋 Features

- 👥 User authentication with JWT (access & refresh tokens)
- 👨‍💼 Group management with role-based permissions
- 🏃‍♂️ Scrum project management (Features, Epics, Stories, Sprints)
- 💬 Real-time chat functionality for groups, stories, and sprints
- 🛡️ Secure API endpoints with authentication middleware
- 🔄 Real-time updates with Socket.IO ( Not implemented yet )

## 📌 Requirements

- Node.js (v14.x or later)
- MySQL (v5.7 or later)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/chat-box-server.git
cd chat-box-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following content:

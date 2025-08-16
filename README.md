# 🎬 Movie Watchlist - MERN Stack Application

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to search for movies, create personal watchlists, and track their viewing progress.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based user registration and login system
- **🎥 Movie Search**: Search movies using the OMDb API with comprehensive movie information
- **📚 Personal Watchlist**: Save movies to your personal watchlist
- **👁️ Watch Status**: Mark movies as watched/unwatched
- **📊 Statistics**: Track your watchlist progress with detailed statistics
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **📱 Mobile Friendly**: Fully responsive design for all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **axios** - HTTP client for API calls

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Styling with modern CSS features

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OMDb API key ([Get it here](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-watchlist
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-watchlist
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   OMDB_API_KEY=your-omdb-api-key-here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the application**

   **Development mode (runs both frontend and backend):**
   ```bash
   npm run dev
   ```

   **Or run separately:**
   
   Backend only:
   ```bash
   npm run server
   ```
   
   Frontend only:
   ```bash
   npm run client
   ```

6. **Open your browser**
   
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
movie-watchlist/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── models/                 # MongoDB models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md              # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Movies
- `GET /api/movies/search?query=<search-term>&page=<page>` - Search movies
- `GET /api/movies/:id` - Get movie by ID

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `PUT /api/watchlist/:id` - Update watchlist item (mark as watched)
- `DELETE /api/watchlist/:id` - Remove movie from watchlist
- `GET /api/watchlist/stats` - Get watchlist statistics

## 🎯 Usage

1. **Register/Login**: Create an account or sign in to access the application
2. **Search Movies**: Use the search functionality to find movies via OMDb API
3. **Add to Watchlist**: Click "Add to Watchlist" on any movie you want to save
4. **Manage Watchlist**: View your saved movies, mark them as watched/unwatched
5. **Track Progress**: Monitor your viewing statistics and progress

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all user inputs
- **Protected Routes**: API endpoints are protected with authentication middleware

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on all device sizes
- **Modern Aesthetics**: Clean, professional design with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy
- **Loading States**: Proper loading indicators for better user experience
- **Error Handling**: User-friendly error messages and validation feedback

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy automatically on push to main branch

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure proxy settings for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for providing movie data
- [React Icons](https://react-icons.github.io/react-icons/) for the beautiful icons
- The MERN stack community for inspiration and resources

## 📞 Support

If you have any questions or need help with the application, please open an issue in the GitHub repository.

---

**Happy Movie Watching! 🎬✨**


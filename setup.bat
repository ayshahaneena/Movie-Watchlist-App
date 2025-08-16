@echo off
echo 🎬 Setting up Movie Watchlist Application...
echo.

echo 📦 Installing backend dependencies...
npm install

echo.
echo 📦 Installing frontend dependencies...
cd client
npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Create a .env file with your configuration
echo 2. Get an OMDb API key from http://www.omdbapi.com/apikey.aspx
echo 3. Start MongoDB service
echo 4. Run 'npm run dev' to start the application
echo.
echo 🚀 Happy coding!
pause


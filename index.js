const express = require('express');
const path = require('path');
const{ connectToMongoDB } = require('./connect'); // Import the MongoDB connection function

const urlRoutes = require('./routes/url'); // Import the URL routes
const staticRoute = require('./routes/staticRouter'); // Import the static router
const URL = require('./models/url'); // Import the URL model
const app = express();
const PORT =8001;
connectToMongoDB('mongodb://localhost:27017/short_url')
 // Connect to MongoDB
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
   app.set('view engine', 'ejs'); // Set EJS as the view engine
   app.set('views', path.resolve('./views')); // Set the views directory
   
    
   app.use(express.json()); // Middleware to parse JSON bodies
   app.use(express.urlencoded({ extended: false})); // Middleware to parse URL-encoded bodies
   app.use("/url", urlRoutes);
    app.use('/', staticRoute); // Use the static router for serving static files
   app.get('/test', async(req, res) => {
      const allUrls = await URL.find({}); // Fetch all URLs from the database
 return res.render('home',{
  urls: allUrls, // Pass the URLs to the EJS template
 }); // Test route to check if the server is running
}
); // Test route to check if the server is running

 // Use the URL routes under the /url path
app.get('/:shortId', async(req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({ shortId },{$push:{visitHistory: {timestamp : Date.now(),}, },}); // Assuming you have a URL model
  if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.redirect(entry.redirectUrl); // Redirect to the original URL
}); // Example redirect route, replace with actual logic
// Start the server 

app.listen(PORT, () => 
  console.log(`Server is running on http://localhost:${PORT}`)
);
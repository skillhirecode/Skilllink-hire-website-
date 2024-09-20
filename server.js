require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
//const uploadRouter = require('./routes/upload');
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:',err.message);
});

// Middleware
app.use(express.json());

//app.use('/upload', uploadRouter); // Mount the router

const corsOptions = {
    origin: 'https://api.skilllinkhire.com', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, etc.) if needed
    optionsSuccessStatus: 204
  };
  
  app.use(cors(corsOptions));
  




// Import routes
const authRoutes = require('./Routes/auth');  // Importing auth routes
const cvRoutes = require('./Routes/cv');      // Importing CV routes

// Use routes
app.use('/api/auth', authRoutes);  
app.use('/api/cv', cvRoutes);    

// Error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

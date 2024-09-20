// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const UserCv = require('../Models/CVschema model')
const router = express.Router();
const multer = require('multer');
const path = require('path');


// // Signup route
// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         user = new User({ name, email, password });
//         await user.save();

//         const payload = { userId: user.id };
//         const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

//         res.status(201).json({ msg: 'User registered successfully', token });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server error');
//     }
// });

//Signup
router.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // 1. Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
  
      // 2. Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
  
      // 3. Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // 4. Create and save the new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      // 5. Send success response
      res.status(201).json({ message: 'User signed up successfully' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  });

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {  
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});
//get Users





// Set storage engine

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit size to 1MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('cv'); // 'cv' is the name of the input field



// Check file type
function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/; // Allow CV formats (PDF, DOC, DOCX)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);//

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: CVs must be PDF, DOC, or DOCX!');
  }
}
// Upload route
router.post('/Cvupload',(req, res) => {

  
  
    // Handle file upload
    upload(req, res,async (err) => {
    
    

      if (err) {
        return res.status(400).json({ msg: err });
      }
      
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ msg: 'No file selected!' });
      }
      
     try {
      const {fullname,email,cv} = req.body
      console.log(req.body);
      
      // create a new Document

      const newUsercvupload = new  UserCv({
        fullname:req.body.fullname,
        email:req.body.email,
        cv: `uploads/${req.file.filename}`, // Storing file path
        type: path.extname(req.file.originalname) // Storing file type (extension)
      })
      // Save to Database

      await  newUsercvupload.save()

    res.json({
        msg: 'File uploaded and data saved to database!',
        file: `uploads/${req.file.filename}`,
        data: newUsercvupload
      });
     } catch (error) {
      console.log(error);
      
     }
    });
  });








module.exports = router;





import express from 'express';
import bcrypt from 'bcrypt';
import pkg from 'pg'; // PostgreSQL client
import cors from 'cors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());
app.use('/uploads', express.static('uploads'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'diary_farm', // Your database name
    password: 'Basil123@', // Replace with your actual password
    port: 5432,
});


// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const dir = 'uploads';
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }
      cb(null, dir);
  },
  filename: (req, file, cb) => {
      // Create unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG and GIF allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
      error: err.message || 'Something went wrong!'
  });
};


// Email configuration (replace with your SMTP settings)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-16-digit-app-password' // Use the App Password here, not your regular Gmail password
  }
});

// JWT secret key
const JWT_SECRET = 'your-secret-key';

// Backend Routes
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email FROM customers WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const token = jwt.sign({ id: userResult.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    
    // Store token and expiration in database
    await pool.query(
      'UPDATE customers SET reset_token = $1, token_expiration = NOW() + interval \'1 hour\' WHERE email = $2',
      [token, email]
    );

    // Send email
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token exists and hasn't expired
    const tokenResult = await pool.query(
      'SELECT id FROM customers WHERE id = $1 AND reset_token = $2 AND token_expiration > NOW()',
      [decoded.id, token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE customers SET password = $1, reset_token = NULL, token_expiration = NULL WHERE id = $2',
      [hashedPassword, decoded.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Utility function to initialize and seed a database table
async function seedTable(tableName, users) {
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query(
            `INSERT INTO ${tableName} (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`,
            [user.username, hashedPassword]
        );
    }
}

// Initialize database tables with seed data
async function initializeDatabase() {
    // Seed admin users
    const adminResult = await pool.query('SELECT COUNT(*) FROM admins');
    if (parseInt(adminResult.rows[0].count, 10) === 0) {
        await seedTable('admins', [
            { username: 'admin1', password: 'password1' },
            { username: 'admin2', password: 'password2' },
            { username: 'admin3', password: 'password3' },
        ]);
    }

    // Seed staff users
    const staffResult = await pool.query('SELECT COUNT(*) FROM staff');
    if (parseInt(staffResult.rows[0].count, 10) === 0) {
        await seedTable('staff', [
            { username: 'staff1', password: 'password1' },
            { username: 'staff2', password: 'password2' },
            { username: 'staff3', password: 'password3' },
        ]);
    }
}

initializeDatabase();

// Generic Login Endpoint
async function loginUser(req, res, tableName) {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query(`SELECT * FROM ${tableName} WHERE username = $1`, [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Your username or password is incorrect' });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Your username or password is incorrect' });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(`Error during ${tableName} login:`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => loginUser(req, res, 'admins'));

// Staff Login Endpoint
app.post('/api/staff/login', (req, res) => loginUser(req, res, 'staff'));

// Customer Signup Endpoint
app.post('/api/CustomerSignUp', async (req, res) => {
  try {
    const { full_name, email, phone, username, password } = req.body;

    console.log('Received signup details:', { full_name, email, phone, username, password });

    // Check if the email or username already exists
    const userCheck = await pool.query(
      'SELECT * FROM customers WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new customer into the database
    const result = await pool.query(
      `INSERT INTO customers (full_name, email, phone, username, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [full_name, email, phone,username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Customer Login Endpoint
app.post('/api/customer/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM customers WHERE email = $1', [email.toLowerCase()]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
            },
            message: 'Login successful',
        });
    } catch (err) {
        console.error('Login error details:', err);
        res.status(500).json({ message: 'An error occurred during login', details: err.message });
    }
});

// Test Endpoint
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        console.error('Database test failed:', err);
        res.status(500).json({ success: false, error: err.message });
      
    }
});





// product management component

// Create - Upload product with image
app.post('/images', upload.single('image'), async (req, res, next) => {
  try {
      const { image_title, description } = req.body;
      
      if (!req.file) {
          throw new Error('No image file provided');
      }

      const result = await pool.query(
          'INSERT INTO images (file_name, image_title, description) VALUES ($1, $2, $3) RETURNING *',
          [req.file.filename, image_title, description]
      );

      res.status(201).json({
          message: 'Product created successfully',
          product: result.rows[0]
      });
  } catch (error) {
      // Delete uploaded file if database operation fails
      if (req.file) {
          fs.unlink(req.file.path, (err) => {
              if (err) console.error('Error deleting file:', err);
          });
      }
      next(error);
  }
});

// Read - Get all products
app.get('/images', async (req, res, next) => {
  try {
      const result = await pool.query(
          'SELECT * FROM images ORDER BY created_at DESC'
      );
      res.json(result.rows);
  } catch (error) {
      next(error);
  }
});

// Add this route to your Express backend
app.get('/api/product-count', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as count FROM images');
        res.json({ count: result.rows[0].count });
    } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read - Get single product
app.get('/images/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const result = await pool.query(
          'SELECT * FROM images WHERE id = $1',
          [id]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({
              error: 'Product not found'
          });
      }

      res.json(result.rows[0]);
  } catch (error) {
      next(error);
  }
});

// Update - Update product details
app.put('/images/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const { image_title, description } = req.body;

      const result = await pool.query(
          'UPDATE images SET image_title = $1, description = $2, created_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
          [image_title, description, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({
              error: 'Product not found'
          });
      }

      res.json({
          message: 'Product updated successfully',
          product: result.rows[0]
      });
  } catch (error) {
      next(error);
  }
});

// Delete - Delete product and its image
app.delete('/images/:id', async (req, res, next) => {
  const client = await pool.connect();
  
  try {
      await client.query('BEGIN');
      
      const { id } = req.params;
      
      const fileResult = await client.query(
          'SELECT file_name FROM images WHERE id = $1',
          [id]
      );

      if (fileResult.rows.length === 0) {
          return res.status(404).json({
              error: 'Product not found'
          });
      }

      await client.query(
          'DELETE FROM images WHERE id = $1',
          [id]
      );

      // Updated file path creation
      const filePath = path.join(__dirname, 'uploads', fileResult.rows[0].file_name);
      fs.unlink(filePath, (err) => {
          if (err && err.code !== 'ENOENT') {
              console.error('Error deleting file:', err);
          }
      });

      await client.query('COMMIT');

      res.json({
          message: 'Product deleted successfully'
      });
  } catch (error) {
      await client.query('ROLLBACK');
      next(error);
  } finally {
      client.release();
  }
});
// Apply error handling middleware
app.use(errorHandler);


// review component

// Add a new review
app.post('/api/reviews', async (req, res) => {
    const { image_id, review_text, rating } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO reviews (image_id, review_text, rating) VALUES ($1, $2, $3) RETURNING *',
        [image_id, review_text, rating]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Error adding review' });
    }
  });
  
  // Get all reviews for an image
  app.get('/api/reviews/:imageId', async (req, res) => {
    const imageId = req.params.imageId;
    
    try {
      const result = await pool.query(
        'SELECT * FROM reviews WHERE image_id = $1 ORDER BY created_at DESC',
        [imageId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching reviews' });
    }
  });
  



// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

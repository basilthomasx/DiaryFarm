import express from 'express';// db
import bcrypt from 'bcrypt';// db
import pkg from 'pg'; //download packages
import cors from 'cors';
import jwt from 'jsonwebtoken';//secret code
import multer from 'multer';
import fs from 'fs';//file system
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';//for mailing
import dotenv from 'dotenv';
// import crypto from 'crypto';


dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors())
app.use(express.urlencoded({extended: true }));




const pool = new Pool({
   user: 'postgres',
    host: 'localhost',
   database: 'diary_farm', 
    password: 'Basil123@', 
  port: 5432,
});


// Test connection of DB

app.get('/api/test', async (req, res) => {
  try {
      const result = await pool.query('SELECT NOW()');
      res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
      console.error('Database test failed:', err);
      res.status(500).json({ success: false, error: err.message });
    
  }
});


// Customer Signup

app.post('/api/CustomerSignUp', async (req, res) => {
  try {
    const { full_name, email, phone, username, password } = req.body;

    console.log('Received signup details:', { full_name, email, phone, username, password });

    const userCheck = await pool.query(
      'SELECT * FROM customers WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
// Inserting the new customer into the database

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


// Customer Login

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


// LOGIN CUSTOMER END



    const JWT_SECRET = "fdcb99c33cb1213c01c08881fbadd09ffd72f9a41cd5a9d29c52f9eb28e39047";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG and GIF allowed.'), false);
  }
};


// Configure multer for image upload


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
      cb(null, `staff-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 } // 5MB limit
});


// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
      error: err.message || 'Something went wrong!'
  });
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



  
// Admin Staff Login 

async function seedTable(tableName, users) {
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query(
            `INSERT INTO ${tableName} (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`,
            [user.username, hashedPassword]
        );
    }
}


async function initializeDatabase() {


// admin login////////


    const adminResult = await pool.query('SELECT COUNT(*) FROM admin_login');
    if (parseInt(adminResult.rows[0].count, 10) === 0) {
        await seedTable('admin_login', [
            { username: 'admin1', password: 'password1' },
            { username: 'admin2', password: 'password2' },
            { username: 'admin3', password: 'password3' },
        ]);
    }

  // staff login

    const staffResult = await pool.query('SELECT COUNT(*) FROM staff_login');
    if (parseInt(staffResult.rows[0].count, 10) === 0) {
        await seedTable('staff_login', [
            { username: 'staff1', password: 'password1' },
            { username: 'staff2', password: 'password2' },
            { username: 'staff3', password: 'password3' },
        ]);
    }
}

initializeDatabase();

// login 

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
app.post('/api/admin/login', (req, res) => loginUser(req, res, 'admin_login'));

// Staff Login Endpoint
app.post('/api/staff/login', (req, res) => loginUser(req, res, 'staff_login'));

//ADMIN STAFF login 




// product management component

// Create - Upload product with image
app.post('/images', upload.single('image'), async (req, res, next) => {
  try {
      const { image_title, description } = req.body;
      
      if (!req.file) {
          throw new Error('No image file provided');
      }

      const result = await pool.query(
          'INSERT INTO products (file_name, image_title, description) VALUES ($1, $2, $3) RETURNING *',
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
          'SELECT * FROM products ORDER BY created_at DESC'
      );
      res.json(result.rows);
  } catch (error) {
      next(error);
  }
});


// Add this route to your Express backend


app.get('/api/product-count', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as count FROM products');
        res.json({ count: result.rows[0].count });
    } catch (error) {
        console.error('Error fetching products count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Read - Get single product


app.get('/images/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const result = await pool.query(
          'SELECT * FROM products WHERE id = $1',
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
          'UPDATE products SET image_title = $1, description = $2, created_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
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
          'SELECT file_name FROM products WHERE id = $1',
          [id]
      );

      if (fileResult.rows.length === 0) {
          return res.status(404).json({
              error: 'Product not found'
          });
      }

      await client.query(
          'DELETE FROM products WHERE id = $1',
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


// review component Add a new review


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
  

// Get all staff


app.get('/api/staff', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM staffs ORDER BY created_at DESC');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: error.message });
  }
});

// Add new staff


app.post('/api/staff', upload.single('image'), async (req, res) => {
  try {
      const { 
          first_name, 
          last_name, 
          email, 
          phone, 
          role, 
          joining_date, 
          salary 
      } = req.body;
      
       
    const image_url = req.file 
    ? `/uploads/${req.file.filename}` 
    : null;
      const result = await pool.query(
          'INSERT INTO staffs (first_name, last_name, email, phone, role, joining_date, salary, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [first_name, last_name, email, phone, role, joining_date, salary, image_url]
      );

      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error adding staff:', error);
      res.status(500).json({ error: error.message });
  }
});


// Update staff


app.put('/api/staff/:id', upload.single('image'), async (req, res) => {
  try {
      const { id } = req.params;
      const { 
          first_name, 
          last_name, 
          email, 
          phone, 
          role, 
          joining_date, 
          salary 
      } = req.body;

      let query = 'UPDATE staffs SET first_name=$1, last_name=$2, email=$3, phone=$4, role=$5, joining_date=$6, salary=$7';
      let params = [first_name, last_name, email, phone, role, joining_date, salary];

      if (req.file) {
          query += ', image_url=$8';
          params.push(`/uploads/${req.file.filename}`);
      }

      query += ' WHERE id=$' + (params.length + 1) + ' RETURNING *';
      params.push(id);

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Staff not found' });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error updating staff:', error);
      res.status(500).json({ error: error.message });
  }
});


// Delete staff


app.delete('/api/staff/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM staffs WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Staff not found' });
      }

      res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
      console.error('Error deleting staff:', error);
      res.status(500).json({ error: error.message });
  }
});




// Get all products


app.get('/api/products', async (req, res) => {
    try {
      const query = `
        SELECT * FROM products 
        ORDER BY created_at DESC`;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  // Get single product


  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM products WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


 // Add new product with image


app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const {
            name,
            description,
            stock_quantity,
            rate,
            is_milk_product,
            subscription_amount,
            quantity
        } = req.body;

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const query = `
            INSERT INTO products 
            (name, description, image_url, stock_quantity, rate, 
             is_milk_product, subscription_amount, subscription_duration_days, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;

        const values = [
            name,
            description,
            image_url,
            parseInt(stock_quantity),
            parseFloat(rate),
            is_milk_product === 'true',
            is_milk_product === 'true' ? parseFloat(subscription_amount) : null,
            is_milk_product === 'true' ? 30 : null,
            parseInt(quantity)
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// Update product with image


app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            stock_quantity,
            rate,
            is_milk_product,
            subscription_amount,
            quantity,
            current_image
        } = req.body;

// If new image uploaded, delete old image


        if (req.file && current_image) {
            const oldImagePath = path.join(__dirname, current_image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const image_url = req.file ? `/uploads/${req.file.filename}` : current_image;

        const query = `
            UPDATE products 
            SET name = $1,
                description = $2,
                image_url = $3,
                stock_quantity = $4,
                rate = $5,
                is_milk_product = $6,
                subscription_amount = $7,
                subscription_duration_days = $8,
                quantity = $9,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *`;

        const values = [
            name,
            description,
            image_url,
            parseInt(stock_quantity),
            parseFloat(rate),
            is_milk_product === 'true',
            is_milk_product === 'true' ? parseFloat(subscription_amount) : null,
            is_milk_product === 'true' ? 30 : null,
            parseInt(quantity),
            id
        ];

        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// Delete product (with image)


app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
// First get the product to get the image path

        const getQuery = 'SELECT image_url FROM products WHERE id = $1';
        const getResult = await pool.query(getQuery, [id]);
        
        if (getResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

// Delete the image file if it exists

        const image_url = getResult.rows[0].image_url;
        if (image_url) {
            const imagePath = path.join(__dirname, image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

// Delete the product from database


        const deleteQuery = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const deleteResult = await pool.query(deleteQuery, [id]);
        
        res.json({ message: 'Product deleted successfully', product: deleteResult.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

  
// Get milk subscription products


  app.get('/api/milk-subscriptions', async (req, res) => {
    try {
      const query = `
        SELECT id, name, subscription_amount, subscription_duration_days, quantity 
        FROM products 
        WHERE is_milk_product = true 
        AND subscription_duration_days = 30
        ORDER BY quantity`;
      
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// Get all products


app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE stock_quantity > 0');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get single product


app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Create order



app.post('/api/orders/create', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
  
    // Get product details
    const productResult = await client.query(
      'SELECT * FROM products WHERE id = $1',
      [req.body.product_id]
    );
    
    const product = productResult.rows[0];
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Check stock availability
    if (product.stock_quantity < req.body.quantity) {
      throw new Error('Insufficient stock');
    }
    
    // Set payment status based on payment method
    const paymentStatus = req.body.payment_method === 'cod' ? 'completed' : 'pending';
    
    // Create order in customer_orders table
    const orderResult = await client.query(
      `INSERT INTO customer_orders (
        customer_name, 
        customer_phone, 
        customer_email,
        customer_postal_code, 
        customer_house_number,
        product_id, 
        product_name, 
        product_description,
        product_image_url, 
        quantity, 
        rate,
        delivery_due_date,
        actual_delivery_date,
        payment_status,
        payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id`,
      [
        req.body.customer_name,
        req.body.customer_phone,
        req.body.customer_email,
        req.body.customer_postal_code,
        req.body.customer_house_number,
        product.id,
        product.name,
        product.description,
        product.image_url,
        req.body.quantity,
        product.rate,
        req.body.delivery_due_date,
        req.body.actual_delivery_date,
        paymentStatus,
        req.body.payment_method
      ]
    );

    
    await client.query(
      'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
      [req.body.quantity, product.id]
    );

    await client.query('COMMIT');
    
   
    const orderId = orderResult.rows[0].id;
    
 
    try {
      
     
      
      
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: "dairytest03@gmail.com",
          pass: "dyxe okfd mkcc gawy"
        }
      });
      
      
      const mailOptions = {
        from: "dairytest03@gmail.com",
        to: req.body.customer_email,
        subject: `Order Confirmation ${orderId}`,
        html: `
          <h1>Thank you for your order<br/>
          God’s Own Dairy.</h1>
          <p>Dear ${req.body.customer_name},</p>
          <p>We're pleased to confirm that your order has been received and is being processed.</p>
          <h2>Order Details:</h2>
          <ul>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>Product:</strong> ${product.name}</li>
            <li><strong>Quantity:</strong> ${req.body.quantity}</li>
            <li><strong>Total Amount:</strong> ₹${(product.rate * req.body.quantity).toFixed(2)}</li>
            <li><strong>Payment Method:</strong> ${req.body.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</li>
            
            <li><strong>Expected Delivery:</strong> ${new Date(req.body.delivery_due_date).toLocaleDateString()}</li>
          </ul>
          <p>If you have any questions about your order, please contact our customer service.</p>
          <p>Leave us a call : 9999999999</P>
          <p>Thank you for shopping with us!</p>
        `
      };
      
      // Send email asynchronously (don't wait for it to complete)
      transporter.sendMail(mailOptions)
        .then(() => console.log(`Order confirmation email sent to ${req.body.customer_email}`))
        .catch(err => console.error('Error sending confirmation email:', err));
    } catch (emailError) {
      // Log email error but don't fail the order process
      console.error('Error preparing confirmation email:', emailError);
    }
    
    // Send success response
    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      orderId: orderId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  } finally {
    client.release();
  }
});

 


// Get all reviews for a product


app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM reviews 
       WHERE product_id = $1 
       ORDER BY created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new review


app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, rating, reviewText } = req.body;

// Validate input


    if (!userName || !rating || !reviewText) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_name, rating, review_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, userName, rating, reviewText]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get average rating for a product


app.get('/api/products/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews
       FROM reviews 
       WHERE product_id = $1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM customer_orders
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
});

// Get order details by ID
app.get('/api/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  
  try {
    const result = await pool.query(`
      SELECT *
      FROM customer_orders
      WHERE id = $1
    `, [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ error: 'An error occurred while fetching order details' });
  }
});


app.post('/api/callback-requests', async (req, res) => {
  try {
      const { name, phone } = req.body;

      // Validate phone number
      if (!/^\d{10}$/.test(phone)) {
          return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
      }

      const result = await pool.query(
          'INSERT INTO callback_requests (name, phone) VALUES ($1, $2) RETURNING *',
          [name, phone]
      );

      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error submitting callback request:', error);
      res.status(500).json({ error: 'Failed to submit callback request' });
  }
});

// Get all callback requests
app.get('/api/callback-requests', async (req, res) => {
  try {
      const result = await pool.query(
          `SELECT id, name, phone, requested_at, status 
           FROM callback_requests 
           ORDER BY CASE 
              WHEN status = 'pending' THEN 0 
              ELSE 1 
           END, requested_at DESC`
      );

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching callback requests:', error);
      res.status(500).json({ error: 'Failed to fetch callback requests' });
  }
});

// Update callback request status
app.put('/api/callback-requests/:id/status', async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'completed'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await pool.query(
          'UPDATE callback_requests SET status = $1 WHERE id = $2 RETURNING *',
          [status, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Callback request not found' });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error updating callback request:', error);
      res.status(500).json({ error: 'Failed to update callback request' });
  }
});

// Staff listing route
app.get('/api/staff', async (req, res) => {
  try {
      const result = await pool.query(
          'SELECT id, first_name, last_name, email, role FROM staffs ORDER BY created_at DESC'
      );
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: error.message });
  }
});

// Staff assignment route
app.put('/api/orders/:id/assign', async (req, res) => {
  const orderId = req.params.id;
  const { staffId } = req.body;
  
  if (!staffId) {
      return res.status(400).json({ error: 'Staff ID is required' });
  }
  
  try {
      // First get the staff member's full name
      const staffResult = await pool.query(
          'SELECT id, first_name, last_name FROM staffs WHERE id = $1',
          [staffId]
      );
      
      if (staffResult.rows.length === 0) {
          return res.status(404).json({ error: 'Staff member not found' });
      }

      const staffMember = staffResult.rows[0];
      const fullName = `${staffMember.first_name} ${staffMember.last_name}`;
      
      // Update the order with the staff's full name
      const updateResult = await pool.query(
          `UPDATE customer_orders 
           SET assigned_to = $1,
               updated_at = CURRENT_TIMESTAMP 
           WHERE id = $2
           RETURNING *`,
          [fullName, orderId]
      );
      
      if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ 
          message: 'Staff assigned successfully',
          order: updateResult.rows[0]
      });
  } catch (err) {
      console.error('Error assigning staff:', err);
      res.status(500).json({ error: 'An error occurred while assigning staff' });
  }
});



// Get milk quality data for a specific date
app.get('/api/milk-quality/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await pool.query(
      'SELECT * FROM milk_quality WHERE date = $1',
      [date]
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error('Error fetching milk quality data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update milk quality data for a specific date (upsert)
app.put('/api/milk-quality/:date', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { date } = req.params;
    const { fat, protein, lactose, snf, temperature, ph, remarks } = req.body;
    
    // Check if record exists for this date
    const checkResult = await client.query(
      'SELECT 1 FROM milk_quality WHERE date = $1',
      [date]
    );
    
    if (checkResult.rows.length > 0) {
      // Update existing record
      await client.query(
        `UPDATE milk_quality 
         SET fat = $1, protein = $2, lactose = $3, snf = $4, 
             temperature = $5, ph = $6, remarks = $7, updated_at = CURRENT_TIMESTAMP
         WHERE date = $8`,
        [fat, protein, lactose, snf, temperature, ph, remarks, date]
      );
    } else {
      // Insert new record
      await client.query(
        `INSERT INTO milk_quality 
         (date, fat, protein, lactose, snf, temperature, ph, remarks)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [date, fat, protein, lactose, snf, temperature, ph, remarks]
      );
    }
    
    await client.query('COMMIT');
    res.status(200).json({ message: 'Milk quality data updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating milk quality data:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});



//----------------------------------

// Get delivery statistics
app.get('/api/deliveries/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM customer_orders');
    const completedResult = await pool.query('SELECT COUNT(*) FROM customer_orders WHERE delivery_status = $1', ['completed']);
    const pendingResult = await pool.query('SELECT COUNT(*) FROM customer_orders WHERE delivery_status = $1', ['pending']);
    
    res.json({
      total: parseInt(totalResult.rows[0].count),
      completed: parseInt(completedResult.rows[0].count),
      pending: parseInt(pendingResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching delivery stats:', error);
    res.status(500).json({ error: 'Failed to fetch delivery statistics' });
  }
});

// Get deliveries based on status
app.get('/api/deliveries', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM customer_orders';
    let params = [];
    
    if (status && status !== 'all') {
      query += ' WHERE delivery_status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY delivery_due_date ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// Get delivery by ID
app.get('/api/deliveries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customer_orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ error: 'Failed to fetch delivery details' });
  }
});

// Update delivery with proof image upload
app.put('/api/deliveries/:id', upload.single('delivery_proof'), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { delivery_status, actual_delivery_date } = req.body;
    
    // First verify the delivery exists
    const checkResult = await client.query('SELECT * FROM customer_orders WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // Base update query
    let query = 'UPDATE customer_orders SET delivery_status = $1, updated_at = CURRENT_TIMESTAMP';
    let params = [delivery_status];
    let paramCount = 2;
    
    // If actual_delivery_date is provided, add it to the query
    if (actual_delivery_date) {
      query += `, actual_delivery_date = $${paramCount}`;
      params.push(actual_delivery_date);
      paramCount++;
    }
    
    // If a file was uploaded, add delivery_proof_url to the query
    if (req.file) {
      const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
      query += `, delivery_proof_url = $${paramCount}`;
      params.push(fileUrl);
      paramCount++;
    }
    
    // Finish the query with WHERE clause
    query += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(id);
    
    // Execute the update
    const result = await client.query(query, params);
    await client.query('COMMIT');
    
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating delivery:', error);
    
    // If there was an error and a file was uploaded, try to delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file after failed update:', unlinkError);
      }
    }
    
    res.status(500).json({ error: 'Failed to update delivery' });
  } finally {
    client.release();
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      message: 'Error uploading file'
    });
  }
  
  if (err.message === 'Only jpeg, jpg, and png files are allowed') {
    return res.status(400).json({
      message: err.message
    });
  }
  
  res.status(500).json({
    message: 'Internal server error'
  });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

export default app;

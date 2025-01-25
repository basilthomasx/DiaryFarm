import express from 'express';
import bcrypt from 'bcrypt';
import pkg from 'pg'; // PostgreSQL client
import cors from 'cors';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'diary_farm', // Your database name
    password: 'Basil123@', // Replace with your actual password
    port: 5432,
});

///admin login

// Seed database with users
async function seedUsers() {
    const users = [
      { username: 'admin1', password: 'password1' },
      { username: 'admin2', password: 'password2' },
      { username: 'admin3', password: 'password3' },
    ];
  
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'INSERT INTO admins (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
        [user.username, hashedPassword]
      );
    }
  }
  
  // Seed users if the table is empty
  async function initializeDatabase() {
    const result = await pool.query('SELECT COUNT(*) FROM admins');
    const count = parseInt(result.rows[0].count, 10);
  
    if (count === 0) {
      await seedUsers();
    }
  }
  
  initializeDatabase();
  
  // Login endpoint
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    const userResult = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Your username or password is incorrect' });
    }
  
    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Your username or password is incorrect' });
    }
  
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  
    res.json({ token });
  });

// Signup Endpoint
app.post('/api/CustomerSignUp', async (req, res) => {
  try {
    const { fullName, email, phone, address, username, password } = req.body;

    console.log('Received signup details:', { fullName, email, phone, address, username, password });

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
      `INSERT INTO customers (full_name, email, phone, address, username, password)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [fullName, email, phone, address, username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



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


  // Seed database with users
async function seedCustomers() {
    const users = [
      { username: 'customer1', password: 'password1' },
      { username: 'customer2', password: 'password2' },
      { username: 'customer3', password: 'password3' },
    ];
  
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'INSERT INTO customers (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
        [user.username, hashedPassword]
      );
    }
  }
  
  // Seed users if the table is empty
  async function initializeCustomers() {
    const result = await pool.query('SELECT COUNT(*) FROM customers');
    const count = parseInt(result.rows[0].count, 10);
  
    if (count === 0) {
      await seedCustomers();
    }
  }
  
  initializeCustomers();
  
  app.post('/api/customer-login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      console.log('Received username:', username);
      console.log('Received password:', password);
  
      // Query the database
      const userResult = await pool.query('SELECT * FROM customers WHERE username = $1', [username]);
      console.log('Database result:', userResult.rows);
  
      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Your username or password is incorrect' });
      }
  
      const user = userResult.rows[0];
      console.log('User from DB:', user);
  
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Is password valid:', isPasswordValid);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Your username or password is incorrect' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error('Error in login endpoint:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



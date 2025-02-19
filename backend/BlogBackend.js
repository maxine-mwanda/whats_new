// Import required modules
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
//app.use(express.static(path.join('build')));
app.use(express.json());

app.use(express.static('public', {
    maxAge: 0, // Disable caching
    etag: false, // Disable ETag (which may lead to 304 errors)
  }));

  const post = [
    { _id: "1", title: "First Post", content: "This is the first post" },
    { _id: "2", title: "Second Post", content: "This is the second post" },
  ];



// mysql Connection
const db = mysql.createConnection({
    host: "localhost", // Change if using a remote server
    user: "nodeuser",      // Your MySQL username
    password: "newpassword",      // Your MySQL password
    database: "whats_new" // Your MySQL database name
  });
  
  // Connect to MySQL
  db.connect((err) => {
    if (err) {
      console.error("❌ Database Connection Failed:", err);
    } else {
      console.log("✅ Connected to MySQL Database");
    }
  });

// DB Schema & Model
const createTables = () => {
    db.query(`
        CREATE TABLE IF NOT EXISTS User (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `, (err) => { if (err) throw err; });

    db.query(`
        CREATE TABLE IF NOT EXISTS Post (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            author_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES User(id) ON DELETE CASCADE
        );
    `, (err) => { if (err) throw err; });

    db.query(`
        CREATE TABLE IF NOT EXISTS Comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            author_id INT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE,
            FOREIGN KEY (author_id) REFERENCES User(id) ON DELETE CASCADE
        );
    `, (err) => { if (err) throw err; });

    console.log('Tables created successfully');
};
 
  createTables();

// Register Route
/*app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});*/

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query('INSERT INTO User (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.error("❌ Error registering user:", err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // First, check if the user exists in the database
        db.query('SELECT * FROM User WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: 'Server error' });
            }

            // If no user is found, return an error
            if (results.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const user = results[0]; // Assuming username is unique

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Send the token and user info back in the response
            res.json({ token, user: { id: user.id, username: user.username } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Blog Post
app.post('/posts', async (req, res) => {
    const { title, content } = req.body;
    const author = "admin"; // Change this if you have user authentication
  
    db.query("INSERT INTO post (title, content, author) VALUES (?, ?, ?)", 
      [title, content, author], 
      (err, result) => {
        if (err) {
          console.error("❌ Error creating post:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({ message: "Post created successfully", id: result.insertId });
    });
});

// Get All Blog Posts
app.get('/posts', (req, res) => {
    db.query("SELECT * FROM post", (err, results) => {
        if (err) {
          console.error("❌ Error fetching posts:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

// Get Single Blog Post
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Comment on a Blog Post
/*app.post('/comments', async (req, res) => {
    try {
        const { postId, author, content } = req.body;
        const newComment = new Comment({ postId, author, content });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});*/

app.use(bodyParser.json());

// Comment on a Blog Post
app.post('/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params; // Extract the postId from the URL parameter
      const { author, content } = req.body; // Expecting the body to have author and content
  
      // Query to find the post by postId
      const [postRows] = await db.promise().query('SELECT * FROM post WHERE id = ?', [postId]);
  
      if (postRows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const post = postRows[0]; // Assuming the post is an object with the data
  
      // Assuming you have a Comment model that saves the new comment
      const [commentResult] = await db.promise().query('INSERT INTO comments (postId, author, content) VALUES (?, ?, ?)', [postId, author, content]);
  
      // Optionally, you might want to update the `comments` field in the `post` table if you're storing comment references there
      res.status(201).json({
        id: commentResult.insertId,
        postId,
        author,
        content,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });



// Get Comments for a Blog Post
app.get('/comments/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Blog Post
app.put("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const sql = `UPDATE Post SET title = ?, content = ?, created_at = NOW() WHERE id = ?`;
    const values = [title, content, postId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating post:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post updated successfully' });
    });
    });

  // Delete Blog Post
  app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
  
    db.query("DELETE FROM post WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.error("❌ Error deleting post:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Post deleted successfully" });
    });
  });  

// ✅ Then serve frontend
app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Blog API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

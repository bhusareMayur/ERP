const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models/database');

// Import routes
const quizRoutes = require('./routes/quiz');
const teacherRoutes = require('./routes/teacher');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/teacher', teacherRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/teacher.html'));
});

// Test database connection on server start
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    try {
        // Test database connection
        await db.execute('SELECT 1');
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('Make sure MySQL is running and the database exists.');
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await db.end();
    process.exit(0);
});
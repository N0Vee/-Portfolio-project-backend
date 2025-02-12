const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'Database/DB.sqlite'
});

const Blog = sequelize.define('blog', {
    ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ImgUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    BlogName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    BlogUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DetailIntro: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DetailBody: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DetailConclusion: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DetailTemp: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

sequelize.sync();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all blogs
app.get('/blogs', (req, res) => {
    Blog.findAll().then(blogs => res.json(blogs)).catch(err => res.status(500).send(err));
});

// Get single blog by ID
app.get('/blogs/:ID', (req, res) => {
    Blog.findByPk(req.params.ID).then(blog => {
        if (!blog) {
            res.status(404).send('Blog not found');
        } else {
            res.json(blog);
        }
    }).catch(err => res.status(500).send(err));
});

// Create blog with image upload
app.post('/blogs', upload.single('ImgUrl'), (req, res) => {
    Blog.create({
        ImgUrl: req.file ? `/uploads/${req.file.filename}` : '',
        BlogName: req.body.BlogName,
        BlogUrl: req.body.BlogUrl,
        DetailIntro: req.body.DetailIntro,
        DetailBody: req.body.DetailBody,
        DetailConclusion: req.body.DetailConclusion,
        DetailTemp: req.body.DetailTemp
    })
    .then(blog => res.json(blog))
    .catch(err => res.status(500).send(err));
});

// Update blog
app.put('/blogs/:ID', (req, res) => {
    Blog.findByPk(req.params.ID).then(blog => {
        if (!blog) {
            res.status(404).send('Blog not found');
        } else {
            blog.update(req.body).then(() => res.json(blog)).catch(err => res.status(500).send(err));
        }
    }).catch(err => res.status(500).send(err));
});

// Delete blog
app.delete('/blogs/:ID', (req, res) => {
    Blog.findByPk(req.params.ID).then(blog => {
        if (!blog) {
            res.status(404).send('Blog not found');
        } else {
            blog.destroy().then(() => res.send({})).catch(err => res.status(500).send(err));
        }
    }).catch(err => res.status(500).send(err));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

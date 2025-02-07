const express = require(`express`);
const Sequelize = require(`sequelize`);
const app = express();

app.use(express.json());

const sequelize = new Sequelize('database', 'username', 'passwored', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'Database/DB.sqlite'
});

const blog = sequelize.define('blog', {
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
        type: Sequelize.INTEGER,
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
        allowNull: false
    }
});


sequelize.sync();


// TABLE -> blog
app.get('/blogs', (req,res) => {
    blog.findAll().then(blogs => {
        res.json(blogs);
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.get('/blogs/:ID', (req,res) => {
    blog.findByPk(req.params.ID).then(blog => {
        if (!blog) {
            res.status(404).send('blog not fount');
        } else {
            res.json(blog);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.post('/blogs', (req,res) => {
    blog.create(req.body).then(blogs => {
        res.send(blogs);
    }).catch(err => {
        res.status(500).send(err);
    });
})

app.put('/blogs/:ID', (req,res) => {
    blog.findByPk(req.params.ID).then(blog => {
        if (!blog) {
            res.status(404).send('blog not fount');
        } else {
            blog.update(req.body).then(() => {
                res.send(blog);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.delete('/blogs/:ID', (req,res) => {
    blog.findByPk(req.params.ID).then(blog => {
        if (!blog) {
            res.status(404).send('blog not fount');
        } else {
            blog.destroy().then(() => {
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
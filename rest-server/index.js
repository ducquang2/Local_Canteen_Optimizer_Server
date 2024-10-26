var restify = require('restify');
const pool = require('./db');

var server = restify.createServer();

// server.use(restify.plugins.bodyParser());

server.get('/', async function (req, res) {
    var db_info = "Database is up & running";

    res.send({
        Server: "Server is working",
        Database: db_info
    });
});

server.get('/categories', async function (req, res) {
    try {
        const client = await pool.connect()
        console.log(client);
        
        const result = await client.query('SELECT * FROM Categories');
        client.release()
        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.send(500, { error: 'Internal Server Error' });
    }
});

// Endpoint to create a new category
server.post('/categories', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]); // Return the newly created category
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
var express = require('express');
const mysql = require('mysql');
const {DB_PASSWORD} = require('../constants.js');
var router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD,
  database: 'video_game_collection'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// CONSOLES

// Get All Consoles
router.get('/consoles', async (req, res) => {
    try {
        await connection.query(`SELECT * FROM Console`, function (error, results)  {
            if (error) throw error;
            return res.render("consoles.ejs", { consoles: results });
        });
    } catch (error) {
        console.log(error);
        return res.render("error.ejs", { error: error });
    }
    
});

// Get Specific Console Information

router.get('/consoles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await connection.query(`SELECT * FROM Console WHERE id=${id}`, function (error, results)  {
            if (error) throw error;
            console.log(results)
            return res.render("console.ejs", {
                consoles: results,
                id: id
            });
        });
    } catch (error) {
        console.log(error);
        return res.render("error.ejs", { error: error });
    }
    
});


module.exports = router;

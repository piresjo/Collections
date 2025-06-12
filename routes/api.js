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

// CONSOLES

// Get All Console Information
router.get('/consoles', async (req, res) => {
    try {
        await connection.query(`SELECT * FROM Console`, function (error, results, fields)  {
            if (error) throw error;
            return res.status(200).json(results);
        });
    } catch (error) {
        console.log(error);
    }
    
});

// Get Console Information
router.get('/consoles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await connection.query(`SELECT * FROM Console WHERE id=${id}`, function (error, results, fields)  {
            if (error) throw error;
            if (results.length == 0) {
                return res.status(404).json({ message: "Console Not Found" });
            }
            return res.status(200).json(results);
        });
    } catch (error) {
        console.log(error);
    }
    
});

// Create A New Console
router.post('/consoles', async (req, res) => {
    const bodyVal = req.body;
    if (bodyVal.name == null) {
        return res.status(400).json({ message: "Console Needs To Have A Name" });
    }
    if (bodyVal.console_type == null) {
        return res.status(400).json({ message: "console_type Must Be Defined" });
    }
    if (bodyVal.region == null) {
        return res.status(400).json({ message: "region Must Be Defined" });
    }
    if (bodyVal.product_condition == null) {
        return res.status(400).json({ message: "product_condition Must Be Defined" });
    }
    if (bodyVal.has_packaging == null) {
        return res.status(400).json({ message: "has_packaging Must Be Defined" });
    }
    if (bodyVal.is_duplicate == null) {
        return res.status(400).json({ message: "is_duplicate Must Be Defined" });
    }
    if (bodyVal.has_cables == null) {
        return res.status(400).json({ message: "has_cables Must Be Defined" });
    }
    try {
        const entry = {
            name: bodyVal.name,
            console_type: bodyVal.console_type,
            model: bodyVal.model,
            region: bodyVal.region,
            release_date: bodyVal.release_date,
            bought_date: bodyVal.bought_date,
            company: bodyVal.company,
            product_condition: bodyVal.product_condition,
            has_packaging: bodyVal.has_packaging,
            is_duplicate: bodyVal.is_duplicate,
            has_cables: bodyVal.has_cables,
            monetary_value: bodyVal.monetary_value,
            notes: bodyVal.notes
        };
        
        await connection.query(
            "INSERT INTO Console SET ?", entry, function(error, results, fields) {
                if (error) throw error;
                return res.status(201).json({
                    message: "Console Created",
                    result: results
                });
            });
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
});

module.exports = router;
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
            return res.status(200).json({
                success: true,
                results: results
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: "Unexpected error in backend. Please try again",
            error: error
        });
    }
    
});

// Get Console Information
router.get('/consoles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await connection.query(`SELECT * FROM Console WHERE id=${id}`, function (error, results, fields)  {
            if (error) throw error;
            if (results.length == 0) {
                return res.status(404).json({ 
                    success: false,
                    message: "Console Not Found" 
                });
            }
            return res.status(200).json({
                success: true,
                results: results
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: "Unexpected error in backend. Please try again",
            error: error
        });
    }
    
});

// Create A New Console
router.post('/consoles', async (req, res) => {
    const bodyVal = req.body;
    if (bodyVal.name == null) {
        return res.status(400).json({ 
            success: false,
            message: "Console Needs To Have A Name" 
        });
    }
    if (bodyVal.console_type == null) {
        return res.status(400).json({ 
            success: false,
            message: "console_type Must Be Defined" 
        });
    }
    if (bodyVal.region == null) {
        return res.status(400).json({ 
            success: false,
            message: "region Must Be Defined" 
        });
    }
    if (bodyVal.product_condition == null) {
        return res.status(400).json({ 
            success: false,
            message: "product_condition Must Be Defined" 
        });
    }
    if (bodyVal.has_packaging == null) {
        return res.status(400).json({ 
            success: false,
            message: "has_packaging Must Be Defined" 
        });
    }
    if (bodyVal.is_duplicate == null) {
        return res.status(400).json({ 
            success: false,
            message: "is_duplicate Must Be Defined" 
        });
    }
    if (bodyVal.has_cables == null) {
        return res.status(400).json({ 
            success: false,
            message: "has_cables Must Be Defined" 
        });
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
                    success: true,
                    message: "Console Created",
                    results: results
                });
            });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            success: false,
            message: "Unexpected error in backend. Please try again",
            error: error
        });
    }
});

// Update Existing Console
router.put('/consoles/:id', async (req, res) => {
    const bodyVal = req.body;
    if (bodyVal.name == null) {
        return res.status(400).json({ 
            success: false,
            message: "Console Needs To Have A Name" 
        });
    }
    if (bodyVal.console_type == null) {
        return res.status(400).json({ 
            success: false,
            message: "console_type Must Be Defined" 
        });
    }
    if (bodyVal.region == null) {
        return res.status(400).json({ 
            success: false,
            message: "region Must Be Defined" 
        });
    }
    if (bodyVal.product_condition == null) {
        return res.status(400).json({ 
            success: false,
            message: "product_condition Must Be Defined" 
        });
    }
    if (bodyVal.has_packaging == null) {
        return res.status(400).json({ 
            success: false,
            message: "has_packaging Must Be Defined" 
        });
    }
    if (bodyVal.is_duplicate == null) {
        return res.status(400).json({ 
            success: false,
            message: "is_duplicate Must Be Defined" 
        });
    }
    if (bodyVal.has_cables == null) {
        return res.status(400).json({ 
            success: false,
            message: "has_cables Must Be Defined" 
        });
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
            `UPDATE Console SET ? WHERE id=${id}`, entry, function(error, results, fields) {
                if (error) throw error;
                console.log(results);
                return res.status(200).json({
                    success: true,
                    message: "Console Updated",
                    results: results
                });
            });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            success: false,
            message: "Unexpected error in backend. Please try again",
            error: error
        });
    }
});

// Delete Console
router.delete('/consoles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await connection.query(`DELETE FROM Console WHERE id=${id}`, function (error, results)  {
            if (error) throw error;
            console.log(results);
            if (results.affectedRows == 0) {
                return res.status(404).json({ 
                    success: false,
                    message: "Console Not Found. Could Not Be Deleted" 
                });
            }
            return res.status(200).json({
                success: true,
                message: `Successfully deleted Console with id=${id}`,
                results: results
            });
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
            success: false,
            message: "Unexpected error in backend. Please try again",
            error: error
        });
    }
});

module.exports = router;
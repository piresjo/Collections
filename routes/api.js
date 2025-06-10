var express = require('express');
const { connection } = require('../app');
var router = express.Router();

// CONSOLES

// Get Console Information
router.get('/consoles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const consoleVal = connection.query("SELECT * FROM Console WHERE id=$1", [id]);
        res.json(consoleVal);
    } catch (error) {
        console.log(error);
    }
    
});

// Create A New Console
router.post('/consoles', async (req, res) => {
    res.json(req.body);
});

module.exports = router;
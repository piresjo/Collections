import express from "express";
import mysql from "mysql";
import { DB_PASSWORD } from "../secrets.js";
import fs from "fs";
import csv from "fast-csv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
var router = express.Router();
const upload = multer({ dest: "public/csv/" });

const __filename = fileURLToPath(import.meta.url);
console.log("MOO");
console.log(__filename);
const __dirname = `C:\\Users\\Pires\\OneDrive\\Documents\\GitHub\\CollectionsDB\\public\\csv\\`;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "video_game_collection",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index.ejs");
});

// CONSOLES

// Get All Consoles
router.get("/consoles", async (req, res) => {
  try {
    await connection.query(`SELECT * FROM Console`, function (error, results) {
      if (error) throw error;
      return res.render("consoles.ejs", { consoles: results });
    });
  } catch (error) {
    console.log(error);
    return res.render("error.ejs", { error: error });
  }
});

// Get Specific Console Information
router.get("/consoles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `SELECT * FROM Console WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        return res.render("console.ejs", {
          consoles: results,
          id: id,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.render("error.ejs", { error: error });
  }
});

// GAMES

// Get All Games
router.get("/games", async (req, res) => {
  try {
    await connection.query(`SELECT * FROM Game`, function (error, results) {
      if (error) throw error;
      return res.render("games.ejs", { games: results });
    });
  } catch (error) {
    console.log(error);
    return res.render("error.ejs", { error: error });
  }
});

// Get Specific Game Information
router.get("/games/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `SELECT * FROM Game WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        return res.render("game.ejs", {
          games: results,
          id: id,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.render("error.ejs", { error: error });
  }
});

// ACCESSORIES

// Get All Accessories
router.get("/accessories", async (req, res) => {
  try {
    await connection.query(
      `SELECT * FROM Accessory`,
      function (error, results) {
        if (error) throw error;
        return res.render("accessories.ejs", { accessories: results });
      },
    );
  } catch (error) {
    console.log(error);
    return res.render("error.ejs", { error: error });
  }
});

// Get Specific Accessory Information
router.get("/accessories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `SELECT * FROM Accessory WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        return res.render("accessory.ejs", {
          accessories: results,
          id: id,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.render("error.ejs", { error: error });
  }
});

// Bulk Entry - Console
router.get("/bulk_entry/consoles", async (req, res) => {
  res.render("bulkentry.ejs");
});

router.post("/bulk_entry/consoles", async (req, res) => {
  console.log("PONG");

  // When a file has been uploaded
  if (req.files && Object.keys(req.files).length !== 0) {
    // Uploaded path
    const uploadedFile = req.files.uploadFile;

    // Logging uploading file
    console.log(uploadedFile);

    // Upload path
    const uploadPath = __dirname + uploadedFile.name;

    console.log(uploadPath);

    fs.createReadStream(uploadPath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => console.log(row))
      .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));
  } else res.send("No file uploaded !!");
});

// Bulk Entry - Games
router.post("/bulk_entry/games", upload.single("file"), async (req, res) => {
  console.log("PING");
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

// Bulk Entry - Accessories
router.post(
  "/bulk_entry/accessories",
  upload.single("file"),
  async (req, res) => {
    console.log("PING");
    const title = req.body.title;
    const file = req.file;

    console.log(title);
    console.log(file);

    res.sendStatus(200);
  },
);

export default router;

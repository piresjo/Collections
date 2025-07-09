import express from "express";
import mysql from "mysql";
import { DB_PASSWORD } from "../secrets.js";
import fs from "fs";
import csv from "fast-csv";
import { fileURLToPath } from "url";
import multer from "multer";
import {
  DERIVE_REGION,
  DERIVE_CONSOLE_TYPE,
  VALIDATE_CONSOLE_ENTRY_JSON,
  DERIVE_PRODUCT_CONDITION,
} from "../constants.js";
var router = express.Router();
const upload = multer({ dest: "public/csv/" });

const __filename = fileURLToPath(import.meta.url);
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
  // When a file has been uploaded
  if (req.files && Object.keys(req.files).length !== 0) {
    const uploadedFile = req.files.uploadFile;
    const uploadPath = __dirname + uploadedFile.name;
    var consoleList = [];

    fs.createReadStream(uploadPath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        consoleList.push(row);
      })
      .on("end", (rowCount) => {
        console.log(`Parsed ${rowCount} rows`);

        var resultsList = [];

        consoleList.forEach((console) => {
          try {
            const entry = {
              name: console.Name,
              console_type: DERIVE_CONSOLE_TYPE(
                console["Console Type"].toLowerCase(),
              ),
              model: console.Model === "" ? null : console.Model,
              region: DERIVE_REGION(console.Region.toUpperCase()),
              release_date:
                console["Release Date"] === "" ? null : console["Release Date"],
              bought_date:
                console["Bought Date"] === "" ? null : console["Bought Date"],
              company: console.Company === "" ? null : console.Company,
              product_condition: DERIVE_PRODUCT_CONDITION(
                console["Product Condition"].toLowerCase(),
              ),
              has_packaging: console["Has Packaging"].toLowerCase() === "yes",
              is_duplicate: console["Is Duplicate"].toLowerCase() === "yes",
              has_cables: console["Has Cables"].toLowerCase() === "yes",
              has_console: console["Has Console"].toLowerCase() === "yes",
              monetary_value:
                console["Monetary Value"] === ""
                  ? null
                  : parseFloat(console["Monetary Value"]),
              notes: console.Notes,
            };

            const errorVal = VALIDATE_CONSOLE_ENTRY_JSON(entry);

            if (errorVal != null) {
              return res.status(400).json(errorVal);
            }

            connection.query(
              "INSERT INTO Console SET ?",
              entry,
              function (error, results) {
                if (error) throw error;
                resultsList.push(results);
              },
            );
          } catch (error) {
            console.log(error);
            return res.render("error.ejs", { error: error });
          }
        });
        return res.render("created.ejs", {
          object: "Console",
          rowsAdded: rowCount,
        });
      });
  } else {
    res.send("No file uploaded !!");
  }
});

// Bulk Entry - Games
router.post("/bulk_entry/games", upload.single("file"), async (req, res) => {
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
    const title = req.body.title;
    const file = req.file;

    console.log(title);
    console.log(file);

    res.sendStatus(200);
  },
);

export default router;

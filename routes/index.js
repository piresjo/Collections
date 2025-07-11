import express from "express";
import mysql from "mysql";
import { DB_PASSWORD } from "../secrets.js";
import fs from "fs";
import csv from "fast-csv";
import { fileURLToPath } from "url";
import {
  DERIVE_REGION,
  DERIVE_CONSOLE_TYPE,
  VALIDATE_CONSOLE_ENTRY_JSON,
  DERIVE_PRODUCT_CONDITION,
  VALIDATE_GAME_ENTRY_JSON,
  ConsolesAndIds,
  VALIDATE_ACCESSORY_ENTRY_JSON,
  DERIVE_ACCESSORY_TYPE,
} from "../constants.js";
var router = express.Router();

const __filename = fileURLToPath(import.meta.url);
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
  res.render("bulkentry.ejs", { object: "Console" });
});

router.post("/bulk_entry/consoles", async (req, res) => {
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
                  : parseFloat(console["Monetary Value"].trim().slice(1)),
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
router.get("/bulk_entry/games", async (req, res) => {
  res.render("bulkentry.ejs", { object: "Game" });
});

router.post("/bulk_entry/games", async (req, res) => {
  if (req.files && Object.keys(req.files).length !== 0) {
    const uploadedFile = req.files.uploadFile;
    const uploadPath = __dirname + uploadedFile.name;
    var gameList = [];

    fs.createReadStream(uploadPath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        gameList.push(row);
      })
      .on("end", (rowCount) => {
        console.log(`Parsed ${rowCount} rows`);
        var resultsList = [];
        gameList.forEach((game) => {
          try {
            const entry = {
              has_game: game["Has Game"].toLowerCase() === "yes",
              is_duplicate: game["Is Duplicate"].toLowerCase() === "yes",
              has_manual: game["Has Manual"].toLowerCase() === "yes",
              has_box: game["Has Box"].toLowerCase() === "yes",
              monetary_value:
                game["Monetary Value"] === ""
                  ? null
                  : parseFloat(game["Monetary Value"].trim().slice(1)),
              notes: game.Notes,
              console_id: ConsolesAndIds[game.Console.toLowerCase()],
              name: game.Name,
              edition: game.Edition === "" ? null : game.Edition,
              release_date:
                game["Release Date"] === ""
                  ? null
                  : new Date(game["Release Date"]).toISOString().split("T")[0],
              bought_date:
                game["Bought Date"] === ""
                  ? null
                  : new Date(game["Bought Date"]).toISOString().split("T")[0],
              region: DERIVE_REGION(game.Region.toUpperCase()),
              developer: game["Developer"] === "" ? null : game["Developer"],
              publisher: game["Publisher"] === "" ? null : game["Publisher"],
              digital: game["Digital"].toLowerCase() === "yes",
              product_condition: DERIVE_PRODUCT_CONDITION(
                game["Product Condition"].toLowerCase(),
              ),
            };
            const errorVal = VALIDATE_GAME_ENTRY_JSON(entry);

            if (errorVal != null) {
              return res.status(400).json(errorVal);
            }

            connection.query(
              "INSERT INTO Game SET ?",
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
          object: "Game",
          rowsAdded: rowCount,
        });
      });
  } else {
    res.send("No file uploaded !!");
  }
});

// Bulk Entry - Accessories
router.get("/bulk_entry/accessories", async (req, res) => {
  res.render("bulkentry.ejs", { object: "Accessory" });
});

router.post("/bulk_entry/accessories", async (req, res) => {
  if (req.files && Object.keys(req.files).length !== 0) {
    const uploadedFile = req.files.uploadFile;
    const uploadPath = __dirname + uploadedFile.name;
    var accessoryList = [];

    fs.createReadStream(uploadPath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        accessoryList.push(row);
      })
      .on("end", (rowCount) => {
        console.log(`Parsed ${rowCount} rows`);

        var resultsList = [];

        accessoryList.forEach((accessory) => {
          try {
            const entry = {
              console_id: ConsolesAndIds[accessory.Console.toLowerCase()],
              name: accessory.Name,
              model: accessory.Model,
              accessory_type: DERIVE_ACCESSORY_TYPE(
                accessory["Accessory Type"].toLowerCase(),
              ),
              release_date:
                accessory["Release Date"] === ""
                  ? null
                  : new Date(accessory["Release Date"])
                      .toISOString()
                      .split("T")[0],
              bought_date:
                accessory["Bought Date"] === ""
                  ? null
                  : new Date(accessory["Bought Date"])
                      .toISOString()
                      .split("T")[0],
              company: accessory.Company === "" ? null : accessory.Company,
              product_condition: DERIVE_PRODUCT_CONDITION(
                accessory["Product Condition"].toLowerCase(),
              ),
              has_packaging: accessory["Has Packaging"].toLowerCase() === "yes",
              monetary_value:
                accessory["Monetary Value"] === ""
                  ? null
                  : parseFloat(accessory["Monetary Value"].trim().slice(1)),
              notes: accessory.Notes,
            };

            const errorVal = VALIDATE_ACCESSORY_ENTRY_JSON(entry);

            if (errorVal != null) {
              return res.status(400).json(errorVal);
            }

            connection.query(
              "INSERT INTO Accessory SET ?",
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
          object: "Accessory",
          rowsAdded: rowCount,
        });
      });
  } else {
    res.send("No file uploaded !!");
  }
});

export default router;

import express from "express";
import mysql from "mysql";
import { DB_PASSWORD } from "../secrets.js";
var router = express.Router();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "video_game_collection",
});

// HELPER METHODS
function validateConsoleEntryJSON(bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return {
      success: false,
      message: "Console Needs To Have A Name",
    };
  }
  if (bodyVal.console_type == null) {
    return {
      success: false,
      message: "console_type Must Be Defined",
    };
  }
  if (bodyVal.region == null) {
    return {
      success: false,
      message: "region Must Be Defined",
    };
  }
  if (bodyVal.product_condition == null) {
    return {
      success: false,
      message: "product_condition Must Be Defined",
    };
  }
  if (bodyVal.has_packaging == null) {
    return {
      success: false,
      message: "has_packaging Must Be Defined",
    };
  }
  if (bodyVal.is_duplicate == null) {
    return {
      success: false,
      message: "is_duplicate Must Be Defined",
    };
  }
  if (bodyVal.has_cables == null) {
    return {
      success: false,
      message: "has_cables Must Be Defined",
    };
  }
  if (bodyVal.has_console == null) {
    return {
      success: false,
      message: "has_console Must Be Defined",
    };
  }
  return returnVal;
}

function validateGameEntryJSON(bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return {
      success: false,
      message: "Game Needs To Have A Name",
    };
  }
  if (bodyVal.console_id == null) {
    return {
      success: false,
      message: "console_id Must Be Defined",
    };
  }
  if (bodyVal.digital == null) {
    return {
      success: false,
      message: "digital Must Be Defined",
    };
  }
  if (bodyVal.region == null) {
    return {
      success: false,
      message: "region Must Be Defined",
    };
  }
  if (bodyVal.product_condition == null) {
    return {
      success: false,
      message: "product_condition Must Be Defined",
    };
  }
  if (bodyVal.has_box == null) {
    return {
      success: false,
      message: "has_box Must Be Defined",
    };
  }
  if (bodyVal.is_duplicate == null) {
    return {
      success: false,
      message: "is_duplicate Must Be Defined",
    };
  }
  if (bodyVal.has_manual == null) {
    return {
      success: false,
      message: "has_manual Must Be Defined",
    };
  }
  if (bodyVal.has_game == null) {
    return {
      success: false,
      message: "has_game Must Be Defined",
    };
  }
  return returnVal;
}

function validateAccessoryEntryJSON(bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return {
      success: false,
      message: "Accessory Needs To Have A Name",
    };
  }
  if (bodyVal.console_id == null) {
    return {
      success: false,
      message: "console_id Must Be Defined",
    };
  }
  if (bodyVal.accessory_type == null) {
    return {
      success: false,
      message: "accessory_type Must Be Defined",
    };
  }
  if (bodyVal.product_condition == null) {
    return {
      success: false,
      message: "product_condition Must Be Defined",
    };
  }
  if (bodyVal.has_packaging == null) {
    return {
      success: false,
      message: "has_packaging Must Be Defined",
    };
  }
  return returnVal;
}

// CONSOLES

// Get All Console Information
router.get("/consoles", async (req, res) => {
  try {
    await connection.query(`SELECT * FROM Console`, function (error, results) {
      if (error) throw error;
      return res.status(200).json({
        success: true,
        results: results,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Get Console Information
router.get("/consoles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `SELECT * FROM Console WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        if (results.length == 0) {
          return res.status(404).json({
            success: false,
            message: "Console Not Found",
          });
        }
        return res.status(200).json({
          success: true,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Create A New Console
router.post("/consoles", async (req, res) => {
  const bodyVal = req.body;
  const errorVal = validateConsoleEntryJSON(bodyVal);
  if (errorVal != null) {
    return res.status(400).json(errorVal);
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
      has_console: bodyVal.has_console,
      monetary_value: bodyVal.monetary_value,
      notes: bodyVal.notes,
    };

    await connection.query(
      "INSERT INTO Console SET ?",
      entry,
      function (error, results) {
        if (error) throw error;
        return res.status(201).json({
          success: true,
          message: "Console Created",
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Update Existing Console
router.put("/consoles/:id", async (req, res) => {
  const bodyVal = req.body;
  const id = parseInt(req.params.id);
  const errorVal = validateConsoleEntryJSON(bodyVal);
  if (errorVal != null) {
    return res.status(400).json(errorVal);
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
      has_console: bodyVal.has_console,
      monetary_value: bodyVal.monetary_value,
      notes: bodyVal.notes,
    };

    await connection.query(
      `UPDATE Console SET ? WHERE id=${id}`,
      entry,
      function (error, results) {
        if (error) throw error;
        if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: `Console With id=${id} Not Found. Could Not Be Updated`,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Console With id=${id} Updated`,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Delete Console
router.delete("/consoles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `DELETE FROM Console WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: `Console With id=${id} Not Found. Could Not Be Deleted`,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Successfully deleted Console with id=${id}`,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// GAMES

// Get All Games
router.get("/games", async (req, res) => {
  try {
    await connection.query(`SELECT * FROM Game`, function (error, results) {
      if (error) throw error;
      return res.status(200).json({
        success: true,
        results: results,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Get Game Information
router.get("/games/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `SELECT * FROM Game WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        if (results.length == 0) {
          return res.status(404).json({
            success: false,
            message: "Game Not Found",
          });
        }
        return res.status(200).json({
          success: true,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Create A New Game
router.post("/games", async (req, res) => {
  const bodyVal = req.body;
  const errorVal = validateGameEntryJSON(bodyVal);
  if (errorVal != null) {
    return res.status(400).json(errorVal);
  }
  try {
    const entry = {
      console_id: bodyVal.console_id,
      name: bodyVal.name,
      edition: bodyVal.edition,
      release_date: bodyVal.release_date,
      bought_date: bodyVal.bought_date,
      region: bodyVal.region,
      developer: bodyVal.developer,
      publisher: bodyVal.publisher,
      digital: bodyVal.digital,
      has_game: bodyVal.has_game,
      has_manual: bodyVal.has_manual,
      has_box: bodyVal.has_box,
      is_duplicate: bodyVal.is_duplicate,
      product_condition: bodyVal.product_condition,
      monetary_value: bodyVal.monetary_value,
      notes: bodyVal.notes,
    };

    await connection.query(
      "INSERT INTO Game SET ?",
      entry,
      function (error, results) {
        if (error) throw error;
        return res.status(201).json({
          success: true,
          message: "Game Created",
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Update Existing Game
router.put("/games/:id", async (req, res) => {
  const bodyVal = req.body;
  const id = parseInt(req.params.id);
  const errorVal = validateGameEntryJSON(bodyVal);
  if (errorVal != null) {
    return res.status(400).json(errorVal);
  }
  try {
    const entry = {
      console_id: bodyVal.console_id,
      name: bodyVal.name,
      edition: bodyVal.edition,
      release_date: bodyVal.release_date,
      bought_date: bodyVal.bought_date,
      region: bodyVal.region,
      developer: bodyVal.developer,
      publisher: bodyVal.publisher,
      digital: bodyVal.digital,
      has_game: bodyVal.has_game,
      has_manual: bodyVal.has_manual,
      has_box: bodyVal.has_box,
      is_duplicate: bodyVal.is_duplicate,
      product_condition: bodyVal.product_condition,
      monetary_value: bodyVal.monetary_value,
      notes: bodyVal.notes,
    };

    await connection.query(
      `UPDATE Game SET ? WHERE id=${id}`,
      entry,
      function (error, results) {
        if (error) throw error;
        if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: `Game With id=${id} Not Found. Could Not Be Updated`,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Game With id=${id} Updated`,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Delete Game
router.delete("/games/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `DELETE FROM Game WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: `Game With id=${id} Not Found. Could Not Be Deleted`,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Successfully deleted Game with id=${id}`,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
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
        return res.status(200).json({
          success: true,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Get Accessory Information
router.get("/accessories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `SELECT * FROM Accessory WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        if (results.length == 0) {
          return res.status(404).json({
            success: false,
            message: "Accessory Not Found",
          });
        }
        return res.status(200).json({
          success: true,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Create A New Accessory
router.post("/accessories", async (req, res) => {
  const bodyVal = req.body;
  const errorVal = validateAccessoryEntryJSON(bodyVal);
  if (errorVal != null) {
    return res.status(400).json(errorVal);
  }
  try {
    const entry = {
      console_id: bodyVal.console_id,
      name: bodyVal.name,
      model: bodyVal.model,
      accessory_type: bodyVal.accessory_type,
      release_date: bodyVal.release_date,
      bought_date: bodyVal.bought_date,
      company: bodyVal.company,
      product_condition: bodyVal.product_condition,
      has_packaging: bodyVal.has_packaging,
      monetary_value: bodyVal.monetary_value,
      notes: bodyVal.notes,
    };

    await connection.query(
      "INSERT INTO Accessory SET ?",
      entry,
      function (error, results) {
        if (error) throw error;
        return res.status(201).json({
          success: true,
          message: "Accessory Created",
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Update Existing Accessory
router.put("/accessories/:id", async (req, res) => {
  const bodyVal = req.body;
  const id = parseInt(req.params.id);
  const errorVal = validateAccessoryEntryJSON(bodyVal);
  if (errorVal != null) {
    return res.status(400).json(errorVal);
  }
  try {
    const entry = {
      console_id: bodyVal.console_id,
      name: bodyVal.name,
      model: bodyVal.model,
      accessory_type: bodyVal.accessory_type,
      release_date: bodyVal.release_date,
      bought_date: bodyVal.bought_date,
      company: bodyVal.company,
      product_condition: bodyVal.product_condition,
      has_packaging: bodyVal.has_packaging,
      monetary_value: bodyVal.monetary_value,
      notes: bodyVal.notes,
    };

    await connection.query(
      `UPDATE Accessory SET ? WHERE id=${id}`,
      entry,
      function (error, results) {
        if (error) throw error;
        if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: `Accessory With id=${id} Not Found. Could Not Be Updated`,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Accessory With id=${id} Updated`,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

// Delete Accessory
router.delete("/accessories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await connection.query(
      `DELETE FROM Accessory WHERE id=${id}`,
      function (error, results) {
        if (error) throw error;
        if (results.affectedRows == 0) {
          return res.status(404).json({
            success: false,
            message: `Accessory With id=${id} Not Found. Could Not Be Deleted`,
          });
        }
        return res.status(200).json({
          success: true,
          message: `Successfully deleted Accessory with id=${id}`,
          results: results,
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error in backend. Please try again",
      error: error,
    });
  }
});

export default router;

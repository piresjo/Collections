const mysql = require("mysql");
const { DB_PASSWORD } = require("../../secrets");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "video_game_collection",
});

async function getConsoles() {
  await connection
    .promise()
    .query(`SELECT * FROM Console`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function getConsoleInformation(idVal) {
  await connection
    .promise()
    .query(
      `SELECT * FROM Console WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
}

async function addConsole(bodyVal) {
  await connection
    .promise()
    .query("INSERT INTO Console SET ?", bodyVal, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function updateConsole(idVal, bodyVal) {
  await connection
    .promise()
    .query(
      `UPDATE Console SET ? WHERE id=${idVal}`,
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
}

async function deleteConsole(idVal) {
  await connection
    .promise()
    .query(`DELETE FROM Console WHERE id=${idVal}`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function getGames() {
  await connection
    .promise()
    .query(`SELECT * FROM Game`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function getGameInformation(idVal) {
  await connection
    .promise()
    .query(`SELECT * FROM Game WHERE id=${idVal}`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function addGame(bodyVal) {
  await connection
    .promise()
    .query("INSERT INTO Game SET ?", bodyVal, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function updateGame(idVal, bodyVal) {
  await connection
    .promise()
    .query(
      `UPDATE Game SET ? WHERE id=${idVal}`,
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
}

async function deleteGame(idVal) {
  await connection
    .promise()
    .query(`DELETE FROM Game WHERE id=${idVal}`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function getAccessories() {
  await connection
    .promise()
    .query(`SELECT * FROM Accessory`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function getAccessoryInformation(idVal) {
  await connection
    .promise()
    .query(
      `SELECT * FROM Accessory WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
}

async function addAccessory(bodyVal) {
  await connection
    .promise()
    .query("INSERT INTO Accessory SET ?", bodyVal, function (error, results) {
      if (error) throw error;
      return results;
    });
}

async function updateAccessory(idVal, bodyVal) {
  await connection
    .promise()
    .query(
      `UPDATE Accessory SET ? WHERE id=${idVal}`,
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
}

async function deleteAccessory(idVal) {
  await connection
    .promise()
    .query(
      `DELETE FROM Accessory WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
}

module.exports = {
  getConsoles,
  getConsoleInformation,
  addConsole,
  updateConsole,
  deleteConsole,
  getGames,
  getGameInformation,
  addGame,
  updateGame,
  deleteGame,
  getAccessories,
  getAccessoryInformation,
  addAccessory,
  updateAccessory,
  deleteAccessory,
};

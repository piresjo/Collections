import mysql from "mysql";
import { DB_PASSWORD } from "../../secrets.js";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASSWORD,
  database: "video_game_collection",
});

export async function getConsoles() {
  console.log("ABCD");
  await connection
    .promise()
    .query(`SELECT * FROM Console`, function (error, results) {
      if (error) throw error;
      return results;
    });
}

export async function getConsoleInformation(idVal) {
  await connection.query(
    `SELECT * FROM Console WHERE id=${idVal}`,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function addConsole(bodyVal) {
  await connection.query(
    "INSERT INTO Console SET ?",
    bodyVal,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function updateConsole(idVal, bodyVal) {
  await connection.query(
    `UPDATE Console SET ? WHERE id=${idVal}`,
    bodyVal,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function deleteConsole(idVal) {
  await connection.query(
    `DELETE FROM Console WHERE id=${idVal}`,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function getGames() {
  await connection.query(`SELECT * FROM Game`, function (error, results) {
    if (error) throw error;
    return results;
  });
}

export async function getGameInformation(idVal) {
  await connection.query(
    `SELECT * FROM Game WHERE id=${idVal}`,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function addGame(bodyVal) {
  await connection.query(
    "INSERT INTO Game SET ?",
    bodyVal,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function updateGame(idVal, bodyVal) {
  await connection.query(
    `UPDATE Game SET ? WHERE id=${idVal}`,
    bodyVal,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function deleteGame(idVal) {
  await connection.query(
    `DELETE FROM Game WHERE id=${idVal}`,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function getAccessories() {
  await connection.query(`SELECT * FROM Accessory`, function (error, results) {
    if (error) throw error;
    return results;
  });
}

export async function getAccessoryInformation(idVal) {
  await connection.query(
    `SELECT * FROM Accessory WHERE id=${idVal}`,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function addAccessory(bodyVal) {
  await connection.query(
    "INSERT INTO Accessory SET ?",
    bodyVal,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function updateAccessory(idVal, bodyVal) {
  await connection.query(
    `UPDATE Accessory SET ? WHERE id=${idVal}`,
    bodyVal,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

export async function deleteAccessory(idVal) {
  await connection.query(
    `DELETE FROM Accessory WHERE id=${idVal}`,
    function (error, results) {
      if (error) throw error;
      return results;
    },
  );
}

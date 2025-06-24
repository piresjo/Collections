export class Database {
  constructor(connection) {
    this.connection = connection;
  }

  async getConsoles() {
    console.log("ABCD");
    await this.connection.query(
      `SELECT * FROM Console`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async getConsoleInformation(idVal) {
    await this.connection.query(
      `SELECT * FROM Console WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async addConsole(bodyVal) {
    await this.connection.query(
      "INSERT INTO Console SET ?",
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async updateConsole(idVal, bodyVal) {
    await this.connection.query(
      `UPDATE Console SET ? WHERE id=${idVal}`,
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async deleteConsole(idVal) {
    await this.connection.query(
      `DELETE FROM Console WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async getGames() {
    await this.connection.query(
      `SELECT * FROM Game`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async getGameInformation(idVal) {
    await this.connection.query(
      `SELECT * FROM Game WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async addGame(bodyVal) {
    await this.connection.query(
      "INSERT INTO Game SET ?",
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async updateGame(idVal, bodyVal) {
    await this.connection.query(
      `UPDATE Game SET ? WHERE id=${idVal}`,
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async deleteGame(idVal) {
    await this.connection.query(
      `DELETE FROM Game WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async getAccessories() {
    await this.connection.query(
      `SELECT * FROM Accessory`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async getAccessoryInformation(idVal) {
    await this.connection.query(
      `SELECT * FROM Accessory WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async addAccessory(bodyVal) {
    await this.connection.query(
      "INSERT INTO Accessory SET ?",
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async updateAccessory(idVal, bodyVal) {
    await this.connection.query(
      `UPDATE Accessory SET ? WHERE id=${idVal}`,
      bodyVal,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }

  async deleteAccessory(idVal) {
    await this.connection.query(
      `DELETE FROM Accessory WHERE id=${idVal}`,
      function (error, results) {
        if (error) throw error;
        return results;
      },
    );
  }
}

export class Database {
    constructor(connection) {
        this.connection = connection
    }

    async getConsoles() {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM Console`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async getConsoleInformation(idVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM Console WHERE id=${idVal}`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async addConsole(bodyVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'INSERT INTO Console SET ?',
                bodyVal,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async updateConsole(idVal, bodyVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `UPDATE Console SET ? WHERE id=${idVal}`,
                bodyVal,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async deleteConsole(idVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `DELETE FROM Console WHERE id=${idVal}`,
                function (error, results) {
                    if (results.affectedRows === 0) resolve(null)
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async getGames() {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM Game`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async getGameInformation(idVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM Game WHERE id=${idVal}`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async addGame(bodyVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'INSERT INTO Game SET ?',
                bodyVal,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async updateGame(idVal, bodyVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `UPDATE Game SET ? WHERE id=${idVal}`,
                bodyVal,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async deleteGame(idVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `DELETE FROM Game WHERE id=${idVal}`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async getAccessories() {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM Accessory`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async getAccessoryInformation(idVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM Accessory WHERE id=${idVal}`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async addAccessory(bodyVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'INSERT INTO Accessory SET ?',
                bodyVal,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async updateAccessory(idVal, bodyVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `UPDATE Accessory SET ? WHERE id=${idVal}`,
                bodyVal,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }

    async deleteAccessory(idVal) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `DELETE FROM Accessory WHERE id=${idVal}`,
                function (error, results) {
                    if (error) return reject(error)
                    resolve(results)
                }
            )
        })
    }
}

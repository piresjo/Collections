export class Database {
    constructor(connection) {
        this.connection = connection
    }

    async getConsoles() {
        const [results] = await this.connection.query(`SELECT * FROM Console`)
        return results
    }

    async getConsoleInformation(idVal) {
        const [results] = await this.connection.query(
            `SELECT * FROM Console WHERE id=?`,
            [idVal]
        )
        return results
    }

    async addConsole(bodyVal) {
        const [results] = await this.connection.query(
            'INSERT INTO Console SET ?',
            [bodyVal]
        )
        return results
    }

    async updateConsole(idVal, bodyVal) {
        const [results] = await this.connection.query(
            `UPDATE Console SET ? WHERE id=?`,
            [bodyVal, idVal]
        )
        if (results.affectedRows === 0) return null
        return results
    }

    async deleteConsole(idVal) {
        const [results] = await this.connection.query(
            `DELETE FROM Console WHERE id=?`,
            [idVal]
        )
        if (results.affectedRows === 0) return null
        return results
    }

    async getGames() {
        const [results] = await this.connection.query(`SELECT * FROM Game`)
        return results
    }

    async getGameInformation(idVal) {
        const [results] = await this.connection.query(
            `SELECT * FROM Game WHERE id=?`,
            [idVal]
        )
        return results
    }

    async addGame(bodyVal) {
        const [results] = await this.connection.query(
            'INSERT INTO Game SET ?',
            [bodyVal]
        )
        return results
    }

    async updateGame(idVal, bodyVal) {
        const [results] = await this.connection.query(
            `UPDATE Game SET ? WHERE id=?`,
            [bodyVal, idVal]
        )
        if (results.affectedRows === 0) return null
        return results
    }

    async deleteGame(idVal) {
        const [results] = await this.connection.query(
            `DELETE FROM Game WHERE id=?`,
            [idVal]
        )
        if (results.affectedRows === 0) return null
        return results
    }

    async getAccessories() {
        const [results] = await this.connection.query(`SELECT * FROM Accessory`)
        return results
    }

    async getAccessoryInformation(idVal) {
        const [results] = await this.connection.query(
            `SELECT * FROM Accessory WHERE id=?`,
            [idVal]
        )
        return results
    }

    async addAccessory(bodyVal) {
        const [results] = await this.connection.query(
            'INSERT INTO Accessory SET ?',
            [bodyVal]
        )
        return results
    }

    async updateAccessory(idVal, bodyVal) {
        const [results] = await this.connection.query(
            `UPDATE Accessory SET ? WHERE id=?`,
            [bodyVal, idVal]
        )
        if (results.affectedRows === 0) return null
        return results
    }

    async deleteAccessory(idVal) {
        const [results] = await this.connection.query(
            `DELETE FROM Accessory WHERE id=?`,
            [idVal]
        )
        if (results.affectedRows === 0) return null
        return results
    }

    async consoleExists(idVal) {
        const results = await this.getConsoleInformation(idVal)
        return results.length > 0
    }

    async bulkConsoleEntry(consolesToAdd) {
        const [results] = await this.connection.query(
            `INSERT INTO Console (name, console_type, model, region, 
            release_date, bought_date, company, product_condition, 
            has_packaging, is_duplicate, has_cables, has_console, 
            monetary_value, notes) VALUES ?`,
            [consolesToAdd]
        )

        return results
    }

    async bulkGameEntry(gamesToAdd) {
        const [results] = await this.connection.query(
            `INSERT INTO Game (console_id, name, edition, release_date, bought_date, region,
            developer, publisher, digital, has_game, has_manual, has_box,
            is_duplicate, product_condition, monetary_value, notes) VALUES ?`,
            [gamesToAdd]
        )
        return results
    }

    async mapConsoleNameToConsoleIds() {
        const [results] = await this.connection.query(
            `SELECT id, name FROM Console`
        )
        const returnMap = Object.fromEntries(
            results.map((r) => [r.name.toLowerCase(), r.id])
        )
        return returnMap
    }
}

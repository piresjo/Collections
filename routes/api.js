import express from 'express'
import {
    GENERATE_500_ERROR_JSON,
    GENERATE_GET_JSON,
    GENERATE_CREATED_JSON,
    GENERATE_GET_NOT_FOUND_JSON,
    GENERATE_UPDATE_DELETE_NOT_FOUND_JSON,
    GENERATE_UPDATE_JSON,
    GENERATE_DELETE_JSON,
    VALIDATE_CONSOLE_ENTRY_JSON,
    VALIDATE_GAME_ENTRY_JSON,
    VALIDATE_ACCESSORY_ENTRY_JSON,
} from '../constants.js'

// HEALTHCHECK
export const getHealthCheck = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

// CONSOLES

// Get All Console Information
export const getAllConsoles = (database) => async (req, res) => {
    database.connection.query(
        'SELECT * FROM Console',
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            return res.status(200).json(GENERATE_GET_JSON(results))
        }
    )
}

// Get Console Information
export const getConsoleInformation = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Console WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            if (results.length === 0) {
                return res
                    .status(404)
                    .json(GENERATE_GET_NOT_FOUND_JSON('Console'))
            }
            return res.status(200).json(GENERATE_GET_JSON(results))
        }
    )
}

// Create A New Console
export const addConsole = (database) => async (req, res) => {
    const bodyVal = req.body
    const errorVal = VALIDATE_CONSOLE_ENTRY_JSON(bodyVal)
    if (errorVal != null) {
        return res.status(400).json(errorVal)
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
        }

        database.connection.query(
            'INSERT INTO Console SET ?',
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.status(500).json(GENERATE_500_ERROR_JSON(error))
                }
                return res
                    .status(201)
                    .json(GENERATE_CREATED_JSON('Console', results))
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

// Update Existing Console
export const updateConsole = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)
    const errorVal = VALIDATE_CONSOLE_ENTRY_JSON(bodyVal)
    if (errorVal != null) {
        return res.status(400).json(errorVal)
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
        }

        database.connection.query(
            `UPDATE Console SET ? WHERE id=${id}`,
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.status(500).json(GENERATE_500_ERROR_JSON(error))
                }
                if (results.affectedRows === 0) {
                    return res
                        .status(404)
                        .json(
                            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON(
                                'Console',
                                id,
                                true
                            )
                        )
                }
                return res
                    .status(200)
                    .json(GENERATE_UPDATE_JSON('Console', id, results))
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

export const deleteConsole = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `DELETE FROM Console WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json(
                        GENERATE_UPDATE_DELETE_NOT_FOUND_JSON(
                            'Console',
                            id,
                            false
                        )
                    )
            }
            return res
                .status(200)
                .json(GENERATE_DELETE_JSON('Console', id, results))
        }
    )
}

export const getAllGames = (database) => async (req, res) => {
    database.connection.query('SELECT * FROM Game', function (error, results) {
        if (error) {
            console.log(error)
            return res.status(500).json(GENERATE_500_ERROR_JSON(error))
        }
        return res.status(200).json(GENERATE_GET_JSON(results))
    })
}

export const getGameInformation = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Game WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            if (results.length === 0) {
                return res.status(404).json(GENERATE_GET_NOT_FOUND_JSON('Game'))
            }
            return res.status(200).json(GENERATE_GET_JSON(results))
        }
    )
}

export const addGame = (database) => async (req, res) => {
    const bodyVal = req.body
    const errorVal = VALIDATE_GAME_ENTRY_JSON(bodyVal)
    if (errorVal != null) {
        return res.status(400).json(errorVal)
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
        }

        database.connection.query(
            'INSERT INTO Game SET ?',
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.status(500).json(GENERATE_500_ERROR_JSON(error))
                }
                return res
                    .status(201)
                    .json(GENERATE_CREATED_JSON('Game', results))
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

export const updateGame = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)
    const errorVal = VALIDATE_GAME_ENTRY_JSON(bodyVal)
    if (errorVal != null) {
        return res.status(400).json(errorVal)
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
        }

        database.connection.query(
            `UPDATE Game SET ? WHERE id=${id}`,
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.status(500).json(GENERATE_500_ERROR_JSON(error))
                }
                if (results.affectedRows === 0) {
                    return res
                        .status(404)
                        .json(
                            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON(
                                'Game',
                                id,
                                true
                            )
                        )
                }
                return res
                    .status(200)
                    .json(GENERATE_UPDATE_JSON('Game', id, results))
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

export const deleteGame = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `DELETE FROM Game WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json(
                        GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Game', id, false)
                    )
            }
            return res
                .status(200)
                .json(GENERATE_DELETE_JSON('Game', id, results))
        }
    )
}

export const getAllAccessories = (database) => async (req, res) => {
    database.connection.query(
        'SELECT * FROM Accessory',
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            return res.status(200).json(GENERATE_GET_JSON(results))
        }
    )
}

export const getAccessoryInformation = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Accessory WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            if (results.length === 0) {
                return res
                    .status(404)
                    .json(GENERATE_GET_NOT_FOUND_JSON('Accessory'))
            }
            return res.status(200).json(GENERATE_GET_JSON(results))
        }
    )
}

export const addAccessory = (database) => async (req, res) => {
    const bodyVal = req.body
    const errorVal = VALIDATE_ACCESSORY_ENTRY_JSON(bodyVal)
    if (errorVal != null) {
        return res.status(400).json(errorVal)
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
        }

        database.connection.query(
            'INSERT INTO Accessory SET ?',
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.status(500).json(GENERATE_500_ERROR_JSON(error))
                }
                return res
                    .status(201)
                    .json(GENERATE_CREATED_JSON('Accessory', results))
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

export const updateAccessory = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)
    const errorVal = VALIDATE_ACCESSORY_ENTRY_JSON(bodyVal)
    if (errorVal != null) {
        return res.status(400).json(errorVal)
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
        }

        database.connection.query(
            `UPDATE Accessory SET ? WHERE id=${id}`,
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.status(500).json(GENERATE_500_ERROR_JSON(error))
                }
                if (results.affectedRows === 0) {
                    return res
                        .status(404)
                        .json(
                            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON(
                                'Accessory',
                                id,
                                true
                            )
                        )
                }
                return res
                    .status(200)
                    .json(GENERATE_UPDATE_JSON('Accessory', id, results))
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json(GENERATE_500_ERROR_JSON(error))
    }
}

export const deleteAccessory = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `DELETE FROM Accessory WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.status(500).json(GENERATE_500_ERROR_JSON(error))
            }
            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json(
                        GENERATE_UPDATE_DELETE_NOT_FOUND_JSON(
                            'Accessory',
                            id,
                            false
                        )
                    )
            }
            return res
                .status(200)
                .json(GENERATE_DELETE_JSON('Accessory', id, results))
        }
    )
}

export default function makeApiRouter(database) {
    const router = express.Router()

    router.get('/healthcheck', getHealthCheck)
    router.get('/consoles', getAllConsoles(database))
    router.get('/consoles/:id', getConsoleInformation(database))
    router.post('/consoles', addConsole(database))
    router.put('/consoles/:id', updateConsole(database))
    router.delete('/consoles/:id', deleteConsole(database))
    router.get('/games', getAllGames(database))
    router.get('/games/:id', getGameInformation(database))
    router.post('/games', addGame(database))
    router.put('/games/:id', updateGame(database))
    router.delete('/games/:id', deleteGame(database))
    router.get('/accessories', getAllAccessories(database))
    router.get('/accessories/:id', getAccessoryInformation(database))
    router.post('/accessories', addAccessory(database))
    router.put('/accessories/:id', updateAccessory(database))
    router.delete('/accessories/:id', deleteAccessory(database))

    return router
}

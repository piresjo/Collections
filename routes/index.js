import express from 'express'
import fs from 'fs'
import csv from 'fast-csv'
import {
    DERIVE_REGION,
    DERIVE_CONSOLE_TYPE,
    VALIDATE_CONSOLE_ENTRY_JSON,
    DERIVE_PRODUCT_CONDITION,
    VALIDATE_GAME_ENTRY_JSON,
    ConsolesAndIds,
    VALIDATE_ACCESSORY_ENTRY_JSON,
    DERIVE_ACCESSORY_TYPE,
    DERIVE_CONSOLE_TYPE_STRING,
    DERIVE_REGION_STRING,
    DERIVE_CONDITION_STRING,
} from '../constants.js'
import { body } from 'express-validator'

const __dirname =
    'C:\\Users\\Pires\\OneDrive\\Documents\\GitHub\\CollectionsDB\\public\\csv\\'

const validate = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req)
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() })
            }
        }

        next()
    }
}

export const getHomePage = function (req, res, next) {
    res.render('index.ejs')
}

export const getAllConsoles = (database) => async (req, res) => {
    database.connection.query(
        'SELECT * FROM Console',
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            for (let i = 0; i < results.length; i++) {
                results[i].console_type_string = DERIVE_CONSOLE_TYPE_STRING(
                    results[i].console_type
                )
                results[i].region_string = DERIVE_REGION_STRING(
                    results[i].region
                )
                results[i].condition_string = DERIVE_CONDITION_STRING(
                    results[i].product_condition
                )
            }
            return res.render('consoles.ejs', { consoles: results })
        }
    )
}

export const getConsoleInformation = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Console WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.length === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Console',
                    idVal: id,
                })
            }
            results[0].console_type_string = DERIVE_CONSOLE_TYPE_STRING(
                results[0].console_type
            )
            results[0].region_string = DERIVE_REGION_STRING(results[0].region)
            results[0].condition_string = DERIVE_CONDITION_STRING(
                results[0].product_condition
            )
            return res.render('console.ejs', {
                consoles: results,
                id,
            })
        }
    )
}

export const getAddConsolePage = async (req, res) => {
    return res.render('addEditConsole.ejs', { action: 'add' })
}

export const addConsole = (database) => async (req, res) => {
    const bodyVal = req.body

    try {
        const entry = {
            name: bodyVal.consoleName,
            console_type: parseInt(bodyVal.consoleType),
            model: 'consoleModel' in bodyVal ? bodyVal.consoleModel : null,
            region: bodyVal.region,
            release_date:
                bodyVal.releaseDate !== '' ? bodyVal.releaseDate : null,
            bought_date: bodyVal.boughtDate !== '' ? bodyVal.boughtDate : null,
            company: 'company' in bodyVal ? bodyVal.company : null,
            product_condition: parseInt(bodyVal.productCondition),
            has_packaging: 'hasPackaging' in bodyVal,
            is_duplicate: 'isDuplicate' in bodyVal,
            has_cables: 'hasCables' in bodyVal,
            has_console: 'hasConsole' in bodyVal,
            monetary_value:
                bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }
        database.connection.query(
            'INSERT INTO Console SET ?',
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.render('error.ejs', {
                        status: 500,
                        error: error,
                    })
                }
                return res.render('status.ejs', {
                    action: 'create',
                    object: 'Console',
                })
            }
        )
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getEditConsolePage = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Console WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.length === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Console',
                    idVal: id,
                })
            }

            return res.render('addEditConsole.ejs', {
                console: results[0],
                action: 'edit',
            })
        }
    )
}

export const editConsole = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)

    try {
        const entry = {
            name: bodyVal.consoleName,
            console_type: parseInt(bodyVal.consoleType),
            model: bodyVal.consoleModel !== '' ? bodyVal.consoleModel : null,
            region: bodyVal.region,
            release_date:
                bodyVal.releaseDate !== '' ? bodyVal.releaseDate : null,
            bought_date: bodyVal.boughtDate !== '' ? bodyVal.boughtDate : null,
            company: bodyVal.company !== '' ? bodyVal.company : null,
            product_condition: parseInt(bodyVal.productCondition),
            has_packaging: bodyVal.hasPackaging,
            is_duplicate: bodyVal.isDuplicate,
            has_cables: bodyVal.hasCables,
            has_console: bodyVal.hasConsole,
            monetary_value:
                bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }
        database.connection.query(
            `UPDATE Console SET ? WHERE id=${id}`,
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.render('error.ejs', {
                        status: 500,
                        error: error,
                    })
                }
                return res.render('status.ejs', {
                    action: 'update',
                    object: 'Console',
                    idVal: id,
                })
            }
        )
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const deleteConsole = (database) => async (req, res) => {
    const id = parseInt(req.body.id)
    database.connection.query(
        `DELETE FROM Console WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.affectedRows === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Console',
                    idVal: id,
                })
            }
            return res.render('status.ejs', {
                action: 'delete',
                object: 'Console',
                idVal: id,
            })
        }
    )
}

export const getAllGames = (database) => async (req, res) => {
    database.connection.query('SELECT * FROM Game', function (error, results) {
        if (error) {
            console.log(error)
            return res.render('error.ejs', { status: 500, error: error })
        }
        for (let i = 0; i < results.length; i++) {
            results[i].region_string = DERIVE_REGION_STRING(results[i].region)
            results[i].condition_string = DERIVE_CONDITION_STRING(
                results[i].product_condition
            )
        }
        return res.render('games.ejs', { games: results })
    })
}

export const getGameInformation = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Game WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.length === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Game',
                    idVal: id,
                })
            }

            results[0].region_string = DERIVE_REGION_STRING(results[0].region)
            results[0].condition_string = DERIVE_CONDITION_STRING(
                results[0].product_condition
            )
            return res.render('game.ejs', {
                games: results,
                id,
            })
        }
    )
}

export const getAddGamePage = async (req, res) => {
    return res.render('addEditGame.ejs', { action: 'add' })
}

export const addGame = (database) => async (req, res) => {
    const bodyVal = req.body

    try {
        const entry = {
            console_id: bodyVal.consoleId,
            name: bodyVal.gameName,
            edition: 'edition' in bodyVal ? bodyVal.edition : null,
            release_date:
                bodyVal.releaseDate !== '' ? bodyVal.releaseDate : null,
            bought_date: bodyVal.boughtDate !== '' ? bodyVal.boughtDate : null,
            region: bodyVal.region,
            developer: 'developer' in bodyVal ? bodyVal.developer : null,
            publisher: 'publisher' in bodyVal ? bodyVal.publisher : null,
            digital: bodyVal.digital,
            has_game: bodyVal.hasGame,
            has_manual: bodyVal.hasManual,
            has_box: bodyVal.hasBox,
            is_duplicate: bodyVal.isDuplicate,
            product_condition: bodyVal.productCondition,
            monetary_value:
                bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }
        database.connection.query(
            'INSERT INTO Game SET ?',
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.render('error.ejs', {
                        status: 500,
                        error: error,
                    })
                }
                return res.render('status.ejs', {
                    action: 'create',
                    object: 'Game',
                })
            }
        )
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const deleteGame = (database) => async (req, res) => {
    const id = parseInt(req.body.id)
    database.connection.query(
        `DELETE FROM Game WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.affectedRows === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Game',
                    idVal: id,
                })
            }
            return res.render('status.ejs', {
                action: 'delete',
                object: 'Game',
                idVal: id,
            })
        }
    )
}

export const getEditGamePage = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Game WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.length === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Game',
                    idVal: id,
                })
            }

            return res.render('addEditGame.ejs', {
                game: results[0],
                action: 'edit',
            })
        }
    )
}

export const editGame = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)

    try {
        const entry = {
            console_id: bodyVal.consoleId,
            name: bodyVal.gameName,
            edition: bodyVal.edition !== '' ? bodyVal.edition : null,
            release_date:
                bodyVal.releaseDate !== '' ? bodyVal.releaseDate : null,
            bought_date: bodyVal.boughtDate !== '' ? bodyVal.boughtDate : null,
            region: bodyVal.region,
            developer: bodyVal.developer !== '' ? bodyVal.developer : null,
            publisher: bodyVal.publisher !== '' ? bodyVal.publisher : null,
            digital: bodyVal.digital,
            has_game: bodyVal.hasGame,
            has_manual: bodyVal.hasManual,
            has_box: bodyVal.hasBox,
            is_duplicate: bodyVal.isDuplicate,
            product_condition: bodyVal.productCondition,
            monetary_value:
                bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: bodyVal.notes !== '' ? bodyVal.notes : null,
        }
        database.connection.query(
            `UPDATE Game SET ? WHERE id=${id}`,
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.render('error.ejs', {
                        status: 500,
                        error: error,
                    })
                }
                return res.render('status.ejs', {
                    action: 'update',
                    object: 'Game',
                    idVal: id,
                })
            }
        )
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAllAccessories = (database) => async (req, res) => {
    database.connection.query(
        'SELECT * FROM Accessory',
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            return res.render('accessories.ejs', { accessories: results })
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
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.length === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Accessory',
                    idVal: id,
                })
            }
            return res.render('accessory.ejs', {
                accessories: results,
                id,
            })
        }
    )
}

export const getAddAccessoryPage = async (req, res) => {
    return res.render('addEditAccessory.ejs', { action: 'add' })
}

export const addAccessory = (database) => async (req, res) => {
    const bodyVal = req.body

    try {
        const entry = {
            console_id: bodyVal.consoleId,
            name: bodyVal.accessoryName,
            model: 'accessoryModel' in bodyVal ? bodyVal.accessoryModel : null,
            accessory_type: bodyVal.accessoryType,
            release_date:
                bodyVal.releaseDate !== '' ? bodyVal.releaseDate : null,
            bought_date: bodyVal.boughtDate !== '' ? bodyVal.boughtDate : null,
            company: 'company' in bodyVal ? bodyVal.company : null,
            product_condition: bodyVal.productCondition,
            has_packaging: 'hasPackaging' in bodyVal,
            monetary_value:
                bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }
        database.connection.query(
            'INSERT INTO Accessory SET ?',
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.render('error.ejs', {
                        status: 500,
                        error: error,
                    })
                }
                return res.render('status.ejs', {
                    action: 'create',
                    object: 'Accessory',
                })
            }
        )
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const deleteAccessory = (database) => async (req, res) => {
    const id = parseInt(req.body.id)
    database.connection.query(
        `DELETE FROM Accessory WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.affectedRows === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Accessory',
                    idVal: id,
                })
            }

            return res.render('status.ejs', {
                action: 'delete',
                object: 'Accessory',
                idVal: id,
            })
        }
    )
}

export const getEditAccessoryPage = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    database.connection.query(
        `SELECT * FROM Accessory WHERE id=${id}`,
        function (error, results) {
            if (error) {
                console.log(error)
                return res.render('error.ejs', { status: 500, error: error })
            }
            if (results.length === 0) {
                return res.render('error.ejs', {
                    status: 404,
                    object: 'Accessory',
                    idVal: id,
                })
            }

            return res.render('addEditAccessory.ejs', {
                accessory: results[0],
                action: 'edit',
            })
        }
    )
}

export const editAccessory = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)

    try {
        const entry = {
            console_id: bodyVal.consoleId,
            name: bodyVal.accessoryName,
            model:
                bodyVal.accessoryModel !== '' ? bodyVal.accessoryModel : null,
            accessory_type: bodyVal.accessoryType,
            release_date:
                bodyVal.releaseDate !== '' ? bodyVal.releaseDate : null,
            bought_date: bodyVal.boughtDate !== '' ? bodyVal.boughtDate : null,
            company: bodyVal.company !== '' ? bodyVal.company : null,
            product_condition: bodyVal.productCondition,
            has_packaging: bodyVal.hasPackaging,
            monetary_value:
                bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: bodyVal.notes !== '' ? bodyVal.notes : null,
        }
        database.connection.query(
            `UPDATE Accessory SET ? WHERE id=${id}`,
            entry,
            function (error, results) {
                if (error) {
                    console.log(error)
                    return res.render('error.ejs', {
                        status: 500,
                        error: error,
                    })
                }
                return res.render('status.ejs', {
                    action: 'update',
                    object: 'Accessory',
                    idVal: id,
                })
            }
        )
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export default function makeSiteRouter(database) {
    const router = express.Router()

    router.get('/', getHomePage)
    router.get('/consoles', getAllConsoles(database))
    router.get('/consoles/:id', getConsoleInformation(database))
    router.get('/addConsole', getAddConsolePage)
    router.post(
        '/consoles',
        validate([
            body(
                'consoleName',
                'Console Name Must Be At Least 3 Characters And At Most 256 Characters'
            )
                .trim()
                .isLength({ min: 3, max: 256 })
                .escape(),
            body('consoleModel', 'Model Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('company', 'Company Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('notes', 'Notes Must Be At Most 1024 Characters')
                .trim()
                .isLength({ max: 1024 })
                .escape(),
            body('releaseDate').optional(),
            body('boughtDate').optional(),
            body('region').isNumeric().toInt(),
            body('consoleType').isNumeric().toInt(),
            body('productCondition').isNumeric().toInt(),
            body('hasPackaging').toBoolean(),
            body('isDuplicate').toBoolean(),
            body('hasCables').toBoolean(),
            body('hasConsole').toBoolean(),
            body('monetaryValue')
                .optional({ values: 'falsy' })
                .isDecimal()
                .toFloat(),
        ]),
        addConsole(database)
    )
    router.post('/deleteConsole', deleteConsole(database))
    router.get('/editConsole/:id', getEditConsolePage(database))
    router.post(
        '/editConsole/:id',
        validate([
            body(
                'consoleName',
                'Console Name Must Be At Least 3 Characters And At Most 256 Characters'
            )
                .trim()
                .isLength({ min: 3, max: 256 })
                .escape(),
            body('consoleModel', 'Model Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('company', 'Company Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('notes', 'Notes Must Be At Most 1024 Characters')
                .trim()
                .isLength({ max: 1024 })
                .escape(),
            body('releaseDate').optional(),
            body('boughtDate').optional(),
            body('region').isNumeric().toInt(),
            body('consoleType').isNumeric().toInt(),
            body('productCondition').isNumeric().toInt(),
            body('hasPackaging').toBoolean(),
            body('isDuplicate').toBoolean(),
            body('hasCables').toBoolean(),
            body('hasConsole').toBoolean(),
        ]),
        editConsole(database)
    )
    router.get('/games', getAllGames(database))
    router.get('/games/:id', getGameInformation(database))
    router.get('/addGame', getAddGamePage)
    router.post(
        '/games',
        validate([
            body(
                'gameName',
                'Game Name Must Be At Least 3 Characters And At Most 512 Characters'
            )
                .trim()
                .isLength({ min: 3, max: 512 })
                .escape(),
            body('edition', 'Edition Must Be At Most 256 Characters')
                .trim()
                .optional()
                .isLength({ max: 256 })
                .escape(),
            body('publisher', 'Publisher Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('developer', 'Developer Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('notes', 'Notes Must Be At Most 1024 Characters')
                .trim()
                .isLength({ max: 1024 })
                .escape(),
            body('releaseDate').optional(),
            body('boughtDate').optional(),
            body('region').isNumeric().toInt(),
            body('consoleId').isNumeric().toInt(),
            body('productCondition').isNumeric().toInt(),
            body('digital').toBoolean(),
            body('isDuplicate').toBoolean(),
            body('hasBox').toBoolean(),
            body('hasManual').toBoolean(),
            body('hasGame').toBoolean(),
            body('monetaryValue')
                .optional({ values: 'falsy' })
                .isDecimal()
                .toFloat(),
        ]),
        addGame(database)
    )
    router.post('/deleteGame', deleteGame(database))
    router.get('/editGame/:id', getEditGamePage(database))
    router.post(
        '/editGame/:id',
        validate([
            body(
                'gameName',
                'Game Name Must Be At Least 3 Characters And At Most 512 Characters'
            )
                .trim()
                .isLength({ min: 3, max: 512 })
                .escape(),
            body('edition', 'Edition Must Be At Most 256 Characters')
                .trim()
                .optional()
                .isLength({ max: 256 })
                .escape(),
            body('publisher', 'Publisher Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('developer', 'Developer Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('notes', 'Notes Must Be At Most 1024 Characters')
                .trim()
                .isLength({ max: 1024 })
                .escape(),
            body('releaseDate').optional(),
            body('boughtDate').optional(),
            body('region').isNumeric().toInt(),
            body('consoleId').isNumeric().toInt(),
            body('productCondition').isNumeric().toInt(),
            body('digital').toBoolean(),
            body('isDuplicate').toBoolean(),
            body('hasBox').toBoolean(),
            body('hasManual').toBoolean(),
            body('hasGame').toBoolean(),
        ]),
        editGame(database)
    )
    router.get('/accessories', getAllAccessories(database))
    router.get('/accessories/:id', getAccessoryInformation(database))
    router.get('/addAccessory', getAddAccessoryPage)
    router.post(
        '/accessories',
        validate([
            body(
                'accessoryName',
                'Accessory Name Must Be At Least 3 Characters And At Most 256 Characters'
            )
                .trim()
                .isLength({ min: 3, max: 256 })
                .escape(),
            body('accessoryModel', 'Model Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('company', 'Company Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('notes', 'Notes Must Be At Most 1024 Characters')
                .trim()
                .isLength({ max: 1024 })
                .escape(),
            body('releaseDate').optional(),
            body('boughtDate').optional(),
            body('consoleId').isNumeric().toInt(),
            body('accessoryType').isNumeric().toInt(),
            body('productCondition').isNumeric().toInt(),
            body('hasPackaging').toBoolean(),
            body('monetaryValue')
                .optional({ values: 'falsy' })
                .isDecimal()
                .toFloat(),
        ]),
        addAccessory(database)
    )
    router.post('/deleteAccessory', deleteAccessory(database))
    router.get('/editAccessory/:id', getEditAccessoryPage(database))
    router.post(
        '/editAccessory/:id',
        validate([
            body(
                'accessoryName',
                'Accessory Name Must Be At Least 3 Characters And At Most 256 Characters'
            )
                .trim()
                .isLength({ min: 3, max: 256 })
                .escape(),
            body('accessoryModel', 'Model Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('company', 'Company Name Must Be At Most 64 Characters')
                .trim()
                .optional()
                .isLength({ max: 64 })
                .escape(),
            body('notes', 'Notes Must Be At Most 1024 Characters')
                .trim()
                .isLength({ max: 1024 })
                .escape(),
            body('releaseDate').optional(),
            body('boughtDate').optional(),
            body('consoleId').isNumeric().toInt(),
            body('accessoryType').isNumeric().toInt(),
            body('productCondition').isNumeric().toInt(),
            body('hasPackaging').toBoolean(),
            body('monetaryValue')
                .optional({ values: 'falsy' })
                .isDecimal()
                .toFloat(),
        ]),
        editAccessory(database)
    )
    // Bulk Entry - Console
    router.get('/bulk_entry/consoles', async (req, res) => {
        res.render('bulkentry.ejs', { object: 'Console' })
    })

    router.post('/bulk_entry/consoles', async (req, res) => {
        if (req.files && Object.keys(req.files).length !== 0) {
            const uploadedFile = req.files.uploadFile
            const uploadPath = __dirname + uploadedFile.name
            const consoleList = []

            fs.createReadStream(uploadPath)
                .pipe(csv.parse({ headers: true }))
                .on('error', (error) => console.error(error))
                .on('data', (row) => {
                    consoleList.push(row)
                })
                .on('end', (rowCount) => {
                    console.log(`Parsed ${rowCount} rows`)

                    const resultsList = []

                    consoleList.forEach((console) => {
                        try {
                            const entry = {
                                name: console.Name,
                                console_type: DERIVE_CONSOLE_TYPE(
                                    console['Console Type'].toLowerCase()
                                ),
                                model:
                                    console.Model === '' ? null : console.Model,
                                region: DERIVE_REGION(
                                    console.Region.toUpperCase()
                                ),
                                release_date:
                                    console['Release Date'] === ''
                                        ? null
                                        : console['Release Date'],
                                bought_date:
                                    console['Bought Date'] === ''
                                        ? null
                                        : console['Bought Date'],
                                company:
                                    console.Company === ''
                                        ? null
                                        : console.Company,
                                product_condition: DERIVE_PRODUCT_CONDITION(
                                    console['Product Condition'].toLowerCase()
                                ),
                                has_packaging:
                                    console['Has Packaging'].toLowerCase() ===
                                    'yes',
                                is_duplicate:
                                    console['Is Duplicate'].toLowerCase() ===
                                    'yes',
                                has_cables:
                                    console['Has Cables'].toLowerCase() ===
                                    'yes',
                                has_console:
                                    console['Has Console'].toLowerCase() ===
                                    'yes',
                                monetary_value:
                                    console['Monetary Value'] === ''
                                        ? null
                                        : parseFloat(
                                              console['Monetary Value']
                                                  .trim()
                                                  .slice(1)
                                          ),
                                notes: console.Notes,
                            }

                            const errorVal = VALIDATE_CONSOLE_ENTRY_JSON(entry)

                            if (errorVal != null) {
                                return res.status(400).json(errorVal)
                            }

                            database.connection.query(
                                'INSERT INTO Console SET ?',
                                entry,
                                function (error, results) {
                                    if (error) throw error
                                    resultsList.push(results)
                                }
                            )
                        } catch (error) {
                            console.log(error)
                            return res.render('error.ejs', {
                                status: 500,
                                error: error,
                            })
                        }
                    })
                    return res.render('status.ejs', {
                        action: 'create',
                        object: 'Console',
                    })
                })
        } else {
            res.send('No file uploaded !!')
        }
    })

    // Bulk Entry - Games
    router.get('/bulk_entry/games', async (req, res) => {
        res.render('bulkentry.ejs', { object: 'Game' })
    })

    router.post('/bulk_entry/games', async (req, res) => {
        if (req.files && Object.keys(req.files).length !== 0) {
            const uploadedFile = req.files.uploadFile
            const uploadPath = __dirname + uploadedFile.name
            const gameList = []

            fs.createReadStream(uploadPath)
                .pipe(csv.parse({ headers: true }))
                .on('error', (error) => console.error(error))
                .on('data', (row) => {
                    gameList.push(row)
                })
                .on('end', (rowCount) => {
                    console.log(`Parsed ${rowCount} rows`)
                    const resultsList = []
                    gameList.forEach((game) => {
                        try {
                            const entry = {
                                has_game:
                                    game['Has Game'].toLowerCase() === 'yes',
                                is_duplicate:
                                    game['Is Duplicate'].toLowerCase() ===
                                    'yes',
                                has_manual:
                                    game['Has Manual'].toLowerCase() === 'yes',
                                has_box:
                                    game['Has Box'].toLowerCase() === 'yes',
                                monetary_value:
                                    game['Monetary Value'] === ''
                                        ? null
                                        : parseFloat(
                                              game['Monetary Value']
                                                  .trim()
                                                  .slice(1)
                                          ),
                                notes: game.Notes,
                                console_id:
                                    ConsolesAndIds[game.Console.toLowerCase()],
                                name: game.Name,
                                edition:
                                    game.Edition === '' ? null : game.Edition,
                                release_date:
                                    game['Release Date'] === ''
                                        ? null
                                        : new Date(game['Release Date'])
                                              .toISOString()
                                              .split('T')[0],
                                bought_date:
                                    game['Bought Date'] === ''
                                        ? null
                                        : new Date(game['Bought Date'])
                                              .toISOString()
                                              .split('T')[0],
                                region: DERIVE_REGION(
                                    game.Region.toUpperCase()
                                ),
                                developer:
                                    game.Developer === ''
                                        ? null
                                        : game.Developer,
                                publisher:
                                    game.Publisher === ''
                                        ? null
                                        : game.Publisher,
                                digital: game.Digital.toLowerCase() === 'yes',
                                product_condition: DERIVE_PRODUCT_CONDITION(
                                    game['Product Condition'].toLowerCase()
                                ),
                            }
                            const errorVal = VALIDATE_GAME_ENTRY_JSON(entry)

                            if (errorVal != null) {
                                return res.status(400).json(errorVal)
                            }

                            database.connection.query(
                                'INSERT INTO Game SET ?',
                                entry,
                                function (error, results) {
                                    if (error) throw error
                                    resultsList.push(results)
                                }
                            )
                        } catch (error) {
                            console.log(error)
                            return res.render('error.ejs', {
                                status: 500,
                                error: error,
                            })
                        }
                    })
                    return res.render('status.ejs', {
                        action: 'create',
                        object: 'Game',
                    })
                })
        } else {
            res.send('No file uploaded !!')
        }
    })

    // Bulk Entry - Accessories
    router.get('/bulk_entry/accessories', async (req, res) => {
        res.render('bulkentry.ejs', { object: 'Accessory' })
    })

    router.post('/bulk_entry/accessories', async (req, res) => {
        if (req.files && Object.keys(req.files).length !== 0) {
            const uploadedFile = req.files.uploadFile
            const uploadPath = __dirname + uploadedFile.name
            const accessoryList = []

            fs.createReadStream(uploadPath)
                .pipe(csv.parse({ headers: true }))
                .on('error', (error) => console.error(error))
                .on('data', (row) => {
                    accessoryList.push(row)
                })
                .on('end', (rowCount) => {
                    console.log(`Parsed ${rowCount} rows`)

                    const resultsList = []

                    accessoryList.forEach((accessory) => {
                        try {
                            const entry = {
                                console_id:
                                    ConsolesAndIds[
                                        accessory.Console.toLowerCase()
                                    ],
                                name: accessory.Name,
                                model: accessory.Model,
                                accessory_type: DERIVE_ACCESSORY_TYPE(
                                    accessory['Accessory Type'].toLowerCase()
                                ),
                                release_date:
                                    accessory['Release Date'] === ''
                                        ? null
                                        : new Date(accessory['Release Date'])
                                              .toISOString()
                                              .split('T')[0],
                                bought_date:
                                    accessory['Bought Date'] === ''
                                        ? null
                                        : new Date(accessory['Bought Date'])
                                              .toISOString()
                                              .split('T')[0],
                                company:
                                    accessory.Company === ''
                                        ? null
                                        : accessory.Company,
                                product_condition: DERIVE_PRODUCT_CONDITION(
                                    accessory['Product Condition'].toLowerCase()
                                ),
                                has_packaging:
                                    accessory['Has Packaging'].toLowerCase() ===
                                    'yes',
                                monetary_value:
                                    accessory['Monetary Value'] === ''
                                        ? null
                                        : parseFloat(
                                              accessory['Monetary Value']
                                                  .trim()
                                                  .slice(1)
                                          ),
                                notes: accessory.Notes,
                            }

                            const errorVal =
                                VALIDATE_ACCESSORY_ENTRY_JSON(entry)

                            if (errorVal != null) {
                                return res.status(400).json(errorVal)
                            }

                            database.connection.query(
                                'INSERT INTO Accessory SET ?',
                                entry,
                                function (error, results) {
                                    if (error) throw error
                                    resultsList.push(results)
                                }
                            )
                        } catch (error) {
                            console.log(error)
                            return res.render('error.ejs', {
                                status: 500,
                                error: error,
                            })
                        }
                    })
                    return res.render('status.ejs', {
                        action: 'create',
                        object: 'Accessory',
                    })
                })
        } else {
            res.send('No file uploaded !!')
        }
    })

    return router
}

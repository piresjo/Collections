import express from 'express'
import fs from 'fs'
import csv from 'fast-csv'
import {
    DERIVE_REGION,
    DERIVE_CONSOLE_TYPE,
    VALIDATE_CONSOLE_ENTRY_JSON,
    DERIVE_PRODUCT_CONDITION,
    VALIDATE_GAME_ENTRY_JSON,
    VALIDATE_ACCESSORY_ENTRY_JSON,
    DERIVE_ACCESSORY_TYPE,
    DERIVE_CONSOLE_TYPE_STRING,
    DERIVE_REGION_STRING,
    DERIVE_CONDITION_STRING,
    CONSOLE_DOES_NOT_EXIST,
    VALIDATE_CONSOLE_ENTRY_ARRAY,
    VALIDATE_GAME_ENTRY_ARRAY,
    VALIDATE_ACCESSORY_ENTRY_ARRAY,
} from '../constants.js'
import { body } from 'express-validator'

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

export const getHomePage = function (req, res) {
    res.render('index.ejs')
}

export const getAllConsolesSite = (database) => async (req, res) => {
    try {
        const consoles = await database.getConsoles()

        for (let i = 0; i < consoles.length; i++) {
            consoles[i].console_type_string = DERIVE_CONSOLE_TYPE_STRING(
                consoles[i].console_type
            )
            consoles[i].region_string = DERIVE_REGION_STRING(consoles[i].region)
            consoles[i].condition_string = DERIVE_CONDITION_STRING(
                consoles[i].product_condition
            )
        }
        return res.render('consoles.ejs', { consoles: consoles })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getConsoleInformationSite = (database) => async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const consoleInfo = await database.getConsoleInformation(id)

        if (consoleInfo.length === 0) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Console',
                idVal: id,
            })
        }
        consoleInfo[0].console_type_string = DERIVE_CONSOLE_TYPE_STRING(
            consoleInfo[0].console_type
        )
        consoleInfo[0].region_string = DERIVE_REGION_STRING(
            consoleInfo[0].region
        )
        consoleInfo[0].condition_string = DERIVE_CONDITION_STRING(
            consoleInfo[0].product_condition
        )
        return res.render('console.ejs', {
            consoles: consoleInfo,
            id,
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAddConsolePage = async (req, res) => {
    return res.render('addEditConsole.ejs', { action: 'add' })
}

export const addConsoleSite = (database) => async (req, res) => {
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
                bodyVal.monetaryValue != null && bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }

        await database.addConsole(entry)

        return res.render('status.ejs', {
            action: 'create',
            object: 'Console',
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getEditConsolePage = (database) => async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const readResponse = await database.getConsoleInformation(id)

        if (readResponse.length === 0) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Console',
                idVal: id,
            })
        }

        return res.render('addEditConsole.ejs', {
            console: readResponse[0],
            action: 'edit',
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const editConsoleSite = (database) => async (req, res) => {
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
                bodyVal.monetaryValue != null && bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }

        const editResponse = await database.updateConsole(id, entry)

        if (editResponse === null) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Console',
                idVal: id,
            })
        }

        return res.render('status.ejs', {
            action: 'update',
            object: 'Console',
            idVal: id,
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const deleteConsoleSite = (database) => async (req, res) => {
    const id = parseInt(req.body.id)

    try {
        const deleteResponse = await database.deleteConsole(id)

        if (deleteResponse === null) {
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
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAllGamesSite = (database) => async (req, res) => {
    try {
        const games = await database.getGames()

        for (let i = 0; i < games.length; i++) {
            games[i].region_string = DERIVE_REGION_STRING(games[i].region)
            games[i].condition_string = DERIVE_CONDITION_STRING(
                games[i].product_condition
            )
        }
        return res.render('games.ejs', { games: games })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getGameInformationSite = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const game = await database.getGameInformation(id)

        if (game.length === 0) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Game',
                idVal: id,
            })
        }

        game[0].region_string = DERIVE_REGION_STRING(game[0].region)
        game[0].condition_string = DERIVE_CONDITION_STRING(
            game[0].product_condition
        )
        return res.render('game.ejs', {
            games: game,
            id,
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAddGamePage = async (req, res) => {
    return res.render('addEditGame.ejs', { action: 'add' })
}

export const addGameSite = (database) => async (req, res) => {
    const bodyVal = req.body

    try {
        if (!(await database.consoleExists(bodyVal.consoleId))) {
            return res.status(400).render('error.ejs', {
                status: 400,
                error: CONSOLE_DOES_NOT_EXIST.message,
            })
        }
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
                bodyVal.monetaryValue != null && bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }

        await database.addGame(entry)

        return res.render('status.ejs', {
            action: 'create',
            object: 'Game',
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const deleteGameSite = (database) => async (req, res) => {
    const id = parseInt(req.body.id)
    try {
        const deleteResponse = await database.deleteGame(id)

        if (deleteResponse === null) {
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
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getEditGamePage = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const readResponse = await database.getGameInformation(id)

        if (readResponse.length === 0) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Game',
                idVal: id,
            })
        }

        return res.render('addEditGame.ejs', {
            game: readResponse[0],
            action: 'edit',
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const editGameSite = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)

    try {
        if (!(await database.consoleExists(bodyVal.consoleId))) {
            return res.status(400).render('error.ejs', {
                status: 400,
                error: CONSOLE_DOES_NOT_EXIST.message,
            })
        }
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
                bodyVal.monetaryValue != null && bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: bodyVal.notes !== '' ? bodyVal.notes : null,
        }

        const updateResponse = await database.updateGame(id, entry)

        if (updateResponse === null) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Game',
                idVal: id,
            })
        }

        return res.render('status.ejs', {
            action: 'update',
            object: 'Game',
            idVal: id,
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAllAccessoriesSite = (database) => async (req, res) => {
    try {
        const accessories = await database.getAccessories()

        return res.render('accessories.ejs', { accessories: accessories })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAccessoryInformationSite = (database) => async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const accessory = await database.getAccessoryInformation(id)

        if (accessory.length === 0) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Accessory',
                idVal: id,
            })
        }
        return res.render('accessory.ejs', {
            accessories: accessory,
            id,
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getAddAccessoryPage = async (req, res) => {
    return res.render('addEditAccessory.ejs', { action: 'add' })
}

export const addAccessorySite = (database) => async (req, res) => {
    const bodyVal = req.body

    try {
        if (!(await database.consoleExists(bodyVal.consoleId))) {
            return res.status(400).render('error.ejs', {
                status: 400,
                error: CONSOLE_DOES_NOT_EXIST.message,
            })
        }
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
                bodyVal.monetaryValue != null && bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: 'notes' in bodyVal ? bodyVal.notes : null,
        }

        await database.addAccessory(entry)

        return res.render('status.ejs', {
            action: 'create',
            object: 'Accessory',
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const deleteAccessorySite = (database) => async (req, res) => {
    const id = parseInt(req.body.id)
    try {
        const deleteResponse = await database.deleteAccessory(id)

        if (deleteResponse === null) {
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
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getEditAccessoryPage = (database) => async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const readResponse = await database.getAccessoryInformation(id)

        if (readResponse.length === 0) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Accessory',
                idVal: id,
            })
        }

        return res.render('addEditAccessory.ejs', {
            accessory: readResponse[0],
            action: 'edit',
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const editAccessorySite = (database) => async (req, res) => {
    const bodyVal = req.body
    const id = parseInt(req.params.id)

    try {
        if (!(await database.consoleExists(bodyVal.consoleId))) {
            return res.status(400).render('error.ejs', {
                status: 400,
                error: CONSOLE_DOES_NOT_EXIST.message,
            })
        }
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
                bodyVal.monetaryValue != null && bodyVal.monetaryValue !== ''
                    ? Number(bodyVal.monetaryValue)
                    : null,
            notes: bodyVal.notes !== '' ? bodyVal.notes : null,
        }

        const editResponse = await database.updateAccessory(id, entry)

        if (editResponse === null) {
            return res.render('error.ejs', {
                status: 404,
                object: 'Accessory',
                idVal: id,
            })
        }

        return res.render('status.ejs', {
            action: 'update',
            object: 'Accessory',
            idVal: id,
        })
    } catch (error) {
        console.log(error)
        return res.render('error.ejs', { status: 500, error: error })
    }
}

export const getBulkEntryConsolePage = async (req, res) => {
    res.render('bulkentry.ejs', { object: 'Console' })
}

export const bulkEntryConsoles = (database) => async (req, res) => {
    if (req.files && Object.keys(req.files).length !== 0) {
        const uploadedFile = req.files.uploadFile
        const uploadPath = uploadedFile.tempFilePath
        const consoleList = []
        const entriesToAdd = []
        const errors = []

        fs.createReadStream(uploadPath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
                console.error(error)
                return res
                    .status(500)
                    .json({ success: false, message: error.message })
            })
            .on('data', (row) => {
                consoleList.push(row)
            })
            .on('end', async (rowCount) => {
                try {
                    console.log(`Parsed ${rowCount} rows`)

                    consoleList.forEach((consoleToAdd) => {
                        let entryArray = null
                        let errorVal = null

                        try {
                            entryArray = [
                                consoleToAdd.Name === ''
                                    ? null
                                    : consoleToAdd.Name,
                                DERIVE_CONSOLE_TYPE(
                                    consoleToAdd['Console Type'].toLowerCase()
                                ),
                                consoleToAdd.Model === ''
                                    ? null
                                    : consoleToAdd.Model,
                                DERIVE_REGION(
                                    consoleToAdd.Region.toUpperCase()
                                ),

                                consoleToAdd['Release Date'] === ''
                                    ? null
                                    : consoleToAdd['Release Date'],
                                consoleToAdd['Bought Date'] === ''
                                    ? null
                                    : consoleToAdd['Bought Date'],
                                consoleToAdd.Company === ''
                                    ? null
                                    : consoleToAdd.Company,
                                DERIVE_PRODUCT_CONDITION(
                                    consoleToAdd[
                                        'Product Condition'
                                    ].toLowerCase()
                                ),

                                consoleToAdd['Has Packaging'].toLowerCase() ===
                                    'yes',

                                consoleToAdd['Is Duplicate'].toLowerCase() ===
                                    'yes',

                                consoleToAdd['Has Cables'].toLowerCase() ===
                                    'yes',

                                consoleToAdd['Has Console'].toLowerCase() ===
                                    'yes',

                                consoleToAdd['Monetary Value'] === ''
                                    ? null
                                    : parseFloat(
                                          consoleToAdd['Monetary Value']
                                              .trim()
                                              .slice(1)
                                      ),
                                consoleToAdd.Notes,
                            ]
                        } catch (error) {
                            console.error(error)
                            errorVal = {
                                success: false,
                                message: error.message,
                            }
                        }

                        if (errorVal === null) {
                            errorVal = VALIDATE_CONSOLE_ENTRY_ARRAY(entryArray)
                        }

                        if (errorVal != null) {
                            errors.push(errorVal)
                        } else {
                            entriesToAdd.push(entryArray)
                        }
                    })
                    if (errors.length > 0) {
                        return res.status(400).json(errors)
                    }
                    if (entriesToAdd.length === 0) {
                        return res.status(400).json({
                            message: 'no entries in csv',
                        })
                    }
                    try {
                        await database.bulkConsoleEntry(entriesToAdd)
                    } catch (error) {
                        console.error(error)
                        return res
                            .status(500)
                            .json({ success: false, message: error.message })
                    }

                    // ToDo - Update
                    return res.render('status.ejs', {
                        action: 'create',
                        object: 'Console',
                    })
                } finally {
                    try {
                        await fs.promises.unlink(uploadPath)
                    } catch (unlinkError) {
                        console.error(unlinkError)
                    }
                }
            })
    } else {
        return res.status(400).json({
            message: 'no file uploaded',
        })
    }
}

export const getBulkEntryGamePage = async (req, res) => {
    res.render('bulkentry.ejs', { object: 'Game' })
}

export const bulkEntryGames = (database) => async (req, res) => {
    if (req.files && Object.keys(req.files).length !== 0) {
        const uploadedFile = req.files.uploadFile
        const uploadPath = uploadedFile.tempFilePath
        const gameList = []
        const entriesToAdd = []
        const errors = []

        fs.createReadStream(uploadPath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
                console.error(error)
                return res
                    .status(500)
                    .json({ success: false, message: error.message })
            })
            .on('data', (row) => {
                gameList.push(row)
            })
            .on('end', async (rowCount) => {
                try {
                    console.log(`Parsed ${rowCount} rows`)
                    let consoleIDMap = null
                    try {
                        consoleIDMap =
                            await database.mapConsoleNameToConsoleIds()
                    } catch (error) {
                        console.error(error)
                        return res
                            .status(500)
                            .json({ success: false, message: error.message })
                    }
                    gameList.forEach((game) => {
                        let entryArray = null
                        let errorVal = null
                        try {
                            entryArray = [
                                consoleIDMap[game.Console.toLowerCase()],
                                game.Name === '' ? null : game.Name,
                                game.Edition === '' ? null : game.Edition,
                                game['Release Date'] === ''
                                    ? null
                                    : new Date(game['Release Date'])
                                          .toISOString()
                                          .split('T')[0],
                                game['Bought Date'] === ''
                                    ? null
                                    : new Date(game['Bought Date'])
                                          .toISOString()
                                          .split('T')[0],
                                DERIVE_REGION(game.Region.toUpperCase()),
                                game.Developer === '' ? null : game.Developer,
                                game.Publisher === '' ? null : game.Publisher,
                                game.Digital.toLowerCase() === 'yes',

                                game['Has Game'].toLowerCase() === 'yes',
                                game['Has Manual'].toLowerCase() === 'yes',
                                game['Has Box'].toLowerCase() === 'yes',
                                game['Is Duplicate'].toLowerCase() === 'yes',
                                DERIVE_PRODUCT_CONDITION(
                                    game['Product Condition'].toLowerCase()
                                ),
                                game['Monetary Value'] === ''
                                    ? null
                                    : parseFloat(
                                          game['Monetary Value'].trim().slice(1)
                                      ),
                                game.Notes,
                            ]
                        } catch (error) {
                            console.error(error)
                            errorVal = {
                                success: false,
                                message: error.message,
                            }
                        }

                        if (errorVal === null) {
                            errorVal = VALIDATE_GAME_ENTRY_ARRAY(entryArray)
                        }

                        if (errorVal != null) {
                            errors.push(errorVal)
                        } else {
                            entriesToAdd.push(entryArray)
                        }
                    })
                    if (errors.length > 0) {
                        return res.status(400).json(errors)
                    }
                    if (entriesToAdd.length === 0) {
                        return res.status(400).json({
                            message: 'no entries in csv',
                        })
                    }
                    try {
                        await database.bulkGameEntry(entriesToAdd)
                    } catch (error) {
                        console.error(error)
                        return res
                            .status(500)
                            .json({ success: false, message: error.message })
                    }
                    return res.render('status.ejs', {
                        action: 'create',
                        object: 'Game',
                    })
                } finally {
                    try {
                        await fs.promises.unlink(uploadPath)
                    } catch (unlinkError) {
                        console.error(unlinkError)
                    }
                }
            })
    } else {
        return res.status(400).json({
            message: 'no file uploaded',
        })
    }
}

export const getBulkEntryAccessoryPage = async (req, res) => {
    res.render('bulkentry.ejs', { object: 'Accessory' })
}

export const bulkEntryAccessories = (database) => async (req, res) => {
    if (req.files && Object.keys(req.files).length !== 0) {
        const uploadedFile = req.files.uploadFile
        const uploadPath = uploadedFile.tempFilePath
        const accessoryList = []
        const entriesToAdd = []
        const errors = []

        fs.createReadStream(uploadPath)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error) => {
                console.error(error)
                return res
                    .status(500)
                    .json({ success: false, message: error.message })
            })
            .on('data', (row) => {
                accessoryList.push(row)
            })
            .on('end', async (rowCount) => {
                try {
                    console.log(`Parsed ${rowCount} rows`)

                    let consoleIDMap = null
                    try {
                        consoleIDMap =
                            await database.mapConsoleNameToConsoleIds()
                    } catch (error) {
                        console.error(error)
                        return res
                            .status(500)
                            .json({ success: false, message: error.message })
                    }

                    accessoryList.forEach((accessory) => {
                        let entryArray = null
                        let errorVal = null
                        try {
                            entryArray = [
                                consoleIDMap[accessory.Console.toLowerCase()],
                                accessory.Name === '' ? null : accessory.Name,
                                accessory.Model === '' ? null : accessory.Model,
                                DERIVE_ACCESSORY_TYPE(
                                    accessory['Accessory Type'].toLowerCase()
                                ),

                                accessory['Release Date'] === ''
                                    ? null
                                    : new Date(accessory['Release Date'])
                                          .toISOString()
                                          .split('T')[0],

                                accessory['Bought Date'] === ''
                                    ? null
                                    : new Date(accessory['Bought Date'])
                                          .toISOString()
                                          .split('T')[0],

                                accessory.Company === ''
                                    ? null
                                    : accessory.Company,
                                DERIVE_PRODUCT_CONDITION(
                                    accessory['Product Condition'].toLowerCase()
                                ),

                                accessory['Has Packaging'].toLowerCase() ===
                                    'yes',

                                accessory['Monetary Value'] === ''
                                    ? null
                                    : parseFloat(
                                          accessory['Monetary Value']
                                              .trim()
                                              .slice(1)
                                      ),
                                accessory.Notes,
                            ]
                        } catch (error) {
                            console.error(error)
                            errorVal = {
                                success: false,
                                message: error.message,
                            }
                        }

                        if (errorVal === null) {
                            errorVal =
                                VALIDATE_ACCESSORY_ENTRY_ARRAY(entryArray)
                        }

                        if (errorVal != null) {
                            errors.push(errorVal)
                        } else {
                            entriesToAdd.push(entryArray)
                        }
                    })
                    if (errors.length > 0) {
                        return res.status(400).json(errors)
                    }
                    if (entriesToAdd.length === 0) {
                        return res.status(400).json({
                            message: 'no entries in csv',
                        })
                    }
                    try {
                        await database.bulkAccessoryEntry(entriesToAdd)
                    } catch (error) {
                        console.error(error)
                        return res
                            .status(500)
                            .json({ success: false, message: error.message })
                    }
                    return res.render('status.ejs', {
                        action: 'create',
                        object: 'Accessory',
                    })
                } finally {
                    try {
                        await fs.promises.unlink(uploadPath)
                    } catch (unlinkError) {
                        console.error(unlinkError)
                    }
                }
            })
    } else {
        return res.status(400).json({
            message: 'no file uploaded',
        })
    }
}

export default function makeSiteRouter(database) {
    const router = express.Router()

    router.get('/', getHomePage)
    router.get('/consoles', getAllConsolesSite(database))
    router.get('/consoles/:id', getConsoleInformationSite(database))
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
        addConsoleSite(database)
    )
    router.post('/deleteConsole', deleteConsoleSite(database))
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
        editConsoleSite(database)
    )
    router.get('/games', getAllGamesSite(database))
    router.get('/games/:id', getGameInformationSite(database))
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
        addGameSite(database)
    )
    router.post('/deleteGame', deleteGameSite(database))
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
        editGameSite(database)
    )
    router.get('/accessories', getAllAccessoriesSite(database))
    router.get('/accessories/:id', getAccessoryInformationSite(database))
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
        addAccessorySite(database)
    )
    router.post('/deleteAccessory', deleteAccessorySite(database))
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
        editAccessorySite(database)
    )
    router.get('/bulk_entry/consoles', getBulkEntryConsolePage)
    router.post('/bulk_entry/consoles', bulkEntryConsoles(database))
    router.get('/bulk_entry/games', getBulkEntryGamePage)
    router.post('/bulk_entry/games', bulkEntryGames(database))
    router.get('/bulk_entry/accessories', getBulkEntryAccessoryPage)
    router.post('/bulk_entry/accessories', bulkEntryAccessories(database))

    return router
}

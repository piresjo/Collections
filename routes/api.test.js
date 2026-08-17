import { describe, expect, test, vi } from 'vitest'
import { getMockReq, getMockRes } from 'vitest-mock-express'
import {
    addAccessory,
    addConsole,
    addGame,
    deleteAccessory,
    deleteConsole,
    deleteGame,
    getAccessoryInformation,
    getAllAccessories,
    getAllConsoles,
    getAllGames,
    getConsoleInformation,
    getGameInformation,
    getHealthCheck,
    updateAccessory,
    updateConsole,
    updateGame,
} from './api.js'
import {
    ACCESSORY_INFO_RESPONSE,
    ALL_ACCESSORIES_RESPONSE,
    ALL_CONSOLES_RESPONSE,
    ALL_GAMES_RESPONSE,
    CONSOLE_INFO_RESPONSE,
    CREATE_RESPONSE,
    DELETE_RESPONSE,
    FULL_ACCESSORY_ENTRY,
    FULL_CONSOLE_ENTRY,
    FULL_GAME_ENTRY,
    GAME_INFO_RESPONSE,
    INVALID_ACCESSORY_ENTRY,
    INVALID_CONSOLE_ENTRY,
    INVALID_GAME_ENTRY,
    UPDATE_RESPONSE,
} from '../database.test.data.js'
import {
    GENERATE_500_ERROR_JSON,
    GENERATE_CREATED_JSON,
    GENERATE_DELETE_JSON,
    GENERATE_GET_JSON,
    GENERATE_GET_NOT_FOUND_JSON,
    GENERATE_UPDATE_JSON,
    GENERATE_UPDATE_DELETE_NOT_FOUND_JSON,
    CONSOLE_DOES_NOT_EXIST,
} from '../constants.js'

const DB_ERROR_CONNECTION_LOST = 'Connection Lost'
const DB_ERROR = new Error(DB_ERROR_CONNECTION_LOST)

const MISSING_CONSOLE_NAME_ERROR = {
    message: 'Console Needs To Have A Name',
    success: false,
}

const MISSING_CONSOLE_ID_ERROR = {
    message: 'console_id Must Be Defined',
    success: false,
}

describe('Healthcheck API Call', () => {
    test('happy path', async () => {
        const req = getMockReq()
        const { res } = getMockRes()

        await getHealthCheck(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ success: true })
    })
})

describe('Get All Consoles API Call', () => {
    test('happy path', async () => {
        const database = {
            getConsoles: vi.fn(),
        }
        database.getConsoles.mockResolvedValue(ALL_CONSOLES_RESPONSE)

        const handler = getAllConsoles(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoles).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ALL_CONSOLES_RESPONSE)
        )
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getConsoles: vi.fn(),
        }
        database.getConsoles.mockRejectedValueOnce(DB_ERROR)

        const handler = getAllConsoles(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })
})

describe('Get Console Info API Call', () => {
    test('happy path', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockResolvedValue(CONSOLE_INFO_RESPONSE)

        const handler = getConsoleInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoleInformation).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(CONSOLE_INFO_RESPONSE)
        )
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getConsoleInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Console Not Found', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockResolvedValue([])

        const handler = getConsoleInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoleInformation).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_NOT_FOUND_JSON('Console')
        )
    })
})

describe('Add Console API Call', () => {
    test('happy path', async () => {
        const database = {
            addConsole: vi.fn(),
        }
        database.addConsole.mockResolvedValue(CREATE_RESPONSE)

        const handler = addConsole(database)
        const req = getMockReq({
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addConsole).toHaveBeenCalledWith(FULL_CONSOLE_ENTRY)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_CREATED_JSON('Console', CREATE_RESPONSE)
        )
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            addConsole: vi.fn(),
        }
        database.addConsole.mockRejectedValueOnce(DB_ERROR)

        const handler = addConsole(database)
        const req = getMockReq({
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Invalid Input', async () => {
        const database = {
            addConsole: vi.fn(),
        }
        database.addConsole.mockResolvedValue(CREATE_RESPONSE)

        const handler = addConsole(database)
        const req = getMockReq({
            body: INVALID_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(MISSING_CONSOLE_NAME_ERROR)
    })
})

describe('Update Console API Call', () => {
    test('happy path', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockResolvedValue(UPDATE_RESPONSE)

        const handler = updateConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateConsole).toHaveBeenCalledWith(
            1,
            FULL_CONSOLE_ENTRY
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_JSON('Console', 1, UPDATE_RESPONSE)
        )
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockRejectedValueOnce(DB_ERROR)

        const handler = updateConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Invalid Input', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockResolvedValue(UPDATE_RESPONSE)

        const handler = updateConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: INVALID_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(MISSING_CONSOLE_NAME_ERROR)
    })

    test('Console Not Found', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockResolvedValue(null)

        const handler = updateConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateConsole).toHaveBeenCalledWith(
            1,
            FULL_CONSOLE_ENTRY
        )

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Console', 1, true)
        )
    })
})

describe('Delete Console API Call', () => {
    test('happy path', async () => {
        const database = {
            deleteConsole: vi.fn(),
        }
        database.deleteConsole.mockResolvedValue(DELETE_RESPONSE)

        const handler = deleteConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteConsole).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_DELETE_JSON('Console', 1, DELETE_RESPONSE)
        )
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            deleteConsole: vi.fn(),
        }
        database.deleteConsole.mockRejectedValueOnce(DB_ERROR)

        const handler = deleteConsole(database)
        const req = getMockReq({
            id: '1',
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Console Not Found', async () => {
        const database = {
            deleteConsole: vi.fn(),
        }
        database.deleteConsole.mockResolvedValue(null)

        const handler = deleteConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteConsole).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Console', 1, false)
        )
    })
})

describe('Get All Games API Call', () => {
    test('happy path', async () => {
        const database = {
            getGames: vi.fn(),
        }
        database.getGames.mockResolvedValue(ALL_GAMES_RESPONSE)

        const handler = getAllGames(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGames).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ALL_GAMES_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            getGames: vi.fn(),
        }
        database.getGames.mockRejectedValueOnce(DB_ERROR)

        const handler = getAllGames(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })
})

describe('Get Game Info API Call', () => {
    test('happy path', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockResolvedValue(GAME_INFO_RESPONSE)

        const handler = getGameInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGameInformation).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(GAME_INFO_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getGameInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Game Not Found', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockResolvedValue([])

        const handler = getGameInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGameInformation).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_NOT_FOUND_JSON('Game')
        )
    })
})

describe('Add Game API Call', () => {
    test('happy path', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = addGame(database)
        const req = getMockReq({
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addGame).toHaveBeenCalledWith(FULL_GAME_ENTRY)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_CREATED_JSON('Game', CREATE_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = addGame(database)
        const req = getMockReq({
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Invalid Input', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = addGame(database)
        const req = getMockReq({
            body: INVALID_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(MISSING_CONSOLE_ID_ERROR)
    })

    test('Console Does Not Exist', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = addGame(database)
        const req = getMockReq({
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addGame).toHaveBeenCalledTimes(0)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(CONSOLE_DOES_NOT_EXIST)
    })
})

describe('Update Game API Call', () => {
    test('happy path', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateGame).toHaveBeenCalledWith(1, FULL_GAME_ENTRY)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_JSON('Game', 1, UPDATE_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Invalid Input', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: INVALID_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(MISSING_CONSOLE_ID_ERROR)
    })

    test('Game Not Found', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(null)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateGame).toHaveBeenCalledWith(1, FULL_GAME_ENTRY)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Game', 1, true)
        )
    })

    test('Console Does Not Exist', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = updateGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateGame).toHaveBeenCalledTimes(0)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(CONSOLE_DOES_NOT_EXIST)
    })
})

describe('Delete Game API Call', () => {
    test('happy path', async () => {
        const database = {
            deleteGame: vi.fn(),
        }
        database.deleteGame.mockResolvedValue(DELETE_RESPONSE)

        const handler = deleteGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteGame).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_DELETE_JSON('Game', 1, DELETE_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            deleteGame: vi.fn(),
        }
        database.deleteGame.mockRejectedValueOnce(DB_ERROR)

        const handler = deleteGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Game Not Found', async () => {
        const database = {
            deleteGame: vi.fn(),
        }
        database.deleteGame.mockResolvedValue(null)

        const handler = deleteGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteGame).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Game', 1, false)
        )
    })
})

describe('Get All Accessories API Call', () => {
    test('happy path', async () => {
        const database = {
            getAccessories: vi.fn(),
        }
        database.getAccessories.mockResolvedValue(ALL_ACCESSORIES_RESPONSE)

        const handler = getAllAccessories(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessories).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ALL_ACCESSORIES_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            getAccessories: vi.fn(),
        }
        database.getAccessories.mockRejectedValueOnce(DB_ERROR)

        const handler = getAllAccessories(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })
})

describe('Get Accessory Info API Call', () => {
    test('happy path', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockResolvedValue(
            ACCESSORY_INFO_RESPONSE
        )

        const handler = getAccessoryInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessoryInformation).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ACCESSORY_INFO_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getAccessoryInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Accessory Not Found', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockResolvedValue([])

        const handler = getAccessoryInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessoryInformation).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_NOT_FOUND_JSON('Accessory')
        )
    })
})

describe('Add Accessory API Call', () => {
    test('happy path', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = addAccessory(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addAccessory).toHaveBeenCalledWith(FULL_ACCESSORY_ENTRY)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_CREATED_JSON('Accessory', CREATE_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = addAccessory(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Invalid Input', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = addAccessory(database)
        const req = getMockReq({
            body: INVALID_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(MISSING_CONSOLE_ID_ERROR)
    })

    test('Console Does Not Exist', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = addAccessory(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addAccessory).toHaveBeenCalledTimes(0)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(CONSOLE_DOES_NOT_EXIST)
    })
})

describe('Update Accessory API Call', () => {
    test('happy path', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateAccessory).toHaveBeenCalledWith(
            1,
            FULL_ACCESSORY_ENTRY
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_JSON('Accessory', 1, UPDATE_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Invalid Input', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: INVALID_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(MISSING_CONSOLE_ID_ERROR)
    })

    test('Accessory Not Found', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(null)
        database.consoleExists.mockResolvedValue(true)

        const handler = updateAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateAccessory).toHaveBeenCalledWith(
            1,
            FULL_ACCESSORY_ENTRY
        )

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Accessory', 1, true)
        )
    })

    test('Console Does Not Exist', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = updateAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateAccessory).toHaveBeenCalledTimes(0)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(CONSOLE_DOES_NOT_EXIST)
    })
})

describe('Delete Accessory API Call', () => {
    test('happy path', async () => {
        const database = {
            deleteAccessory: vi.fn(),
        }
        database.deleteAccessory.mockResolvedValue(DELETE_RESPONSE)

        const handler = deleteAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteAccessory).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_DELETE_JSON('Accessory', 1, DELETE_RESPONSE)
        )
    })

    test('5XX Error', async () => {
        const database = {
            deleteAccessory: vi.fn(),
        }
        database.deleteAccessory.mockRejectedValueOnce(DB_ERROR)

        const handler = deleteAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(GENERATE_500_ERROR_JSON(DB_ERROR))
    })

    test('Accessory Not Found', async () => {
        const database = {
            deleteAccessory: vi.fn(),
        }
        database.deleteAccessory.mockResolvedValue(null)

        const handler = deleteAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteAccessory).toHaveBeenCalledWith(1)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_DELETE_NOT_FOUND_JSON('Accessory', 1, false)
        )
    })
})

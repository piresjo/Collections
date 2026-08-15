import { beforeAll, describe, expect, test, vi } from 'vitest'
import { getMockReq, getMockRes } from 'vitest-mock-express'
import makeApiRouter, {
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
    UPDATE_RESPONSE,
} from '../database.test.data.js'
import {
    GENERATE_CREATED_JSON,
    GENERATE_DELETE_JSON,
    GENERATE_GET_JSON,
    GENERATE_UPDATE_JSON,
} from '../constants.js'

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
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ALL_CONSOLES_RESPONSE)
        })

        const handler = getAllConsoles(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ALL_CONSOLES_RESPONSE)
        )
    })
})

describe('Get Console Info API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, CONSOLE_INFO_RESPONSE)
        })

        const handler = getConsoleInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console WHERE id=1',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(CONSOLE_INFO_RESPONSE)
        )
    })
})

describe('Add Console API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const handler = addConsole(database)
        const req = getMockReq({
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Console SET ?',
            FULL_CONSOLE_ENTRY,
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_CREATED_JSON('Console', CREATE_RESPONSE)
        )
    })
})

describe('Update Console API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, UPDATE_RESPONSE)
            }
        )

        const handler = updateConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_CONSOLE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Console SET ? WHERE id=1',
            FULL_CONSOLE_ENTRY,
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_JSON('Console', 1, UPDATE_RESPONSE)
        )
    })
})

describe('Delete Console API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, DELETE_RESPONSE)
        })

        const handler = deleteConsole(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Console WHERE id=1',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_DELETE_JSON('Console', 1, DELETE_RESPONSE)
        )
    })
})

describe('Get All Games API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ALL_GAMES_RESPONSE)
        })

        const handler = getAllGames(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ALL_GAMES_RESPONSE)
        )
    })
})

describe('Get Game Info API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, GAME_INFO_RESPONSE)
        })

        const handler = getGameInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game WHERE id=1',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(GAME_INFO_RESPONSE)
        )
    })
})

describe('Add Game API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const handler = addGame(database)
        const req = getMockReq({
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Game SET ?',
            FULL_GAME_ENTRY,
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_CREATED_JSON('Game', CREATE_RESPONSE)
        )
    })
})

describe('Update Game API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, UPDATE_RESPONSE)
            }
        )

        const handler = updateGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Game SET ? WHERE id=1',
            FULL_GAME_ENTRY,
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_JSON('Game', 1, UPDATE_RESPONSE)
        )
    })
})

describe('Delete Game API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, DELETE_RESPONSE)
        })

        const handler = deleteGame(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Game WHERE id=1',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_DELETE_JSON('Game', 1, DELETE_RESPONSE)
        )
    })
})

describe('Get All Accessories API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ALL_ACCESSORIES_RESPONSE)
        })

        const handler = getAllAccessories(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ALL_ACCESSORIES_RESPONSE)
        )
    })
})

describe('Get Accessory Info API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ACCESSORY_INFO_RESPONSE)
        })

        const handler = getAccessoryInformation(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_GET_JSON(ACCESSORY_INFO_RESPONSE)
        )
    })
})

describe('Add Accessory API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const handler = addAccessory(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Accessory SET ?',
            FULL_ACCESSORY_ENTRY,
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_CREATED_JSON('Accessory', CREATE_RESPONSE)
        )
    })
})

describe('Update Accessory API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, UPDATE_RESPONSE)
            }
        )

        const handler = updateAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Accessory SET ? WHERE id=1',
            FULL_ACCESSORY_ENTRY,
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_UPDATE_JSON('Accessory', 1, UPDATE_RESPONSE)
        )
    })
})

describe('Delete Accessory API Call', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, DELETE_RESPONSE)
        })

        const handler = deleteAccessory(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            GENERATE_DELETE_JSON('Accessory', 1, DELETE_RESPONSE)
        )
    })
})

import { beforeAll, describe, expect, test, vi } from 'vitest'
import { getMockReq, getMockRes } from 'vitest-mock-express'
import {
    getHomePage,
    getAllConsoles,
    getConsoleInformation,
    getAddConsolePage,
    addConsole,
    getEditConsolePage,
    editConsole,
    deleteConsole,
    getAllGames,
    getGameInformation,
    getAddGamePage,
    addGame,
    editGame,
    deleteGame,
    getEditGamePage,
    getAllAccessories,
    getAccessoryInformation,
    getAddAccessoryPage,
    getEditAccessoryPage,
    addAccessory,
    editAccessory,
    deleteAccessory,
} from './index.js'
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
    DERIVE_CONSOLE_TYPE_STRING,
    DERIVE_REGION_STRING,
    DERIVE_CONDITION_STRING,
} from '../constants.js'
import {
    FULL_ACCESSORY_SITE_ENTRY,
    FULL_CONSOLE_SITE_ENTRY,
    FULL_CONSOLE_SITE_ENTRY_EDIT,
    FULL_GAME_SITE_ENTRY,
} from './index.test.data.js'

describe('Index Page Test', () => {
    test('Happy Path', async () => {
        const req = getMockReq()
        const { res } = getMockRes()

        await getHomePage(req, res)

        expect(res.render).toHaveBeenCalledWith('index.ejs')
    })
})

describe('Get All Consoles Page Test', () => {
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

        const expectedConsoles = ALL_CONSOLES_RESPONSE.map((console) => ({
            ...console,
            console_type_string: DERIVE_CONSOLE_TYPE_STRING(
                console.console_type
            ),
            region_string: DERIVE_REGION_STRING(console.region),
            condition_string: DERIVE_CONDITION_STRING(
                console.product_condition
            ),
        }))

        expect(res.render).toHaveBeenCalledWith('consoles.ejs', {
            consoles: expectedConsoles,
        })
    })
})

describe('Get Console Information Page Test', () => {
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
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console WHERE id=1',
            expect.any(Function)
        )

        const expectedConsoles = CONSOLE_INFO_RESPONSE.map((console) => ({
            ...console,
            console_type_string: DERIVE_CONSOLE_TYPE_STRING(
                console.console_type
            ),
            region_string: DERIVE_REGION_STRING(console.region),
            condition_string: DERIVE_CONDITION_STRING(
                console.product_condition
            ),
        }))

        expect(res.render).toHaveBeenCalledWith('console.ejs', {
            consoles: expectedConsoles,
            id: 1,
        })
    })
})

describe('Add Console Page Test', () => {
    test('Happy Path', async () => {
        const req = getMockReq()
        const { res } = getMockRes()

        await getAddConsolePage(req, res)

        expect(res.render).toHaveBeenCalledWith('addEditConsole.ejs', {
            action: 'add',
        })
    })
})

describe('Add Console Test', () => {
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
            body: FULL_CONSOLE_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Console SET ?',
            FULL_CONSOLE_ENTRY,
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'create',
            object: 'Console',
        })
    })
})

describe('Get Edit Console Information Page Test', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, CONSOLE_INFO_RESPONSE)
        })

        const handler = getEditConsolePage(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console WHERE id=1',
            expect.any(Function)
        )

        const expectedConsoles = CONSOLE_INFO_RESPONSE.map((console) => ({
            ...console,
            console_type_string: DERIVE_CONSOLE_TYPE_STRING(
                console.console_type
            ),
            region_string: DERIVE_REGION_STRING(console.region),
            condition_string: DERIVE_CONDITION_STRING(
                console.product_condition
            ),
        }))

        expect(res.render).toHaveBeenCalledWith('addEditConsole.ejs', {
            console: expectedConsoles[0],
            action: 'edit',
        })
    })
})

describe('Edit Console Test', () => {
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

        const handler = editConsole(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_CONSOLE_SITE_ENTRY_EDIT,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Console SET ? WHERE id=1',
            FULL_CONSOLE_ENTRY,
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'update',
            object: 'Console',
            idVal: 1,
        })
    })
})

describe('Delete Console Test', () => {
    test('Happy Path', async () => {
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
            body: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Console WHERE id=1',
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'delete',
            object: 'Console',
            idVal: 1,
        })
    })
})

describe('Get All Games Page Test', () => {
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

        const expectedGames = ALL_GAMES_RESPONSE.map((game) => ({
            ...game,
            region_string: DERIVE_REGION_STRING(game.region),
            condition_string: DERIVE_CONDITION_STRING(game.product_condition),
        }))

        expect(res.render).toHaveBeenCalledWith('games.ejs', {
            games: expectedGames,
        })
    })
})

describe('Get Game Information Page Test', () => {
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
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game WHERE id=1',
            expect.any(Function)
        )

        const expectedGames = GAME_INFO_RESPONSE.map((game) => ({
            ...game,
            region_string: DERIVE_REGION_STRING(game.region),
            condition_string: DERIVE_CONDITION_STRING(game.product_condition),
        }))

        expect(res.render).toHaveBeenCalledWith('game.ejs', {
            games: expectedGames,
            id: 1,
        })
    })
})

describe('Add Game Page Test', () => {
    test('Happy Path', async () => {
        const req = getMockReq()
        const { res } = getMockRes()

        await getAddGamePage(req, res)

        expect(res.render).toHaveBeenCalledWith('addEditGame.ejs', {
            action: 'add',
        })
    })
})

describe('Add Game Test', () => {
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
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Game SET ?',
            FULL_GAME_ENTRY,
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'create',
            object: 'Game',
        })
    })
})

describe('Get Edit Game Information Page Test', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, GAME_INFO_RESPONSE)
        })

        const handler = getEditGamePage(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game WHERE id=1',
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('addEditGame.ejs', {
            game: GAME_INFO_RESPONSE[0],
            action: 'edit',
        })
    })
})

describe('Edit Game Test', () => {
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

        const handler = editGame(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Game SET ? WHERE id=1',
            FULL_GAME_ENTRY,
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'update',
            object: 'Game',
            idVal: 1,
        })
    })
})

describe('Delete Game Test', () => {
    test('Happy Path', async () => {
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
            body: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Game WHERE id=1',
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'delete',
            object: 'Game',
            idVal: 1,
        })
    })
})

describe('Get All Accessories Page Test', () => {
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

        expect(res.render).toHaveBeenCalledWith('accessories.ejs', {
            accessories: ALL_ACCESSORIES_RESPONSE,
        })
    })
})

describe('Get Accessory Information Page Test', () => {
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
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('accessory.ejs', {
            accessories: ACCESSORY_INFO_RESPONSE,
            id: 1,
        })
    })
})

describe('Add Accessory Page Test', () => {
    test('Happy Path', async () => {
        const req = getMockReq()
        const { res } = getMockRes()

        await getAddAccessoryPage(req, res)

        expect(res.render).toHaveBeenCalledWith('addEditAccessory.ejs', {
            action: 'add',
        })
    })
})

describe('Add Accessory Test', () => {
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
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Accessory SET ?',
            FULL_ACCESSORY_ENTRY,
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'create',
            object: 'Accessory',
        })
    })
})

describe('Get Edit Accessory Information Page Test', () => {
    test('happy path', async () => {
        const database = {
            connection: {
                query: vi.fn(),
            },
        }
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ACCESSORY_INFO_RESPONSE)
        })

        const handler = getEditAccessoryPage(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('addEditAccessory.ejs', {
            accessory: ACCESSORY_INFO_RESPONSE[0],
            action: 'edit',
        })
    })
})

describe('Edit Accessory Test', () => {
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

        const handler = editAccessory(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Accessory SET ? WHERE id=1',
            FULL_ACCESSORY_ENTRY,
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'update',
            object: 'Accessory',
            idVal: 1,
        })
    })
})

describe('Delete Accessory Test', () => {
    test('Happy Path', async () => {
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
            body: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'delete',
            object: 'Accessory',
            idVal: 1,
        })
    })
})

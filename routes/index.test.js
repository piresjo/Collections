import { describe, expect, test, vi } from 'vitest'
import { getMockReq, getMockRes } from 'vitest-mock-express'
import {
    getHomePage,
    getAllConsolesSite,
    getConsoleInformationSite,
    getAddConsolePage,
    addConsoleSite,
    getEditConsolePage,
    editConsoleSite,
    deleteConsoleSite,
    getAllGamesSite,
    getGameInformationSite,
    getAddGamePage,
    addGameSite,
    editGameSite,
    deleteGameSite,
    getEditGamePage,
    getAllAccessoriesSite,
    getAccessoryInformationSite,
    getAddAccessoryPage,
    getEditAccessoryPage,
    addAccessorySite,
    editAccessorySite,
    deleteAccessorySite,
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
    CONSOLE_DOES_NOT_EXIST,
} from '../constants.js'
import {
    FULL_ACCESSORY_SITE_ENTRY,
    FULL_CONSOLE_SITE_ENTRY,
    FULL_CONSOLE_SITE_ENTRY_EDIT,
    FULL_GAME_SITE_ENTRY,
} from './index.test.data.js'

const DB_ERROR_CONNECTION_LOST = 'Connection Lost'
const DB_ERROR = new Error(DB_ERROR_CONNECTION_LOST)

describe('Index Page Test', () => {
    test('Index Page Happy Path', async () => {
        const req = getMockReq()
        const { res } = getMockRes()

        await getHomePage(req, res)

        expect(res.render).toHaveBeenCalledWith('index.ejs')
    })
})

describe('Get All Consoles Page Test', () => {
    test('Get All Consoles Happy Path', async () => {
        const database = {
            getConsoles: vi.fn(),
        }
        database.getConsoles.mockResolvedValue(ALL_CONSOLES_RESPONSE)

        const handler = getAllConsolesSite(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoles).toHaveBeenCalled()

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

    test('Encountered 5XX Error', async () => {
        const database = {
            getConsoles: vi.fn(),
        }
        database.getConsoles.mockRejectedValueOnce(DB_ERROR)

        const handler = getAllConsolesSite(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })
})

describe('Get Console Information Page Test', () => {
    test('Get Console Information Happy Path', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockResolvedValue(CONSOLE_INFO_RESPONSE)

        const handler = getConsoleInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoleInformation).toHaveBeenCalledWith(1)

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

    test('Encountered 5XX Error', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getConsoleInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Console Not Found', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockResolvedValue([])

        const handler = getConsoleInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoleInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Console',
            idVal: 1,
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
    test('Add Console Happy Path', async () => {
        const database = {
            addConsole: vi.fn(),
        }
        database.addConsole.mockResolvedValue(CREATE_RESPONSE)

        const handler = addConsoleSite(database)
        const req = getMockReq({
            body: FULL_CONSOLE_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addConsole).toHaveBeenCalledWith(FULL_CONSOLE_ENTRY)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'create',
            object: 'Console',
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            addConsole: vi.fn(),
        }
        database.addConsole.mockRejectedValueOnce(DB_ERROR)

        const handler = addConsoleSite(database)
        const req = getMockReq({
            body: FULL_CONSOLE_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })
})

describe('Get Edit Console Information Page Test', () => {
    test('Edit Console Info Happy Path', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockResolvedValue(CONSOLE_INFO_RESPONSE)

        const handler = getEditConsolePage(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoleInformation).toHaveBeenCalledWith(1)

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

    test('Encountered 5XX Error', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getEditConsolePage(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Console Not Found', async () => {
        const database = {
            getConsoleInformation: vi.fn(),
        }
        database.getConsoleInformation.mockResolvedValue([])

        const handler = getEditConsolePage(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getConsoleInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Console',
            idVal: 1,
        })
    })
})

describe('Edit Console Test', () => {
    test('Edit Console Happy Path', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockResolvedValue(UPDATE_RESPONSE)

        const handler = editConsoleSite(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_CONSOLE_SITE_ENTRY_EDIT,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateConsole).toHaveBeenLastCalledWith(
            1,
            FULL_CONSOLE_ENTRY
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'update',
            object: 'Console',
            idVal: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockRejectedValueOnce(DB_ERROR)

        const handler = editConsoleSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_CONSOLE_SITE_ENTRY_EDIT,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Console Not Found', async () => {
        const database = {
            updateConsole: vi.fn(),
        }
        database.updateConsole.mockResolvedValue(null)

        const handler = editConsoleSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_CONSOLE_SITE_ENTRY_EDIT,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateConsole).toHaveBeenCalledWith(
            1,
            FULL_CONSOLE_ENTRY
        )

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Console',
            idVal: 1,
        })
    })
})

describe('Delete Console Test', () => {
    test('Delete Console Happy Path', async () => {
        const database = {
            deleteConsole: vi.fn(),
        }
        database.deleteConsole.mockResolvedValueOnce(DELETE_RESPONSE)

        const handler = deleteConsoleSite(database)
        const req = getMockReq({
            body: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteConsole).toHaveBeenLastCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'delete',
            object: 'Console',
            idVal: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            deleteConsole: vi.fn(),
        }
        database.deleteConsole.mockRejectedValueOnce(DB_ERROR)

        const handler = deleteConsoleSite(database)
        const req = getMockReq({
            body: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Console Not Found', async () => {
        const database = {
            deleteConsole: vi.fn(),
        }
        database.deleteConsole.mockResolvedValue(null)

        const handler = deleteConsoleSite(database)
        const req = getMockReq({
            body: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteConsole).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Console',
            idVal: 1,
        })
    })
})

describe('Get All Games Page Test', () => {
    test('Get All Games Happy Path', async () => {
        const database = {
            getGames: vi.fn(),
        }
        database.getGames.mockResolvedValue(ALL_GAMES_RESPONSE)

        const handler = getAllGamesSite(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGames).toHaveBeenCalled()

        const expectedGames = ALL_GAMES_RESPONSE.map((game) => ({
            ...game,
            region_string: DERIVE_REGION_STRING(game.region),
            condition_string: DERIVE_CONDITION_STRING(game.product_condition),
        }))

        expect(res.render).toHaveBeenCalledWith('games.ejs', {
            games: expectedGames,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getGames: vi.fn(),
        }
        database.getGames.mockRejectedValueOnce(DB_ERROR)

        const handler = getAllGamesSite(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })
})

describe('Get Game Information Page Test', () => {
    test('Get Game Info Happy Path', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockResolvedValue(GAME_INFO_RESPONSE)

        const handler = getGameInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGameInformation).toHaveBeenCalledWith(1)

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

    test('Encountered 5XX Error', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getGameInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Game Not Found', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockResolvedValue([])

        const handler = getGameInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGameInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Game',
            idVal: 1,
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
    test('Add Game Happy Path', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = addGameSite(database)
        const req = getMockReq({
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addGame).toHaveBeenCalledWith(FULL_GAME_ENTRY)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'create',
            object: 'Game',
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = addGameSite(database)
        const req = getMockReq({
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Console Does Not Exist', async () => {
        const database = {
            addGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addGame.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = addGameSite(database)
        const req = getMockReq({
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addGame).toHaveBeenCalledTimes(0)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 400,
            error: CONSOLE_DOES_NOT_EXIST.message,
        })
    })
})

describe('Get Edit Game Information Page Test', () => {
    test('happy path', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockResolvedValue(GAME_INFO_RESPONSE)

        const handler = getEditGamePage(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGameInformation).toHaveBeenCalledWith(1)

        const expectedGames = GAME_INFO_RESPONSE.map((game) => ({
            ...game,
            region_string: DERIVE_REGION_STRING(game.region),
            condition_string: DERIVE_CONDITION_STRING(game.product_condition),
        }))

        expect(res.render).toHaveBeenCalledWith('addEditGame.ejs', {
            game: expectedGames[0],
            action: 'edit',
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getEditGamePage(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Game Not Found', async () => {
        const database = {
            getGameInformation: vi.fn(),
        }
        database.getGameInformation.mockResolvedValue([])

        const handler = getEditGamePage(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getGameInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Game',
            idVal: 1,
        })
    })
})

describe('Edit Game Test', () => {
    test('Edit Game Happy Path', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = editGameSite(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateGame).toHaveBeenLastCalledWith(1, FULL_GAME_ENTRY)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'update',
            object: 'Game',
            idVal: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = editGameSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Game Not Found', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(null)
        database.consoleExists.mockResolvedValue(true)

        const handler = editGameSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateGame).toHaveBeenCalledWith(1, FULL_GAME_ENTRY)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Game',
            idVal: 1,
        })
    })

    test('Console Does Not Exist', async () => {
        const database = {
            updateGame: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateGame.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = editGameSite(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_GAME_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateGame).toHaveBeenCalledTimes(0)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 400,
            error: CONSOLE_DOES_NOT_EXIST.message,
        })
    })
})

describe('Delete Game Test', () => {
    test('Delete Game Happy Path', async () => {
        const database = {
            deleteGame: vi.fn(),
        }
        database.deleteGame.mockResolvedValueOnce(DELETE_RESPONSE)

        const handler = deleteGameSite(database)
        const req = getMockReq({
            body: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteGame).toHaveBeenLastCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'delete',
            object: 'Game',
            idVal: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            deleteGame: vi.fn(),
        }
        database.deleteGame.mockRejectedValueOnce(DB_ERROR)

        const handler = deleteGameSite(database)
        const req = getMockReq({
            body: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Game Not Found', async () => {
        const database = {
            deleteGame: vi.fn(),
        }
        database.deleteGame.mockResolvedValue(null)

        const handler = deleteGameSite(database)
        const req = getMockReq({
            body: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteGame).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Game',
            idVal: 1,
        })
    })
})

describe('Get All Accessories Page Test', () => {
    test('Get All Accessories Happy Path', async () => {
        const database = {
            getAccessories: vi.fn(),
        }
        database.getAccessories.mockResolvedValue(ALL_ACCESSORIES_RESPONSE)

        const handler = getAllAccessoriesSite(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessories).toHaveBeenCalled()

        expect(res.render).toHaveBeenCalledWith('accessories.ejs', {
            accessories: ALL_ACCESSORIES_RESPONSE,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getAccessories: vi.fn(),
        }
        database.getAccessories.mockRejectedValueOnce(DB_ERROR)

        const handler = getAllAccessoriesSite(database)
        const req = getMockReq()
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })
})

describe('Get Accessory Information Page Test', () => {
    test('Get Accessory Info Happy Path', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockResolvedValue(
            ACCESSORY_INFO_RESPONSE
        )

        const handler = getAccessoryInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessoryInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('accessory.ejs', {
            accessories: ACCESSORY_INFO_RESPONSE,
            id: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getAccessoryInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Accessory Not Found', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockResolvedValue([])

        const handler = getAccessoryInformationSite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessoryInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Accessory',
            idVal: 1,
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
    test('Add Accessory Happy Path', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = addAccessorySite(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addAccessory).toHaveBeenCalledWith(FULL_ACCESSORY_ENTRY)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'create',
            object: 'Accessory',
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = addAccessorySite(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Console Does Not Exist', async () => {
        const database = {
            addAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.addAccessory.mockResolvedValue(CREATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = addAccessorySite(database)
        const req = getMockReq({
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.addAccessory).toHaveBeenCalledTimes(0)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 400,
            error: CONSOLE_DOES_NOT_EXIST.message,
        })
    })
})

describe('Get Edit Accessory Information Page Test', () => {
    test('happy path', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockResolvedValue(
            ACCESSORY_INFO_RESPONSE
        )

        const handler = getEditAccessoryPage(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessoryInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('addEditAccessory.ejs', {
            accessory: ACCESSORY_INFO_RESPONSE[0],
            action: 'edit',
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockRejectedValueOnce(DB_ERROR)

        const handler = getEditAccessoryPage(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Accessory Not Found', async () => {
        const database = {
            getAccessoryInformation: vi.fn(),
        }
        database.getAccessoryInformation.mockResolvedValue([])

        const handler = getEditAccessoryPage(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.getAccessoryInformation).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Accessory',
            idVal: 1,
        })
    })
})

describe('Edit Accessory Test', () => {
    test('Edit Accessory Happy Path', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(true)

        const handler = editAccessorySite(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateAccessory).toHaveBeenLastCalledWith(
            1,
            FULL_ACCESSORY_ENTRY
        )

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'update',
            object: 'Accessory',
            idVal: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockRejectedValueOnce(DB_ERROR)
        database.consoleExists.mockResolvedValue(true)

        const handler = editAccessorySite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Accessory Not Found', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(null)
        database.consoleExists.mockResolvedValue(true)

        const handler = editAccessorySite(database)
        const req = getMockReq({
            params: {
                id: '1',
            },
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateAccessory).toHaveBeenCalledWith(
            1,
            FULL_ACCESSORY_ENTRY
        )

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Accessory',
            idVal: 1,
        })
    })

    test('Console Does Not Exist', async () => {
        const database = {
            updateAccessory: vi.fn(),
            consoleExists: vi.fn(),
        }
        database.updateAccessory.mockResolvedValue(UPDATE_RESPONSE)
        database.consoleExists.mockResolvedValue(false)

        const handler = editAccessorySite(database)
        const req = getMockReq({
            params: {
                id: 1,
            },
            body: FULL_ACCESSORY_SITE_ENTRY,
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.updateAccessory).toHaveBeenCalledTimes(0)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 400,
            error: CONSOLE_DOES_NOT_EXIST.message,
        })
    })
})

describe('Delete Accessory Test', () => {
    test('Delete Accessory Happy Path', async () => {
        const database = {
            deleteAccessory: vi.fn(),
        }
        database.deleteAccessory.mockResolvedValueOnce(DELETE_RESPONSE)

        const handler = deleteAccessorySite(database)
        const req = getMockReq({
            body: {
                id: 1,
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteAccessory).toHaveBeenLastCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('status.ejs', {
            action: 'delete',
            object: 'Accessory',
            idVal: 1,
        })
    })

    test('Encountered 5XX Error', async () => {
        const database = {
            deleteAccessory: vi.fn(),
        }
        database.deleteAccessory.mockRejectedValueOnce(DB_ERROR)

        const handler = deleteAccessorySite(database)
        const req = getMockReq({
            body: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 500,
            error: DB_ERROR,
        })
    })

    test('Accessory Not Found', async () => {
        const database = {
            deleteAccessory: vi.fn(),
        }
        database.deleteAccessory.mockResolvedValue(null)

        const handler = deleteAccessorySite(database)
        const req = getMockReq({
            body: {
                id: '1',
            },
        })
        const { res } = getMockRes()

        await handler(req, res)

        expect(database.deleteAccessory).toHaveBeenCalledWith(1)

        expect(res.render).toHaveBeenCalledWith('error.ejs', {
            status: 404,
            object: 'Accessory',
            idVal: 1,
        })
    })
})

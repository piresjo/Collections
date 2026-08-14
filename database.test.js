import { beforeAll, describe, expect, test, vi } from 'vitest'
import { Database } from './database'
import {
    CONSOLE_INFO_RESPONSE,
    GAME_INFO_RESPONSE,
    ACCESSORY_INFO_RESPONSE,
    ALL_CONSOLES_RESPONSE,
    ALL_GAMES_RESPONSE,
    ALL_ACCESSORIES_RESPONSE,
    FULL_CONSOLE_ENTRY,
    CREATE_RESPONSE,
    FULL_GAME_ENTRY,
    FULL_ACCESSORY_ENTRY,
    DELETE_RESPONSE,
} from './database.test.data'

let database

beforeAll(async () => {
    database = new Database({ query: vi.fn() })
})

describe('Get Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, CONSOLE_INFO_RESPONSE)
        })

        const result = await database.getConsoleInformation(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console WHERE id=1',
            expect.any(Function)
        )

        expect(result).toEqual(CONSOLE_INFO_RESPONSE)
    })
})

describe('Get Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, GAME_INFO_RESPONSE)
        })

        const result = await database.getGameInformation(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game WHERE id=1',
            expect.any(Function)
        )

        expect(result).toEqual(GAME_INFO_RESPONSE)
    })
})

describe('Get Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ACCESSORY_INFO_RESPONSE)
        })

        const result = await database.getAccessoryInformation(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(result).toEqual(ACCESSORY_INFO_RESPONSE)
    })
})

describe('Get All Consoles DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ALL_CONSOLES_RESPONSE)
        })

        const result = await database.getConsoles()
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console',
            expect.any(Function)
        )

        expect(result).toEqual(ALL_CONSOLES_RESPONSE)
    })
})

describe('Get All Games DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ALL_GAMES_RESPONSE)
        })

        const result = await database.getGames()
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game',
            expect.any(Function)
        )

        expect(result).toEqual(ALL_GAMES_RESPONSE)
    })
})

describe('Get All Accessories DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, ALL_ACCESSORIES_RESPONSE)
        })

        const result = await database.getAccessories()
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory',
            expect.any(Function)
        )

        expect(result).toEqual(ALL_ACCESSORIES_RESPONSE)
    })
})

describe('Add Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const result = await database.addConsole(FULL_CONSOLE_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Console SET ?',
            FULL_CONSOLE_ENTRY,
            expect.any(Function)
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })
})

describe('Add Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const result = await database.addGame(FULL_GAME_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Game SET ?',
            FULL_GAME_ENTRY,
            expect.any(Function)
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })
})

describe('Add Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const result = await database.addAccessory(FULL_ACCESSORY_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Accessory SET ?',
            FULL_ACCESSORY_ENTRY,
            expect.any(Function)
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })
})

describe('Update Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const result = await database.updateConsole(1, FULL_CONSOLE_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Console SET ? WHERE id=1',
            FULL_CONSOLE_ENTRY,
            expect.any(Function)
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })
})

describe('Update Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const result = await database.updateGame(1, FULL_GAME_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Game SET ? WHERE id=1',
            FULL_GAME_ENTRY,
            expect.any(Function)
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })
})

describe('Update Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(
            (sql, bodyVal, callback) => {
                callback(null, CREATE_RESPONSE)
            }
        )

        const result = await database.updateAccessory(1, FULL_ACCESSORY_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Accessory SET ? WHERE id=1',
            FULL_ACCESSORY_ENTRY,
            expect.any(Function)
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })
})

describe('Delete Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, DELETE_RESPONSE)
        })

        const result = await database.deleteConsole(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Console WHERE id=1',
            expect.any(Function)
        )

        expect(result).toEqual(DELETE_RESPONSE)
    })
})

describe('Delete Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, DELETE_RESPONSE)
        })

        const result = await database.deleteGame(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Game WHERE id=1',
            expect.any(Function)
        )

        expect(result).toEqual(DELETE_RESPONSE)
    })
})

describe('Delete Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql, callback) => {
            callback(null, DELETE_RESPONSE)
        })

        const result = await database.deleteAccessory(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Accessory WHERE id=1',
            expect.any(Function)
        )

        expect(result).toEqual(DELETE_RESPONSE)
    })
})

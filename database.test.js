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
    UPDATE_RESPONSE,
    BULK_CONSOLE_ENTRIES,
    BULK_GAME_ENTRIES,
    EXPECTED_CONSOLE_AND_ID_MAP,
    BULK_CONSOLE_ID_SEARCH_RESPONSE,
    BULK_ACCESSORY_ENTRIES,
} from './database.test.data'

const DB_ERROR_CONNECTION_LOST = 'Connection Lost'
const DB_ERROR = new Error(DB_ERROR_CONNECTION_LOST)

let database

beforeAll(async () => {
    database = new Database({ query: vi.fn() })
})

describe('Get Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [CONSOLE_INFO_RESPONSE]
        })

        const result = await database.getConsoleInformation(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console WHERE id=?',
            [1]
        )

        expect(result).toEqual(CONSOLE_INFO_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.getConsoleInformation(1)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Get Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [GAME_INFO_RESPONSE]
        })

        const result = await database.getGameInformation(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game WHERE id=?',
            [1]
        )

        expect(result).toEqual(GAME_INFO_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.getGameInformation(1)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Get Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [ACCESSORY_INFO_RESPONSE]
        })

        const result = await database.getAccessoryInformation(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory WHERE id=?',
            [1]
        )

        expect(result).toEqual(ACCESSORY_INFO_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.getAccessoryInformation(1)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Get All Consoles DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql) => {
            return [ALL_CONSOLES_RESPONSE]
        })

        const result = await database.getConsoles()
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Console'
        )

        expect(result).toEqual(ALL_CONSOLES_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.getConsoles()).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Get All Games DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql) => {
            return [ALL_GAMES_RESPONSE]
        })

        const result = await database.getGames()
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Game'
        )

        expect(result).toEqual(ALL_GAMES_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.getGames()).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Get All Accessories DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation((sql) => {
            return [ALL_ACCESSORIES_RESPONSE]
        })

        const result = await database.getAccessories()
        expect(database.connection.query).toHaveBeenCalledWith(
            'SELECT * FROM Accessory'
        )

        expect(result).toEqual(ALL_ACCESSORIES_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.getAccessories()).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Add Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [CREATE_RESPONSE]
        })

        const result = await database.addConsole(FULL_CONSOLE_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Console SET ?',
            [FULL_CONSOLE_ENTRY]
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.addConsole(FULL_CONSOLE_ENTRY)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Add Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [CREATE_RESPONSE]
        })

        const result = await database.addGame(FULL_GAME_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Game SET ?',
            [FULL_GAME_ENTRY]
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.addGame(FULL_GAME_ENTRY)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Add Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [CREATE_RESPONSE]
        })

        const result = await database.addAccessory(FULL_ACCESSORY_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'INSERT INTO Accessory SET ?',
            [FULL_ACCESSORY_ENTRY]
        )

        expect(result).toEqual(CREATE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(
            database.addAccessory(FULL_ACCESSORY_ENTRY)
        ).rejects.toThrow(DB_ERROR_CONNECTION_LOST)
    })
})

describe('Update Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [UPDATE_RESPONSE]
        })

        const result = await database.updateConsole(1, FULL_CONSOLE_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Console SET ? WHERE id=?',
            [FULL_CONSOLE_ENTRY, 1]
        )

        expect(result).toEqual(UPDATE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(
            database.updateConsole(1, FULL_CONSOLE_ENTRY)
        ).rejects.toThrow(DB_ERROR_CONNECTION_LOST)
    })

    test('Console Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.updateConsole(1, FULL_CONSOLE_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Console SET ? WHERE id=?',
            [FULL_CONSOLE_ENTRY, 1]
        )

        expect(result).toEqual(null)
    })
})

describe('Update Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [UPDATE_RESPONSE]
        })

        const result = await database.updateGame(1, FULL_CONSOLE_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Game SET ? WHERE id=?',
            [FULL_CONSOLE_ENTRY, 1]
        )

        expect(result).toEqual(UPDATE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.updateGame(1, FULL_GAME_ENTRY)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })

    test('Game Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.updateGame(1, FULL_GAME_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Game SET ? WHERE id=?',
            [FULL_GAME_ENTRY, 1]
        )

        expect(result).toEqual(null)
    })
})

describe('Update Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [UPDATE_RESPONSE]
        })

        const result = await database.updateAccessory(1, FULL_ACCESSORY_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Accessory SET ? WHERE id=?',
            [FULL_ACCESSORY_ENTRY, 1]
        )

        expect(result).toEqual(UPDATE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(
            database.updateAccessory(1, FULL_ACCESSORY_ENTRY)
        ).rejects.toThrow(DB_ERROR_CONNECTION_LOST)
    })

    test('Accessory Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.updateAccessory(1, FULL_ACCESSORY_ENTRY)
        expect(database.connection.query).toHaveBeenCalledWith(
            'UPDATE Accessory SET ? WHERE id=?',
            [FULL_ACCESSORY_ENTRY, 1]
        )

        expect(result).toEqual(null)
    })
})

describe('Delete Console DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [DELETE_RESPONSE]
        })

        const result = await database.deleteConsole(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Console WHERE id=?',
            [1]
        )

        expect(result).toEqual(DELETE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.deleteConsole(1)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })

    test('Console Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.deleteConsole(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Console WHERE id=?',
            [1]
        )

        expect(result).toEqual(null)
    })
})

describe('Delete Game DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [DELETE_RESPONSE]
        })

        const result = await database.deleteGame(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Game WHERE id=?',
            [1]
        )

        expect(result).toEqual(DELETE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.deleteGame(1)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })

    test('Game Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.deleteGame(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Game WHERE id=?',
            [1]
        )

        expect(result).toEqual(null)
    })
})

describe('Delete Accessory DB Call', () => {
    test('happy path', async () => {
        database.connection.query.mockImplementation(() => {
            return [DELETE_RESPONSE]
        })

        const result = await database.deleteAccessory(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Accessory WHERE id=?',
            [1]
        )

        expect(result).toEqual(DELETE_RESPONSE)
    })

    test('Encountered DB Failure', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)

        await expect(database.deleteAccessory(1)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })

    test('Accessory Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.deleteAccessory(1)
        expect(database.connection.query).toHaveBeenCalledWith(
            'DELETE FROM Accessory WHERE id=?',
            [1]
        )

        expect(result).toEqual(null)
    })
})

describe('Console Exists DB Call', () => {
    test('Console Exists', async () => {
        database.connection.query.mockImplementation(() => {
            return [CONSOLE_INFO_RESPONSE]
        })

        const result = await database.consoleExists(1)

        expect(result).toBe(true)
    })

    test('Console Does Not Exist', async () => {
        database.connection.query.mockImplementation(() => {
            return [{ affectedRows: 0 }]
        })

        const result = await database.consoleExists(1)

        expect(result).toBe(false)
    })
})

describe('Bulk Console Entry DB Call', () => {
    test('Successful Bulk Entry', async () => {
        database.connection.query.mockImplementation(() => {
            return [CREATE_RESPONSE]
        })
        const result = await database.bulkConsoleEntry(BULK_CONSOLE_ENTRIES)
        expect(database.connection.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO Console'),
            [BULK_CONSOLE_ENTRIES]
        )
        expect(result).toEqual(CREATE_RESPONSE)
    })

    test('Encountered DB Error', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)
        await expect(
            database.bulkConsoleEntry(BULK_CONSOLE_ENTRIES)
        ).rejects.toThrow(DB_ERROR_CONNECTION_LOST)
    })
})

describe('Bulk Game Entry DB Call', () => {
    test('Successful Bulk Entry', async () => {
        database.connection.query.mockImplementation(() => {
            return [CREATE_RESPONSE]
        })
        const result = await database.bulkGameEntry(BULK_GAME_ENTRIES)
        expect(database.connection.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO Game'),
            [BULK_GAME_ENTRIES]
        )
        expect(result).toEqual(CREATE_RESPONSE)
    })

    test('Encountered DB Error', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)
        await expect(database.bulkGameEntry(BULK_GAME_ENTRIES)).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

describe('Bulk Accessory Entry DB Call', () => {
    test('Successful Bulk Entry', async () => {
        database.connection.query.mockImplementation(() => {
            return [CREATE_RESPONSE]
        })
        const result = await database.bulkAccessoryEntry(BULK_ACCESSORY_ENTRIES)
        expect(database.connection.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO Accessory'),
            [BULK_ACCESSORY_ENTRIES]
        )
        expect(result).toEqual(CREATE_RESPONSE)
    })

    test('Encountered DB Error', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)
        await expect(
            database.bulkAccessoryEntry(BULK_ACCESSORY_ENTRIES)
        ).rejects.toThrow(DB_ERROR_CONNECTION_LOST)
    })
})

describe('Get All Consoles And Ids DB Call', () => {
    test('Successful Search', async () => {
        database.connection.query.mockImplementation(() => {
            return [BULK_CONSOLE_ID_SEARCH_RESPONSE]
        })
        const result = await database.mapConsoleNameToConsoleIds()
        expect(database.connection.query).toHaveBeenCalledWith(
            `SELECT id, name FROM Console`
        )
        expect(result).toEqual(EXPECTED_CONSOLE_AND_ID_MAP)
    })

    test('Encountered DB Error', async () => {
        database.connection.query.mockRejectedValueOnce(DB_ERROR)
        await expect(database.mapConsoleNameToConsoleIds()).rejects.toThrow(
            DB_ERROR_CONNECTION_LOST
        )
    })
})

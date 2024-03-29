import * as core from '@actions/core';
import * as helper from '../src/io-helper';
import { run } from '../src/run';
import * as pgMigrate from 'postgres-migrations';
import * as pg from 'pg';

import { describe, expect, it, afterEach, beforeEach } from '@jest/globals';

jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn()
    };
    return { Client: jest.fn(() => mClient) };
});

let getInputsMock: jest.SpiedFunction<typeof helper.getInputs>;
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
let migrateMock: jest.SpiedFunction<typeof pgMigrate.migrate>;

describe('run.ts', () => {
    let client: pg.Client;

    afterEach(() => {
        jest.clearAllMocks();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        client = new pg.Client();

        getInputsMock = jest.spyOn(helper, 'getInputs').mockImplementation();
        setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation();
        setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
        migrateMock = jest.spyOn(pgMigrate, 'migrate').mockImplementation();
    });

    it('should work', async () => {
        getInputsMock.mockImplementation(() => {
            return {
                migrations: 'src'
            } as helper.ActionInputs;
        });
        migrateMock.mockImplementation(() => new Promise(resolve => resolve([])));
        (client.connect as any).mockImplementation(() => new Promise(resolve => resolve({ rowCount: 1 })));

        await run();
        expect(getInputsMock).toBeCalled();
        expect(client.connect).toBeCalled();
        expect(migrateMock).toBeCalled();
        expect(setOutputMock).toHaveBeenNthCalledWith(1, 'migrations', []);
    });

    it('should check existance', async () => {
        getInputsMock.mockImplementation(() => {
            return { migrations: 'not-existing.txt' } as helper.ActionInputs;
        });

        await run();
        expect(getInputsMock).toBeCalled();
        expect(setOutputMock).not.toBeCalled();
        expect(setFailedMock).toBeCalledWith(`'not-existing.txt' is not found!`);
    });

    it('should check directory', async () => {
        getInputsMock.mockImplementation(() => {
            return { migrations: 'README.md' } as helper.ActionInputs;
        });

        await run();
        expect(getInputsMock).toBeCalled();
        expect(setOutputMock).not.toBeCalled();
        expect(setFailedMock).toBeCalledWith(`'README.md' is not directory!`);
    });
});


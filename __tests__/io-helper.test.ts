import * as core from '@actions/core';
import { describe, expect } from '@jest/globals';
import { ActionInputs, getInputs, Inputs } from '../src/io-helper';

let getInputMock: jest.SpiedFunction<typeof core.getInput>;

describe('io-helper.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
    });

    it('should get proper input', () => {
        getInputMock.mockImplementation((name, _) => {
            switch (name) {
                case Inputs.Migrations:
                    return './local-folder';
                case Inputs.Host:
                    return 'localhost';
                case Inputs.Port:
                    return '5432';
                case Inputs.Database:
                    return 'mydb';
                case Inputs.Username:
                    return 'user';
                case Inputs.Password:
                    return 'password';
                case Inputs.SSL:
                    return 'false';
                case Inputs.ToFile:
                    return 'false';
                default:
                    return '';
            }
        });

        const inputs = getInputs();
        expect(inputs).toEqual({
            migrations: './local-folder',
            host: 'localhost',
            db: 'mydb',
            port: 5432,
            username: 'user',
            password: 'password',
            ssl: false,
            toFile: false
        } as ActionInputs);
    });
});


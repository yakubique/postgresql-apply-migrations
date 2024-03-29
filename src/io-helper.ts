import * as core from '@actions/core';
import { getBooleanInput, getNumberInput, getOptional } from '@yakubique/atils/dist';

export enum Inputs {
    Migrations = 'migrations',
    Host = 'host',
    Port = 'port',
    Database = 'db',
    Username = 'username',
    Password = 'password',
    SSL = 'ssl',
    ToFile = 'to_file'
}

export interface ActionInputs {
    migrations: string;
    host: string;
    db: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
    toFile: boolean;
}

const required = { required: true };
const nonRequired = { required: false };

export function getInputs(): ActionInputs {
    const result = {} as ActionInputs;

    result.migrations = core.getInput(Inputs.Migrations, required);
    result.host = core.getInput(Inputs.Host, required);
    result.username = core.getInput(Inputs.Username, required);
    result.password = core.getInput(Inputs.Password, required);

    result.db = getOptional(Inputs.Database, 'postgres', nonRequired);

    result.port = getNumberInput(Inputs.Port, required);

    result.ssl = getBooleanInput(Inputs.SSL);
    result.toFile = getBooleanInput(Inputs.ToFile);

    return result;
}

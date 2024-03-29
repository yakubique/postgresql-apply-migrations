import { buildOutput, outputJson } from '@yakubique/atils/dist';
import * as core from '@actions/core';
import { ActionInputs, getInputs } from './io-helper';
import * as fs from 'node:fs';
import { migrate } from 'postgres-migrations';
import { Client } from 'pg';
import path from 'node:path';

enum Outputs {
    migrations = 'migrations',
}

const setOutputs = buildOutput(Outputs);

export async function run() {
    let client;
    try {
        const inputs: ActionInputs = getInputs();

        if (!fs.existsSync(inputs.migrations)) {
            throw new Error(`'${inputs.migrations}' is not found!`);
        } else if (!fs.lstatSync(inputs.migrations).isDirectory()) {
            throw new Error(`'${inputs.migrations}' is not directory!`);
        }

        client = new Client({
            user: inputs.username,
            password: inputs.password,
            host: inputs.host,
            database: inputs.db,
            port: inputs.port,
            ssl: inputs.ssl
        });
        await client.connect();

        const migrations = await migrate({ client }, path.resolve(inputs.migrations));

        setOutputs({
            migrations: outputJson(migrations, inputs.toFile)
        });

        core.info('Success!');
    } catch (err: any) {
        core.setFailed(err.message);
    } finally {
        await client?.end();
    }
}

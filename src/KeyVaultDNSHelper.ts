import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from "@actions/io";

export class KeyVaultDNSHelper{

    public static async getBaseUrl(): Promise<string> {
        if(!this._vaultDnsSuffix) {            
            let azCloudDetails = JSON.parse(await KeyVaultDNSHelper.executeAzCliCommand('cloud show'));
            const cloudEndpoints = azCloudDetails['suffixes'];
            this._vaultDnsSuffix = KeyVaultDNSHelper.getVaultDNSSuffix(cloudEndpoints);
        }

        return Promise.resolve(this._vaultDnsSuffix);
    }

    public static async executeAzCliCommand(command: string, args?: string[]): Promise<string> {
        let azCliPath = await io.which('az', true);
        let stdout = '';
        let stderr = '';

        try {
            core.debug(`"${azCliPath}" ${command}`);
            await exec.exec(`"${azCliPath}" ${command}`, args, {
                silent: true, // this will prevent priniting access token to console output
                listeners: {
                    stdout: (data: Buffer) => {
                        stdout += data.toString();
                    },
                    stderr: (data: Buffer) => {
                      stderr += data.toString();
                    }
                }
            });
        }
        catch(error) {
            throw new Error(stderr);
        }

        return stdout;
    }

    private static getVaultDNSSuffix(cloudEndpoints: {[key: string]: string}): string {
        if (!cloudEndpoints['keyvaultDns']) {
            return 'https://vault.azure.net';
        }

        // Remove trailing slash.
        return cloudEndpoints['keyvaultDns'];
    }

    private static _vaultDnsSuffix: string;
} 
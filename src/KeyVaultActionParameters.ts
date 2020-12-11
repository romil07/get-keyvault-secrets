import util = require("util");
import * as core from '@actions/core';
import { KeyVaultDNSHelper } from './KeyVaultDNSHelper';

export class KeyVaultActionParameters {

    public keyVaultName: string;
    public secretsFilter: string;
    public keyVaultUrl: string;

    public async getKeyVaultActionParameters() : Promise<KeyVaultActionParameters> {
        this.keyVaultName = core.getInput("keyvault");
        this.secretsFilter = core.getInput("secrets");

        if (!this.keyVaultName) {
            core.setFailed("Vault name not provided.");
        }

        if (!this.secretsFilter) {
            core.setFailed("Secret filter not provided.");
        }

        var azureKeyVaultDnsSuffix = "vault.azure.net";
        await KeyVaultDNSHelper.getBaseUrl().then(dnsSuffix => {
            azureKeyVaultDnsSuffix = dnsSuffix.substring(1);
            console.log("checkpoint1: " + azureKeyVaultDnsSuffix);
        });
        this.keyVaultUrl = util.format("https://%s.%s", this.keyVaultName, azureKeyVaultDnsSuffix);
        return Promise.resolve(this);
    }
}
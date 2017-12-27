

/// Not used at the moment, could be used for child procs


import rp from 'request-promise';
import fs from 'fs';

const buildRequest = function(uri, impersonate) {
    if(impersonate) {
        return {
        uri,
        agentOptions: {
            pfx: fs.readFileSync(process.env.CertFileName),
            passphrase: process.env.CertPassphrase
        },
        rejectUnauthorized: false,
        headers: {
            Accept: 'application/json',
            certificate_name: impersonate
        },
        json: true
        }
    } else {
        return {
            uri,
            headers: {
                Accept: 'application/json',
                Authorization: process.env.AuthToken,
            }
        }
    }
}

const handleRequest = function(bundle) {
    let settings = JSON.parse(bundle);
    let req = buildRequest(settings.uri, settings.impersonate)
}
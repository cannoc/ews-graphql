const rp = require('request-promise');
import fs from 'fs';
import {buildRequest} from '../utils';

const BaseUrl = process.env.IDCardBaseUrl;

const Resolvers = {
    GetPhoto: () => {
        return null;
    },
    PhotoSearch: () => {
        return null;
    },
    GetCard: () => {
        // will need to be faked
        return null;
    },
    CardSearch: () => {
        return null;
    }
}

module.exports = Resolvers;
const rp = require('request-promise');
import fs from 'fs';
import {buildRequest} from '../utils';

const BaseUrl = process.env.IDCardBaseUrl;

const Resolvers = {
    GetPhoto: (args, impersonate) => {
        let photos = Resolvers.PhotoSearch(args, impersonate);
        return photos.then(res => res.Photos[0]);
    },
    PhotoSearch: (args, impersonate) => {
        let req = buildRequest(`${BaseUrl}photo?employee_id=${args.EmployeeID || ''}&height=${args.Height || ''}&net_id=${args.NetID || ''}&reg_id=${args.RegID || ''}&student_number=${args.StudentNumber || ''}`, impersonate);
        return rp(req).then(res => JSON.parse(res));
    },
    GetCard: (args, impersonate) => {
        return Resolvers.CardSearch(args, impersonate).then(res => res.Cards[0]);
    },
    CardSearch: (args, impersonate) => {
        let req = buildRequest(`${BaseUrl}card?prox_rfid=${args.ProxRFID || ''}&mag_strip_code=${args.MagStripCode || ''}`, impersonate);
        return rp(req).then(res => JSON.parse(res));
    }
}

module.exports = Resolvers;
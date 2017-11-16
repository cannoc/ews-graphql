const rp = require('request-promise');
import fs from 'fs';
import {buildRequest} from '../utils';

const BaseUrl = process.env.PWSBaseUrl;

const Resolvers = {
    GetPerson: (key, impersonate) => {
        let req = buildRequest(`${BaseUrl}person/${key}`, impersonate);
        return rp(req).then(res => JSON.parse(res));
    },
    PersonSearch: (args, impersonate) => {
        let uri = `${BaseUrl}person?uwregid=${args.UWRegID || ''}&uwnetid=${args.UWNetID || ''}&employee_id=${''}&student_number=${''}&student_system_key=${''}&development_id=${''}&last_name=${''}&first_name=${''}&changed_since_date=${''}&phone_number=${''}&mail_stop=${''}&home_dept=${''}&department=${''}&address=${''}&title=${''}&email=${''}&page_size=${'10'}`;
        let req = buildRequest(uri, impersonate);
        return rp(req).then(res => JSON.parse(res));
    }
};

module.exports = Resolvers;
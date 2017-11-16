import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';
import createLoaders from './schema/resolvers';
import {validateCert} from './schema/utils';
import https from 'https';
import fs from 'fs';

var credentials = { 
    key: fs.readFileSync('certs/key.pem', 'utf8'), 
    cert: fs.readFileSync('certs/cert.pem', 'utf8'), 
    rejectUnauthorized: false, 
    requestCert: true 
};

var app = express();

app.use(function (req, res, next) {
    var cert = req.socket.getPeerCertificate();
    if (cert.subject) {
        req.impersonate = cert.subject.CN;
    }
    if(!validateCert(cert)) {
        return res.status(401).send('Cert is not authorized');
    }
    next();
}); 

app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
    schema, context: {loaders: createLoaders(req.impersonate), impersonate: req.impersonate}
})));

app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, () => console.log('Now browse to localhost:8443/graphiql'));
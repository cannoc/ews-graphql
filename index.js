import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';
import createLoaders from './schema/resolvers';
import {validateCert} from './schema/utils';
import https from 'https';
import fs from 'fs';
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


var credentials = { 
    key: fs.readFileSync('certs/key.pem', 'utf8'), 
    cert: fs.readFileSync('certs/cert.pem', 'utf8'), 
    rejectUnauthorized: false, 
    requestCert: false 
};

// Fix for windows to use other workers, without this it only uses the last worker
cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });
  
    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

  } else {
    var app = express();
    
    app.use(function (req, res, next) {
        var cert = req.socket.getPeerCertificate();
        if (cert.subject) {
            req.impersonate = cert.subject.CN;
        } else {
            req.impersonate = "aisdev.cac.washington.edu";
        }
        // if(!validateCert(cert)) {
        //     return res.status(401).send('Cert is not authorized');
        // }
        next();
    }); 
    
    app.use('/graphql', bodyParser.json(), (req,res,next) => {
        return graphqlExpress(req => ({
            schema, context: {loaders: createLoaders(req.impersonate), impersonate: req.impersonate}
        }))(req,res,next);
    });
    
    app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
    
    var httpsServer = https.createServer(credentials, app);
    httpsServer.timeout = 90000000;
    
    httpsServer.listen(8443);
    
  }
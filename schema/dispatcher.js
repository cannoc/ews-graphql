import rp from 'request-promise';
import pq from './p-queue';
import delay from 'delay';
import lqueue from 'linked-queue';
import store from 'json-fs-store';

let processed = 0;
let start = null;

class PromiseQueue {
	constructor() {
        // this._queue = [];
        this._queue = new lqueue();
        this._backup = [];
        this._logCount = 0;
    }
    log() {
        if(this._logCount > 100 || this.size == 0) {
            console.log(`ProcessID: ${process.pid}, QueueSize: ${this.size}, BackupQueue: ${this._backup.length}, TotalProcessed: ${processed}`);
            this._logCount = 0;
        } else {
            this._logCount++;
        }
    }
    manageQueue() {
        if(this._backup.length > 5000) {
            store('./tmp'+ ++fileCount)
        }
    }
	enqueue(run, opts) {
        //this._queue[this._queue.length] = {run};
        if(this._queue.length > 10000 || this._backup.length) {
            this._backup.push({run});
        } else {
           this._queue.enqueue({run}); 
        }
        return;
	}
	dequeue() {
        this.log();
        if(this._queue.length < 10000 && this._backup.length) {
            this._queue.enqueueAll(this._backup.splice(0,5000));
        }
        // return this._queue.shift().run;
        return this._queue.dequeue().run;
	}
	get size() {
		return this._queue.length;
	}
}

const maxConcurrent = 50;

const queue = new pq({concurrency: maxConcurrent, queueClass: PromiseQueue});
let onIdle = null;

const Dispatcher = (req) => {
    return queue.add(() => {
        return rp(req);
    })
    .then(req => {
        if(!onIdle) {
            start = Date.now();
            onIdle = queue.onIdle().then(() => {
                let seconds = (Date.now() - start) / 1000;
                console.log(`Process ${process.pid} processed ${processed} requests in ${seconds} seconds, ${processed/seconds}/s`);
                processed = 0;
                onIdle = null;
            });
        }
        processed++;
        return req;
    });
}

export { Dispatcher };
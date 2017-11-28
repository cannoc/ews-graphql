import rp from 'request-promise';
import pq from 'p-queue';
import delay from 'delay';

let processed = 0;

class PriorityQueue {
	constructor() {
        this._queue = [];
        this._logCount = 0;
    }

    log() {
        if(this._logCount > 100 || this.size == 0) {
            console.log(`ProcessID: ${process.pid}, QueueSize: ${this.size}, TotalProcessed: ${processed}`);
            this._logCount = 0;
        } else {
            this._logCount++;
        }
    }

	enqueue(run, opts) {
        delay(this.size);
        this._queue.push({run});
        return;
	}

	dequeue() {
        this.log();
		return this._queue.shift().run;
	}

	get size() {
		return this._queue.length;
	}
}

const maxConcurrent = 50;

const queue = new pq({concurrency: maxConcurrent, queueClass: PriorityQueue});
let onIdle = null;
let start = null;

const Dispatcher = (req) => {
    return queue.add(() => {
        return rp(req);
    }).then(req => {
        if(!onIdle) {
            start = Date.now();
            onIdle = queue.onIdle().then(() => {
                console.log(`Process ${process.pid} processed ${processed} requests in ${(Date.now() - start) / 1000} seconds`);
                processed = 0;
                onIdle = null;
            });
        }
        processed++;
        return req;
    });
}

export { Dispatcher };
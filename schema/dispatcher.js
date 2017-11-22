import rp from 'request-promise';
import pq from 'p-queue';

const maxConcurrent = 20;
let processed = 0;
const queue = new pq({concurrency: maxConcurrent});
let onIdle = null;
let start = null;

const Dispatcher = (req) => {
    return queue.add(() => {
            if(!onIdle) {
                start = Date.now();
                onIdle = queue.onIdle().then(() => {
                    console.log(`Process ${process.pid} processed ${processed} requests in ${(Date.now() - start) / 1000} seconds`);
                    processed = 0;
                    onIdle = null;
                });
            }
        
        processed++;
        //console.log(`Pending: ${queue.pending}, QueueSize: ${queue.size}, TotalProcessed: ${processed}`);
        return rp(req);
    });
}

export {Dispatcher};
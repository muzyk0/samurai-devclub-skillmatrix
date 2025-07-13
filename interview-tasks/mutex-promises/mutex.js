export class Mutex {
    #status = 'open'
    #acquireWaitingPromisesResolveFunctionsQueue = []; // FIFO
    #waitingPromisesResolveFunctions = [];

    waitForUnlock() {
        const promise = new Promise((resolve) => {
            if (this.#status === 'open') {
                resolve()
            } else {
                this.#waitingPromisesResolveFunctions.push(resolve)
            }
        })
        return promise;
    }

    isLocked() {
        return this.#status === 'closed';
    }

    #release() {
        const nextResolve = this.#acquireWaitingPromisesResolveFunctionsQueue.shift();
        if (!nextResolve) {
            this.#status = 'open';
        } else {
            nextResolve(() => this.#release())
        }

        this.#waitingPromisesResolveFunctions.forEach(resolve => resolve());
    }

    acquire() {
        const promise = new Promise((resolve) => {
            if (this.#status === 'open') {
                this.#status = 'closed';
                resolve(() => this.#release())
            } else {
                this.#acquireWaitingPromisesResolveFunctionsQueue.push(resolve)
            }
        })
        return promise;
    }
}
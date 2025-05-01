const ID = Math.floor(Math.random() * 999999);
console.log('shared-worker.js', ID);

const ports = new Set();

self.onconnect = (event) => {
    const port = event.ports[0];
    ports.add(port);
    port.onmessage = (event) => {
        for (let p of ports) {
            if (p === port) {
                continue;
            }
            p.postMessage({
                ...event.data,
                __isSyncAction: true
            });
        }
    };
};
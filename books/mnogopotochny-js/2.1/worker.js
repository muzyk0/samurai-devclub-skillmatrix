console.log('привет от worker.js');

// ✅ globalThis.onmessage = (msg) => {
self.onmessage = (msg) => {
    console.log('сообщение от main', msg.data);
    const start = new Date();

    while(new Date().getTime() - start <= 1000) {

    }
    postMessage('сообщение, отправленное исполнителем');

};
console.log('привет от main.js');

const worker = new Worker('worker.js');

worker.onmessage = (msg) => {
    console.log('получено сообщение от worker', msg.data);
};

worker.postMessage('отправлено сообщение исполнителю');

console.log('конец main.js');
// Заглушки для асинхронных “запросов”, возвращают Promise
function request1() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Response from request 1');
        }, 1000);
    });
}

function request2() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Response from request 2');
        }, 1500);
    });
}

// Финальная функция
function finalFunction(res1, res2) {
    console.log('Final function:', res1, res2);
}

Promise.all([
    request1(),
    request2()
])
    .then(([res1, res2]) => {
        finalFunction(res1, res2);
    });
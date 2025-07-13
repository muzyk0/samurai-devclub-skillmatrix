// Заглушки для асинхронных “запросов”
function request1(callback) {
    setTimeout(() => {
        const data1 = 'Response from request 1';
        callback(data1);
    }, 1000); // 1 секунда
}

function request2(callback) {
    setTimeout(() => {
        const data2 = 'Response from request 2';
        callback(data2);
    }, 1500); // 1.5 секунды
}

// Финальная функция, которая сработает после обоих ответов
function finalFunction(res1, res2) {
    console.log('Final function:', res1, res2);
}

// Переменные для хранения результатов
let result1;
let result2;

// Запускаем оба запроса «одновременно»
request1((res1) => {
    console.log(res1);
    result1 = res1;
    // Проверяем, пришёл ли уже ответ от второго
    if (result2 !== undefined) {
        finalFunction(result1, result2);
    }
});

request2((res2) => {
    console.log(res2);
    result2 = res2;
    // Проверяем, пришёл ли уже ответ от первого
    if (result1 !== undefined) {
        finalFunction(result1, result2);
    }
});

// 2) Вариант на async/await
async function run() {
    // оба запроса стартуют параллельно
    const [res1, res2] = await Promise.all([request1(), request2()]);
    finalFunction(res1, res2);
}

run();

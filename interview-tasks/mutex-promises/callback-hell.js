// Вместо rootPromise — эмуляция через setTimeout
setTimeout(() => {
    const random = Math.random();
    console.log(random); // аналог .then((random) => console.log(random))

    // delay(3000)
    setTimeout(() => {
        const number = 42; // любое значение, как будто результат delay
        console.log(number); // аналог .then((number) => console.log(number))
    }, 3000);

}, 1000); // rootPromise исполняется, например, через 1 секунду

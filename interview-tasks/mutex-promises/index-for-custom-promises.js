import {MyPromise} from "./my-promise.js";

let PromiseForTest = MyPromise;

// const mutex = new Mutex();
const rootPromise = delay(3000);

rootPromise
    .then((random) => console.log(random))
    .then(() => delay(3000))
    .then((number => console.log(number)));

//rootPromise.then((random) => console.log(random))


// delay(3000)
//     .then((random) => {
//         console.log("1, " + random);
//         return 1000;
//     }) // 1
//     .then((tyshya) => console.log(tyshya)) // 2
//.then(() => console.log(2)) // 3
//.then(() => delay(1000)) // 4
//.then(() => console.log(3)); // 5

// const data = await delay(10000000)
//     .then() // {  return new Promise((res)=>{ this.innerThen(res) })
//     .then() // 2 new Promise
//     .then() // 3
//     .then() // 4
//     .then(() => 100); // 5
//


function delay(ms) {
    return new PromiseForTest((resolve) => {
        setTimeout(() => {
            resolve(Math.random())
        }, ms)
    })
}


//console.log(mutex);



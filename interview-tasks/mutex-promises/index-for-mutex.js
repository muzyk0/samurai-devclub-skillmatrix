import {Mutex} from "./mutex.js";

//import { Mutex } from 'https://unpkg.com/async-mutex@0.5.0?module';// имя пакета = ключ в window

// backend
let balance = 1;

function fetchBalance() {
    return new Promise((resolve) => {
        const actualBalance = balance
        setTimeout(() => resolve(actualBalance), 3000);
    })
}

function fetchMakeOrder() {
    return new Promise((resolve) => {
        balance--;
        setTimeout(() => {
            resolve(balance);
        }, 1000);
    })
}

// front
//============

const mutex = new Mutex();

document.getElementById('run1').addEventListener('click',
    () => handleMakeOrder(1))
document.getElementById('run2').addEventListener('click',
    () => handleMakeOrder(2))
document.getElementById('run3').addEventListener('click',
    () => handleMakeOrder(3))

async function handleMakeOrder(threadNumber) {
    console.log(`Make order: ${threadNumber}`);
    if (mutex.isLocked()) {
        console.log(`Someone lock mutex: ${threadNumber}`);
        await mutex.waitForUnlock();
        console.log(`Mutex UNLOCKED: ${threadNumber}`);
    }
    console.log(`I will LOCK mutex: ${threadNumber}`);
    const release = await mutex.acquire();
    console.log(`I LOCKED mutex: ${threadNumber}`);
    const balance = await fetchBalance()
    if (balance > 0) {
        await fetchMakeOrder()
        console.log(`thread #${threadNumber}: made order 😁`)
    } else {
        console.log(`thread #${threadNumber}: no money 😢`)
    }
    const resultBalance = await fetchBalance()
    console.log(`thread #${threadNumber}: result balance 💰 ${resultBalance}`)
    release();
}


const delay = (ms) => new Promise(res => setTimeout(res, ms));



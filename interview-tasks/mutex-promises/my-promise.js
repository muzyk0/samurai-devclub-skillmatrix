export class MyPromise {
    status = 'pending'

    #callbacksAndResolvers = []; //[{callback, resolver}]

    #resolve(resolvedValue) {
        this.status = 'fullfilled'

        this.#callbacksAndResolvers?.forEach(o => {
            const callbackResult = o.callback(resolvedValue)
            if (callbackResult instanceof MyPromise) {
                callbackResult.then(r => {
                    o.resolver(r)
                })
            } else {
                o.resolver(callbackResult)
            }
        })
    }

    constructor (executor) {
        console.log('Promise constructor')
        const resolveForExecutor = (resolvedValue) => {this.#resolve(resolvedValue)}
        executor(resolveForExecutor)
    }
    then(callback) {
        return new MyPromise((res)=>{
            this.#callbacksAndResolvers.push({
                callback: callback,
                resolver: res
            })
        })
    }
    _subscribe() {

    }
}



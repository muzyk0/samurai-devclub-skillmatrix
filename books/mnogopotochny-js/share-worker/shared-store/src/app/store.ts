import {configureStore, isPlainObject, Middleware} from '@reduxjs/toolkit'
import {counterSlice} from "../features/counter/counterSlice.ts";
import {api} from "../features/items/api.ts";





function stripNonCloneable(action: any): any {
    const { meta, ...rest } = action;

    return {
        ...rest,
        meta: {
            ...meta,
            baseQueryMeta: {
                ...meta?.baseQueryMeta,
                request: undefined,     // 💥 удаляем несериализуемые
                response: undefined,    // 💥
            },
        },
    };
}

const catchNonThunkActionsMiddleware: Middleware = storeAPI => next => action => {
    // Ignore thunks (functions)
    if (typeof action === 'function') {
        return next(action); // let default thunk middleware handle it
    }

    // Optionally filter out non-plain objects (e.g., Symbols or Promises)
    if (!isPlainObject(action)) {
        return next(action);
    }

    // 💡 Do something with the action
    console.log('Caught action:', action);

    // @ts-ignore
    if (!action.__isSyncAction) {
        const safeAction = stripNonCloneable(action);
        worker.port.postMessage(safeAction);
    }

    return next(action);
};


export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware, catchNonThunkActionsMiddleware),
})

const worker = new SharedWorker('/global-state.js');

worker.port.onmessage = (event) => {
    store.dispatch(event.data)
};


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


//setupListeners(store.dispatch)
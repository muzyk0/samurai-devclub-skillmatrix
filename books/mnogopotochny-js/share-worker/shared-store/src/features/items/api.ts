import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Item = {
    id: number;
    title: string;
};

export const api = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    endpoints: (builder) => ({
        getItems: builder.query<Item[], void>({
            query: () => 'items',
        }),

        getItem: builder.query<Item, number>({
            query: (id) => `items/${id}`,
        }),

        createItem: builder.mutation<Item, Partial<Item>>({
            query: (body) => ({
                url: 'items',
                method: 'POST',
                body,
            }),
            async onQueryStarted(newItem, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(
                        api.util.updateQueryData('getItems', undefined, (draft) => {
                            draft.push(data);
                        })
                    );
                } catch {
                    // handle error or rollback if needed
                }
            },
        }),

        updateItem: builder.mutation<Item, Item>({
            query: ({ id, ...patch }) => ({
                url: `items/${id}`,
                method: 'PUT',
                body: patch,
            }),
            async onQueryStarted(updatedItem, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(
                        api.util.updateQueryData('getItems', undefined, (draft) => {
                            const index = draft.findIndex((item) => item.id === data.id);
                            if (index !== -1) draft[index] = data;
                        })
                    );
                } catch {
                    // handle error or rollback
                }
            },
        }),

        deleteItem: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `items/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(
                        api.util.updateQueryData('getItems', undefined, (draft) => {
                            return draft.filter((item) => item.id !== id);
                        })
                    );
                } catch {
                    // handle error or rollback
                }
            },
        }),
    }),
});

export const {
    useGetItemsQuery,
    useGetItemQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} = api;

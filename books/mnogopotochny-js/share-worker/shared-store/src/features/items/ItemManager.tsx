// src/ItemManager.tsx
import React, { useState } from 'react';
import {
    useGetItemsQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
} from './api';

export const ItemManager: React.FC = () => {
    const { data: items, isLoading } = useGetItemsQuery();
    const [createItem] = useCreateItemMutation();
    const [updateItem] = useUpdateItemMutation();
    const [deleteItem] = useDeleteItemMutation();

    const [newTitle, setNewTitle] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const handleCreate = async () => {
        if (newTitle) {
            await createItem({ title: newTitle });
            setNewTitle('');
        }
    };

    const handleUpdate = async (id: number) => {
        await updateItem({ id, title: editTitle });
        setEditingId(null);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Items</h2>
            <ul>
                {items?.map((item) => (
                    <li key={item.id}>
                        {editingId === item.id ? (
                            <>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <button onClick={() => handleUpdate(item.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {item.title}{' '}
                                <button
                                    onClick={() => {
                                        setEditingId(item.id);
                                        setEditTitle(item.title);
                                    }}
                                >
                                    Edit
                                </button>
                                <button onClick={() => deleteItem(item.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <div>
                <input
                    placeholder="New title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <button onClick={handleCreate}>Add</button>
            </div>
        </div>
    );
};

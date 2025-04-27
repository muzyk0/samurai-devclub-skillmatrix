Конечно! Вот простые и понятные **примеры поиска в IndexedDB**:  
(Сначала базовый поиск по ключу, затем — через индекс.)

---

# 🔹 1. Поиск записи напрямую по ключу (`get`)

```javascript
// Открываем транзакцию на чтение
const transaction = db.transaction(["users"], "readonly");

// Берём objectStore
const store = transaction.objectStore("users");

// Ищем запись по ключу (например, id = 5)
const request = store.get(5);

request.onsuccess = function() {
  const user = request.result;
  console.log("Пользователь найден:", user);
};

request.onerror = function() {
  console.error("Ошибка при поиске по ключу.");
};
```

---

# 🔹 2. Поиск всех записей (`getAll`)

```javascript
const transaction = db.transaction(["users"], "readonly");
const store = transaction.objectStore("users");

const request = store.getAll();

request.onsuccess = function() {
  console.log("Все пользователи:", request.result);
};
```

---

# 🔹 3. Поиск через индекс (`index().get()`)

Допустим, у нас в хранилище `users` есть индекс `emailIndex`, который индексирует поле `email`.  
(Индекс создаётся заранее в `onupgradeneeded`: `store.createIndex('emailIndex', 'email', { unique: true });`)

**Ищем пользователя по email:**

```javascript
const transaction = db.transaction(["users"], "readonly");
const store = transaction.objectStore("users");

// Берём индекс по полю email
const emailIndex = store.index("emailIndex");

// Ищем пользователя с конкретным email
const request = emailIndex.get("test@example.com");

request.onsuccess = function() {
  const user = request.result;
  console.log("Найден пользователь по email:", user);
};
```

---

# 🔹 4. Поиск всех записей через индекс (`index().getAll()`)

Например, если индекс по какому-то полю не уникальный (например, `cityIndex` по городу), и мы хотим всех пользователей из города:

```javascript
const transaction = db.transaction(["users"], "readonly");
const store = transaction.objectStore("users");

// Индекс по городу
const cityIndex = store.index("cityIndex");

// Получаем всех пользователей из "Moscow"
const request = cityIndex.getAll("Moscow");

request.onsuccess = function() {
  console.log("Пользователи из Москвы:", request.result);
};
```

---

# 🔹 5. Поиск по диапазону значений (через `IDBKeyRange`)

Например, все пользователи с `id` от 10 до 20:

```javascript
const transaction = db.transaction(["users"], "readonly");
const store = transaction.objectStore("users");

// Диапазон от 10 до 20 включительно
const range = IDBKeyRange.bound(10, 20);

const request = store.getAll(range);

request.onsuccess = function() {
  console.log("Пользователи с id от 10 до 20:", request.result);
};
```

---

# 📋 Итог

| Что ищем                          | Как делать                         |
|:-----------------------------------|:-----------------------------------|
| По ключу                           | `store.get(key)`                   |
| Все записи                        | `store.getAll()`                   |
| По индексу                         | `store.index('indexName').get(key)` |
| Все записи через индекс           | `store.index('indexName').getAll(key)` |
| Диапазон значений (ключ или индекс) | `store.getAll(IDBKeyRange.bound(...))` |

---

# 🎯 3. Можно ли делать `range`-поиск через индекс?

✅ Да! Причём это одно из главных преимуществ индексирования.

Можно задать **диапазон** через `IDBKeyRange`, и пройтись по индексированным значениям:

### Пример поиска по диапазону через индекс

```javascript
const transaction = db.transaction(["users"], "readonly");
const store = transaction.objectStore("users");

// Берём индекс по возрасту
const ageIndex = store.index("ageIndex");

// Создаём диапазон: возраст от 18 до 30 лет
const range = IDBKeyRange.bound(18, 30);

// Получаем всех пользователей в этом возрасте
const request = ageIndex.getAll(range);

request.onsuccess = function() {
  console.log("Пользователи 18-30 лет:", request.result);
};
```

---

# 📋 ИТОГО:

| Вопрос | Ответ |
|:------|:------|
| Как хранится индекс? | **B-Tree** (или B+Tree), оптимизированный для поиска |
| Как происходит поиск? | Быстрый логарифмический обход дерева |
| Можно ли искать по диапазону? | **Да**, через `IDBKeyRange` + индекс |

---
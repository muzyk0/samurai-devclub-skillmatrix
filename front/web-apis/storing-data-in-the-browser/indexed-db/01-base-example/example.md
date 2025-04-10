
Ниже приведён самый простой пример использования IndexedDB. Он включает два файла – **index.html** и **index.js**. В этом базовом примере мы:

1. Создаём или открываем базу данных (DB) с помощью `indexedDB.open`.
2. При необходимости (при первом создании или при обновлении версии) инициализируем структуру хранилища в обработчике `onupgradeneeded`.
3. Сохраняем одну запись в объектном хранилище.
4. Считываем эту запись по нажатию на кнопку.
[indexdb.theory.md](../indexdb.theory.md)
### Файл **index.html**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Пример IndexedDB</title>
</head>
<body>
  <h1>Минимальный пример IndexedDB</h1>

  <button id="save">Сохранить данные</button>
  <button id="get">Получить данные</button>

  <!-- Подключаем наш скрипт -->
  <script src="index.js"></script>
</body>
</html>
```

### Файл **index.js**

```javascript
let db; // глобальная переменная для хранения объекта базы данных

// Открываем (или создаём) базу данных "MyTestDatabase" версии 1
const request = indexedDB.open("MyTestDatabase", 1);

// Если при открытии БД произошла ошибка
request.onerror = function (event) {
  console.error("Ошибка при открытии базы данных:", event);
};

// Успешное открытие
request.onsuccess = function (event) {
  console.log("База данных открыта успешно!");
  db = event.target.result;
};

// Событие onupgradeneeded вызывается, если БД ещё не создана
// или если мы повышаем версию (и хотим что-то поменять в структуре).
request.onupgradeneeded = function (event) {
  let db = event.target.result;

  // Создаём объектное хранилище (object store), если оно ещё не создано
  // keyPath: "id" указывает поле, которое будет ключом для записей
  if (!db.objectStoreNames.contains("notes")) {
    db.createObjectStore("notes", { keyPath: "id" });
  }
};

// По нажатию на кнопку "Сохранить данные"
document.getElementById("save").addEventListener("click", function () {
  // Открываем транзакцию на чтение и запись (readwrite)
  let transaction = db.transaction(["notes"], "readwrite");
  let objectStore = transaction.objectStore("notes");

  // Добавим одну запись { id: 1, text: "Привет, IndexedDB!" }
  let addRequest = objectStore.add({ id: 1, text: "Привет, IndexedDB!" });

  // Обрабатываем результат операции сохранения
  addRequest.onsuccess = function () {
    console.log("Данные сохранены!");
  };
  addRequest.onerror = function (event) {
    console.error("Ошибка при сохранении:", event);
  };
});

// По нажатию на кнопку "Получить данные"
document.getElementById("get").addEventListener("click", function () {
  // Открываем транзакцию только на чтение (readonly)
  let transaction = db.transaction(["notes"], "readonly");
  let objectStore = transaction.objectStore("notes");

  // Извлекаем запись с ключом 1
  let getRequest = objectStore.get(1);

  getRequest.onsuccess = function () {
    if (getRequest.result) {
      console.log("Получены данные:", getRequest.result);
      // Например, выведем поле text в консоль
      console.log("Текст:", getRequest.result.text);
    } else {
      console.log("Запись с таким ключом не найдена.");
    }
  };
  getRequest.onerror = function (event) {
    console.error("Ошибка при чтении:", event);
  };
});
```

---

### Краткое пояснение

1. **Создание/открытие БД**:
   ```javascript
   const request = indexedDB.open("MyTestDatabase", 1);
   ```
    - Первый параметр — имя базы данных.
    - Второй параметр (необязательный) — версия БД. Если вы укажете версию больше текущей, у вас сработает `onupgradeneeded`, где можно изменять структуру БД.

2. **Обработчик `onupgradeneeded`**:
    - Срабатывает при первом создании БД или при повышении версии.
    - Здесь обычно создают **object store** (аналог таблицы) и индексы.

3. **Сохранение записи**:
   ```javascript
   let transaction = db.transaction(["notes"], "readwrite");
   let objectStore = transaction.objectStore("notes");
   objectStore.add({ id: 1, text: "Привет, IndexedDB!" });
   ```
    - Создаём транзакцию для объектного хранилища `"notes"` в режиме `readwrite`.
    - С помощью `objectStore.add()` добавляем новую запись.

4. **Чтение записи**:
   ```javascript
   objectStore.get(1);
   ```
    - Получаем запись по её ключу.
    - Так как в нашем случае `keyPath` установлен в `"id"`, в объектном хранилище ключом будет поле `id`.

Вот и всё — это базовый пример, демонстрирующий минимальную логику работы с IndexedDB. В следующих шагах можно усложнять функционал (добавить несколько полей, циклические добавления, поиск, индексы и т.д.).
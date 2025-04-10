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
    let addRequest = objectStore.add({ id: 1, text: "Привет, IndexedDB!" }); //  ❌если в объекте не будет id - то выкинет ошибку, так как это keyPath
    // let addRequest2 = objectStore.add({ id: 1, text: "Привет, IndexedDB!" }); // ❌ если добавить ещё раз айтем с таким же ключом, то будет ошибка: ConstraintError: Key already exists in the object store.
    // objectStore.put который или обновит существуюзщую запись или вставит новую, если id не существует

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
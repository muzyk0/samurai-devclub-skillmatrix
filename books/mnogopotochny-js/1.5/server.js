const vm = require('vm');
const ContextObject = vm.runInNewContext('Object');
console.log(Object === ContextObject);
console.log(new Object() instanceof ContextObject);
console.log(ContextObject.name);

// 2 Получить объекты из нового контекста можно с помощью функции runInNewContext.
// 3 Возвращается false, потому что, как и во фреймах браузера, Object внутри контексте – не то же самое,
//    что в главном контексте.
// 4 Аналогично instanceof возвращает false.
// 5 Как и раньше, у конструкторов имеется то же самое свойство name.
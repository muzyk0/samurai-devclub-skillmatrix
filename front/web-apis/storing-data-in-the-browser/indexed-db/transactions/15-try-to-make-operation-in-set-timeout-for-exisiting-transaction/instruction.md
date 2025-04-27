# IndexedDB и «жизнь» транзакции — краткий конспект ( `.md`)

## 1. Почему возникает `TransactionInactiveError`

> **Суть**: транзакция IndexedDB «жива» только пока ваш код находится внутри **одного прохода event-loop**.  
> Когда вы поставили `nodesStore.put(...)` в `setTimeout`/`setInterval` (задержка 1 с), к моменту вызова **транзакция уже закрылась** — движок её автоматически закоммитил / откатил. Любое новое обращение даёт
> ```
> TransactionInactiveError: transaction is closed
> ```

---

## 2. Как движок понимает, что «тик» закончился

1. `db.transaction(...)` создаёт объект-транзакцию и принимает запросы (`add / put / get …`) **пока выполняется текущий стек JS**.
2. Как только стек опустел и управление вернулось в event-loop, транзакция помечается **inactive** и авто-коммитится/ролбэкится.
3. Любой последующий вызов в той же транзакции (например из `setTimeout`, `Promise.then`, и т. д.) выбросит `TransactionInactiveError`.

> **Итого:** все операции нужно добавлять *внутри одного синхронного блока* до перехода event-loop к следующей задаче.

---

## 3. Эмуляция «одноразовой» транзакции на чистом JS

```javascript
/**
 * Объект «один тик — одно состояние».
 * Операции plus/minus разрешены только до конца текущего стека JS.
 */
function createSingleTickCalculator(initialValue = 0) {
  let value  = initialValue;
  let active = true;

  // После текущего стека JS выполнится микротаска ⇒ объект «замораживается».
  queueMicrotask(() => { active = false; });

  return {
    plus(n) {
      if (!active) throw new Error("Транзакция закрыта");
      value += n; return value;
    },
    minus(n) {
      if (!active) throw new Error("Транзакция закрыта");
      value -= n; return value;
    },
    getValue() { return value; }
  };
}

// --- использование ---
const calc = createSingleTickCalculator(10);
console.log(calc.plus(5));   // 15
console.log(calc.minus(2));  // 13

setTimeout(() => {
  try { calc.plus(10); }     // ❌ Transaction closed
  catch (e) { console.error(e.message); }
}, 1000);
```

<details>
<summary>Что происходит</summary>

1. Объект активен весь текущий стек → `plus`/`minus` работают.
2. `queueMicrotask` ставит «заморозку» в микротаску → она выполняется сразу после выхода из стека.
3. Через 1 с (`setTimeout`) объект уже неактивен → попытка изменить состояние кидает ошибку.
</details>

---

## 4. Почему `queueMicrotask` — это не «внутренний коммит» IndexedDB

* Спецификация IndexedDB лишь говорит: «коммит после возвращения в цикл событий».
* **Браузер** реализует это на C++-уровне собственной очередью работ, а не явным `queueMicrotask`.
* Поэтому даже если вы попробуете вставить запрос в *микротаску*, транзакция к тому моменту уже будет закрыта — точно так же, как и при `setTimeout`.

> **Вывод:** IndexedDB не опирается на JS-микротаски; она просто следует правилу «один стек → одна активная транзакция», контролируя это внутри движка.
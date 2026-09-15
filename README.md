# Тестове завдання на позицію Frontend Developer у Collaborator

Односторінковий застосунок пошуку авіаквитків за [макетом Figma](https://www.figma.com/file/UAxLeUjtV8d3U4CRnO79sR/Untitled?type=design&node-id=1%3A10&mode=design&t=NAgVyJvDhA7rHTCU-1).

Функціонал: фільтр за кількістю пересадок, три вкладки сортування і довантаження списку по 5 квитків.

**Демо:** [Live Demo](https://lisakirj.github.io/collaborator-test-task/)

## Стек

- React 19, TypeScript 6 — `strict`, `noUncheckedIndexedAccess`, без `any` та `@ts-ignore`.
- Redux Toolkit 2 + react-redux 9 — `createSlice`, `createAsyncThunk`, `createSelector`, типізовані хуки `useAppDispatch` / `useAppSelector`.
- Sass (SCSS) — `@use` / `@forward`, БЕМ. Без CSS-фреймворків, CSS-in-JS і CSS Modules; для умовних класів — `clsx`.
- Vite 8, Vitest 5, ESLint 10 з type-aware правилами `typescript-eslint`, Stylelint 17 зі `stylelint-config-standard-scss` і правилом для БЕМ.
- GitHub Actions -> GitHub Pages.

## Запуск

Потрібен Node.js `^22.13` або `>=24`.

```bash
npm ci
npm run dev          # http://localhost:5173/collaborator-test-task/
npm run build        # перевірка типів (tsc -b) + збірка в dist/
npm run preview      # локальний перегляд продакшн-збірки
npm run lint         # ESLint
npm run lint:styles  # Stylelint
npm test             # Vitest
```

## Структура

```
public/data/tickets.json      "база даних": 28 квитків, завантажується мережевим запитом
src/
  app/                        store (фабрика setupStore), типізовані хуки, App — розкладка сторінки
  features/
    tickets/                  типи, ticketsSlice (thunk завантаження), parseTickets (валідація), carriers
    filters/filtersSlice.ts   обрані значення кількості пересадок
    sort/sortSlice.ts         активне сортування
    pagination/               кількість видимих квитків
    selectors.ts              мемоізовані селектори: відфільтровані -> відсортовані -> видимі
  components/                 один компонент = один БЕМ-блок (Logo, StopsFilter, SortTabs, TicketList,
                              TicketCard, TicketSkeleton, StatusMessage, Button)
  utils/                      чисті функції: format, plural, filterTickets, sortTickets, ticket
  styles/                     _variables (токени з Figma), _mixins, _base (reset), main
  assets/                     ассети з Figma
  test/fixtures.ts            контрольний набір квитків T1–T6 з ТЗ
```

## Redux

```ts
{
  tickets:    { items, status: 'idle' | 'loading' | 'succeeded' | 'failed', error }
  filters:    { stops: StopsCount[] }   // лише обрані значення, "Всі" — похідний стан
  sort:       { by: 'cheapest' | 'fastest' | 'optimal' }
  pagination: { visibleCount: number }
}
```

Квитки тягне `fetchTickets` (`createAsyncThunk`) з `${import.meta.env.BASE_URL}data/tickets.json`, тож шлях працює і локально, і на GitHub Pages. 

Відповідь перевіряє `parseTickets`, тому в стор потрапляють лише валідні дані. `pagination` слухає дії фільтра й сортування через `isAnyOf` і скидає лічильник до 5. 

Селектори зібрані в ланцюжок `createSelector`: усі -> відфільтровані -> відсортовані -> видимі, тож "Показати ще" не перезапускає сортування.

## Фільтр і сортування

Кількість пересадок беру з `segments[0].stops.length` — за ТЗ вона однакова в обидва боки. 

У стані зберігаю лише масив обраних значень, а "Всі" обчислюю селектором: клік по ньому або обирає все, або знімає все. Якщо не обрано нічого, показується порожній стан.

## Свідомі рішення та відхилення від макета

1. **Час.** У макеті в усіх квитках "10:45 – 08:00" при різній тривалості. Тут прибуття обчислюється; час вильоту п'яти квитків з макета (10:45 / 11:20) збережено.
2. **Відступи.** Між вкладками і першим квитком у макеті 18px, між першим і другим квитком — 22px. Використано 20px скрізь.
3. **Центрування.** У макеті колонка контенту зміщена на 10px ліворуч від осі логотипа. Тут контент центровано.
4. **Логотип авіакомпанії** показано цілим, без запеченої тіні й скруглення. У макеті він обрізаний: видно лише "AIRLINE…".
5. **Скруглення.** Активна вкладка у Figma має радіус 6px, а решта елементів — 5px. Використано 5px скрізь.
6. **«HKG, JNB, JNB».** У 4-му квитку макета аеропорт повторюється в одному маршруті. У даних третя пересадка інша (DOH).
7. **Текст кнопки.** Якщо лишилося менше 5 квитків, кнопка показує реальну кількість з українською множиною: "Показати ще 3 квитки", "Показати ще 1 квиток". Це свідоме відхилення від тексту макета.
8. **Sticky-фільтр.** На десктопі фільтр лишається в полі зору під час прокручування довгого списку.

## Тести

`npm test` — 90 тестів: три сортування і фільтр на контрольному наборі T1–T6 з ТЗ, селектори й пагінація через справжній store, форматування (тривалість, множина, ціна, час у UTC незалежно від `TZ`), thunk завантаження (успіх, помилка, невалідні дані, повтор) і валідація `tickets.json` з інваріантом однакової кількості пересадок в обох сегментах.

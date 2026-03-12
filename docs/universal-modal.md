### UniversalModal API

`UniversalModal` — универсальный модальный компонент для форм. На вход получает описание полей (`FieldConfig[]`), начальные значения и колбэки для закрытия/сабмита.

```tsx
import UniversalModal from '@/app/components/UniversalModal'
import type { FieldConfig } from '@/interfaces/main'
```

### Пропсы

- **`open: boolean`**  
  Открыта ли модалка. Управляется родителем (контролируемый компонент).

- **`title: string`**  
  Заголовок модального окна.

- **`description?: string`**  
  Дополнительный текст под заголовком (опционально).

- **`fields: FieldConfig[]`**  
  Описание полей формы. Тип `FieldConfig` хранится в `src/interfaces/main.ts`.  
  Поддерживаемые `type`:
  - `'text' | 'number' | 'email' | 'date' | ...` — рендерятся как обычный `<input />`;
  - `'textarea'` — многострочный ввод;
  - `'select'` — выпадающий список (`options` обязательны);
  - `'time-picker'` — комбинированный выбор часа и минут (два `<select>`).

  Пример поля:

  ```ts
  const fields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Task title',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 3,
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    },
    {
      name: 'time',
      label: 'Time (24h)',
      type: 'time-picker',
      required: true,
    },
  ]
  ```

- **`initialValues: Record<string, string | number | null>`**  
  Начальные значения полей. Ключи должны совпадать с `field.name`.  
  При открытии модалки (`open === true`) форма сбрасывается к этим значениям.

  ```ts
  const initialValues = {
    title: 'My task',
    description: '',
    date: '2025-01-01',
    time: '09:00',
  }
  ```

- **`submitText?: string`** (по умолчанию `'Save'`)  
  Текст на кнопке сабмита.

- **`cancelText?: string`** (по умолчанию `'Cancel'`)  
  Текст на кнопке отмены.

- **`loading?: boolean`** (по умолчанию `false`)  
  Внешний флаг загрузки. Объединяется с внутренним состоянием сабмита (`isSubmitting`) в `isLoading`.  
  Если `true`, кнопка сабмита дизейблится и показывается спиннер.

- **`onSubmit: (data: Record<string, string | number | null>) => void`**  
  Колбэк сабмита формы. Вызывается после успешного `handleSubmit`.
  - `data` содержит пары `name → value` для всех полей;
  - значения всегда приведены к `string | number | null`.

  Важно: `UniversalModal` **не закрывает себя сам** после сабмита. Ответственность за:
  - обновление стора/состояния,
  - закрытие модалки (`open = false`),
    лежит на родителе.

- **`onClose: () => void`**  
  Вызывается:
  - при клике на кнопку Cancel;
  - при закрытии диалога по outside‑клику / ESC (через `onOpenChange` Radix Dialog).

### Жизненный цикл и поведение

- При изменении `open` с `false` → `true`:
  - эффект `useEffect` сбрасывает локальное состояние формы к `initialValues`;
  - можно повторно открывать модалку с другими начальными данными.

- При сабмите (`onSubmit`):
  - форма **не** очищается автоматически;
  - внешнему коду нужно:
    - обработать `data`,
    - по необходимости обновить `initialValues`,
    - сменить `open` на `false`.

### Пример использования

```tsx
const [open, setOpen] = useState(false)

const fields: FieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
]

const initialValues = {
  title: '',
  description: '',
}

return (
  <UniversalModal
    open={open}
    title="Create task"
    description="Fill in task details"
    fields={fields}
    initialValues={initialValues}
    submitText="Create"
    onClose={() => setOpen(false)}
    onSubmit={data => {
      // здесь создаём задачу
      // ...
      setOpen(false)
    }}
  />
)
```

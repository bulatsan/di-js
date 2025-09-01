## @bulatlib/di — минималистичный DI

Простой слой над `inversify` для декларативного описания зависимостей. Вы объявляете дерево провайдеров, один раз вызываете `bindAll()`, далее получаете экземпляры через `.get()`.

### Установка

```bash
npm i @bulatlib/di inversify
# или
yarn add @bulatlib/di inversify
# или
pnpm add @bulatlib/di inversify
# или
bun add @bulatlib/di inversify
```

### Быстрый старт

```ts
import { p, setup } from '@bulatlib/di';

class Api {
  ping() {
    return 'pong';
  }
}

class Service {
  constructor(private api: Api) {}
  run() {
    return this.api.ping();
  }
}

let di = setup({
  api: p(() => new Api()),
  service: p(() => new Service(di.api.get())),
});

// Привязываем все провайдеры (singleton)
di.bindAll();

// Используем
const service = di.service.get();
console.log(service.run()); // "pong"
```

### Вложенные модули и ключи

Ключи для `inversify` формируются автоматически из пути в объекте. По умолчанию корень — `di`.

```ts
let di = setup({
  services: {
    api: p(() => new Api()),
    svc: p(() => new Service(di.services.api.get())),
  },
});

di.bindAll();
// Ключи будут: "di.services.api" и "di.services.svc"
```

Можно переопределить корневой ключ и отследить процесс биндинга:

```ts
let di = setup(
  { api: p(() => new Api()) },
  {
    initialKey: 'app',
    onBind: (name) => console.log('bind', name),
  },
);

di.bindAll();
// bind app.api
```

### Подмена реализаций (тесты)

Для замены реализации не обязательно вызывать `bindAll()`. Можно привязать нужный провайдер вручную, передав альтернативный билдер:

```ts
let di = setup({
  api: p(() => new Api()),
});

// Переопределяем до получения экземпляра
di.api.bind(() => new MockApi());

const api = di.api.get();
```

### API

- `p(() => T)`: создать провайдер типа `T`.
- `setup(deps, { initialKey = 'di', onBind? })` → возвращает `deps` + метод `bindAll()`.
- `Provider.bind(builder?)`: привязать провайдер, опционально заменить билдер.
- `Provider.get()`: получить singleton-экземпляр.

Все провайдеры биндятся в `singleton`-области. Декораторы и `reflect-metadata` не требуются.

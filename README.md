## @bulatlib/di — A simple dependency injection container

### Install

```bash
npm i @bulatlib/di
# or
pnpm add @bulatlib/di
# or
bun add @bulatlib/di
```

### Quick start

```ts
import { p, init } from '@bulatlib/di';

const createApi = () => {
  return {
    ping: () => 'pong',
  };
};

const createService = (api: { ping: () => string } = di.api.get()) => {
  return {
    run: () => api.ping(),
  };
};

const di = init(
  {
    api: p(() => createApi()),
    service: p(() => createService()),
  },
  {
    onBind: (name) => console.log('binding:', name),
  },
);

// binding: di.service
// binding: di.api

console.log(di.service.get().run());
// pong
```

### Override in tests

You can rebind any provider before the first `.get()`:

```ts
let di = init({ api: p(() => new Api()) });
di.api.bind(() => new MockApi());
const api = di.api.get();
```

### API

- `p(() => T)`: create a provider of `T`.
- `init(deps, { initialKey = 'di', onBind? })` → returns initialized `deps`.
- `Provider.bind(builder?)`: bind with optional custom factory.
- `Provider.get()`: get a singleton instance.

Notes:

- All providers are singletons by default.
- No decorators or `reflect-metadata` are required.

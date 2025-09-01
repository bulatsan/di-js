## @bulatlib/di — tiny DI wrapper

Small convenience layer on top of `inversify` to declare providers as a plain object. Call `bindAll()` once, then use `.get()` to access singletons.

### Install

`inversify` is a peer dependency. Supported versions: `>=5 <8`.

```bash
npm i @bulatlib/di inversify
# or
pnpm add @bulatlib/di inversify
# or
bun add @bulatlib/di inversify
```

### Quick start

```ts
import { p, setup } from '@bulatlib/di';

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

const di = setup(
  {
    api: p(() => createApi()),
    service: p(() => createService()),
  },
  {
    onBind: (name) => console.log('binding:', name),
  },
);

di.bindAll();
// binding: di.service
// binding: di.api

console.log(di.service.get().run());
// pong
```

### Override in tests

You can rebind any provider before the first `.get()`:

```ts
let di = setup({ api: p(() => new Api()) });
di.api.bind(() => new MockApi());
const api = di.api.get();
```

### API

- `p(() => T)`: create a provider of `T`.
- `setup(deps, { initialKey = 'di', onBind? })` → returns `deps` plus `bindAll()`.
- `Provider.bind(builder?)`: bind with optional custom factory.
- `Provider.get()`: get a singleton instance.

Notes:

- All providers are singletons by default.
- No decorators or `reflect-metadata` are required.

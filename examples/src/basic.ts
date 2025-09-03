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

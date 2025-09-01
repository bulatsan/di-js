import { p, setup } from '@bulatlib/di';

const createApi = () => {
  return {
    ping: () => 'pong',
  };
};

const createMockApi = () => {
  return {
    ping: () => 'pong (mock)',
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

di.api.bind(() => createMockApi());
// binding: di.api

console.log(di.service.get().run());
// pong (mock)

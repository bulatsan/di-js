import { init, p } from '@bulatlib/di';

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

const di = init({
  api: p(() => createApi()),
  service: p(() => createService()),
});

di.api.bind(() => createMockApi());

di.service.get().run(); // pong (mock)

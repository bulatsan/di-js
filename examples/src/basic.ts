import { init, p } from '@bulatlib/di';

const createApi = () => {
  return {
    ping: () => 'pong',
  };
};

const createService = (api = di.api.get()) => {
  return {
    run: () => api.ping(),
  };
};

const di = init({
  api: p(() => createApi()),
  service: p(() => createService()),
});

di.service.get().run(); // pong

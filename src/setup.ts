import { Container } from 'inversify';

import { Provider } from './provider';

interface Options {
  initialKey?: string;
  onBind?: (name: string) => void;
}

export function setup<T extends object>(
  deps: T,
  { initialKey = 'di', onBind = () => {} }: Options = {},
): T & { bindAll: () => void } {
  const container = new Container();
  const bindings: Binding[] = [];

  const stack: Entry[] = [
    {
      key: initialKey,
      value: deps,
    },
  ];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) {
      break;
    }

    if (current.value instanceof Provider) {
      const provider = current.value;
      provider.setup(current.key, container, onBind);

      bindings.push({
        name: current.key,
        bind: () => provider.bind(),
      });

      continue;
    }

    for (const key in current.value) {
      const value = (current.value as Record<string, object>)[key] ?? {};

      stack.push({
        key: `${current.key}.${key}`,
        value: value,
      });
    }
  }

  return {
    ...deps,
    bindAll: () => {
      for (const binding of bindings) {
        binding.bind();
      }
    },
  };
}

interface Entry {
  key: string;
  value: object;
}

interface Binding {
  name: string;
  bind: () => void;
}

import { Container } from './container';

import { Provider } from './provider';

interface Options {
  initialKey?: string;
  onBind?: (name: string) => void;
}

export function init<T extends object>(
  tree: T,
  { initialKey = 'di', onBind = () => {} }: Options = {},
): T {
  const container = new Container();

  const stack: Entry[] = [
    {
      key: initialKey,
      value: tree,
    },
  ];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) {
      break;
    }

    if (current.value instanceof Provider) {
      const provider = current.value;
      provider.init(current.key, container, onBind);
      provider.bind();
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

  return tree;
}

interface Entry {
  key: string;
  value: object;
}

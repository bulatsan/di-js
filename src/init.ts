import { Container } from './container';
import { Provider } from './provider';

interface Options {
  initialKey?: string;
  onBind?: (name: string) => void;
}

export function init<T extends object>(
  tree: T,
  { initialKey = 'di', onBind = () => {} }: Options = {},
): T & { pick: Pick } {
  const container = new Container();

  const stack: {
    key: string;
    value: object;
  }[] = [
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

  Object.assign(tree, { pick });

  return tree as T & { pick: Pick };
}

type Pick = <T extends readonly { get: () => unknown }[]>(
  ...deps: T
) => {
  -readonly [P in keyof T]: T[P] extends { get: () => infer R } ? R : never;
};

function pick<T extends readonly { get: () => unknown }[]>(
  ...deps: T
): {
  -readonly [P in keyof T]: T[P] extends { get: () => infer R } ? R : never;
} {
  return deps.map((dep) => dep.get()) as {
    -readonly [P in keyof T]: T[P] extends { get: () => infer R } ? R : never;
  };
}

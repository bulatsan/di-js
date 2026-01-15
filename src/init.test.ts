import { describe, expect, it, vi } from 'vitest';
import { init } from './init';
import { p } from './provider';

describe('init', () => {
  it('walks deps tree and binds providers on bindAll', () => {
    const child = p(() => 'c');
    const root = { a: { b: child } };

    const onBind = vi.fn();

    const app = init(root, { initialKey: 'root', onBind });

    expect(onBind).toHaveBeenCalled();
    expect(app.a.b.get()).toBe('c');
  });

  it('pick returns resolved values from multiple providers', () => {
    const di = init({
      a: p(() => 'value-a'),
      b: p(() => 'value-b'),
      c: p(() => 42),
    });

    const result = di.pick(di.a, di.b, di.c);

    expect(result).toEqual(['value-a', 'value-b', 42]);
  });
});

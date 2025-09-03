import { expect, describe, it, vi } from 'vitest';

import { p } from './provider';
import { Container } from './container';

describe('Provider', () => {
  it('throws if used before init', () => {
    const provider = p(() => 1);

    expect(() => provider.get()).toThrow();
    expect(() => provider.bind()).toThrow();
  });

  it('binds and gets value through container', () => {
    const container = new Container();
    const onBind = vi.fn();

    const provider = p(() => ({ hello: 'world' }));
    provider.init('x', container, onBind);

    provider.bind();

    expect(onBind).toHaveBeenCalledWith('x');
    expect(provider.get()).toEqual({ hello: 'world' });
  });
});

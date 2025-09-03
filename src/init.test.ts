import { describe, expect, it, vi } from 'vitest';

import { p } from './provider';
import { init } from './init';

describe('init', () => {
  it('walks deps tree and binds providers on bindAll', () => {
    const child = p(() => 'c');
    const root = { a: { b: child } };

    const onBind = vi.fn();

    const app = init(root, { initialKey: 'root', onBind });

    expect(onBind).toHaveBeenCalled();
    expect(app.a.b.get()).toBe('c');
  });
});

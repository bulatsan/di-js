import { describe, expect, it } from 'vitest';

import { Container } from './container';

describe('Container', () => {
  it('binds and gets a dependency singleton instance', () => {
    const container = new Container();

    let created = 0;
    container.bind('value', () => {
      created += 1;
      return { n: created };
    });

    const a = container.get<{ n: number }>('value');
    const b = container.get<{ n: number }>('value');

    expect(a).toBe(b);
    expect(a.n).toBe(1);
  });

  it('throws when provider not found', () => {
    const container = new Container();

    expect(() => container.get('missing')).toThrow();
  });
});

import type { Container } from './container';

export function p<T>(builder: () => T): Provider<T> {
  return new Provider(builder);
}

export class Provider<T> {
  private name?: string;
  private container?: Container;
  private onBind?: (name: string) => void;

  private builder: () => T;

  constructor(defaultBuilder: () => T) {
    this.builder = defaultBuilder;
  }

  init(name: string, container: Container, onBind: (name: string) => void): void {
    this.name = name;
    this.container = container;
    this.onBind = onBind;
  }

  bind(builder: () => T = this.builder): void {
    if (!this.name || !this.container) {
      throw new Error('Provider is not initialized');
    }

    this.onBind?.(this.name);
    this.container.bind<T>(this.name, builder);
  }

  get(): T {
    if (!this.name || !this.container) {
      throw new Error('Provider is not initialized');
    }

    return this.container.get<T>(this.name);
  }
}

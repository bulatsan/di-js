import { Container } from 'inversify';

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

  setup(
    name: string,
    container: Container,
    onBind: (name: string) => void,
  ): void {
    this.name = name;
    this.container = container;
    this.onBind = onBind;
  }

  bind(builder: () => T = this.builder): void {
    if (!this.name || !this.container) {
      throw new Error('Provider not setup');
    }

    this.onBind?.(this.name);

    this.container
      .rebindSync<T>(this.name)
      .toDynamicValue(builder)
      .inSingletonScope();
  }

  get(): T {
    if (!this.name || !this.container) {
      throw new Error('Provider not setup');
    }

    return this.container.get<T>(this.name);
  }
}

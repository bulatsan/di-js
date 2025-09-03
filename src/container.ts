export class Container {
  private deps: Map<
    string,
    {
      builder: () => unknown;
      value: unknown | null;
    }
  > = new Map();

  bind<T>(name: string, builder: () => T): void {
    this.deps.set(name, {
      builder,
      value: null,
    });
  }

  get<T>(name: string): T {
    const dep = this.deps.get(name);

    if (!dep) {
      throw new Error(`Dependency ${name} not found`);
    }

    if (dep.value === null) {
      dep.value = dep.builder();
    }

    return dep.value as T;
  }
}

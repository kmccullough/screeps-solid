export type DependencyManagerFactory<Dependency, DependencyConstructor>
  = (
    dependency: DependencyConstructor,
    dm: DependencyManager<Dependency, DependencyConstructor>
  ) => Dependency;

export class DependencyManager<Dependency, DependencyConstructor = any> {

  private instances: { [key: string]: Dependency } = {};

  constructor(
    private factory?: DependencyManagerFactory<Dependency, DependencyConstructor>,
    private dependencies: { [key: string]: Dependency | DependencyConstructor } = {}
  ) {

  }

  setFactory(factory: DependencyManagerFactory<Dependency, DependencyConstructor>): this {
    this.factory = factory;
    return this;
  }

  registerDependencies(dependencies: { [key: string]: Dependency | DependencyConstructor }): this {
    Object.keys(dependencies).forEach(name => {
      this.dependencies[name] = dependencies[name];
    });
    return this;
  }

  get(name: string): Dependency | undefined {
    let dependency = this.dependencies[name];
    if (dependency && this.factory) {
      let instance = this.instances[name];
      if (!instance) {
        instance = this.instances[name]
          = this.factory(
            dependency as DependencyConstructor,
            this
          );
      }
      dependency = instance;
    }
    return dependency as Dependency;
  }

}

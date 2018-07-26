/**
 * Note: Any mixin added here must also have its signature copied to types.d.ts
 */
_.mixin({

  castArray(a: any | any[]): any[] {
    return _.isArray(a) ? a : arguments.length ? [a] : [];
  }

});

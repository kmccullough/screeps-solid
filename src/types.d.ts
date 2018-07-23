// type shim for nodejs' `require()` syntax
// for stricter node.js typings, remove this and install `@types/node`
declare const require: (module: string) => any;

// add your custom typings here

// Lodash mixins aren't recognized after _.mixin,
// so they must be forward declared here.
declare namespace _ {
  interface LoDashStatic {

    castArray(a: any | any[]): any[];

  }
}

declare interface CreepMemory {
  state?: string;
  [name: string]: any;
}
declare interface FlagMemory { [name: string]: any; }
declare interface SpawnMemory { [name: string]: any; }
declare interface RoomMemory { [name: string]: any; }

// Lodash filter also takes object or string and even Screeps advertises this,
// but the @types/screeps library is missing the right types in a few places.
interface FilterPredicate<K extends FindConstant> {
  filter?: FilterFunction<K> | object | string;
}

declare interface RoomPosition {
  findClosestByPath<K extends FindConstant>(
    type: K, opts?: FindPathOpts & FilterPredicate<K> & { algorithm?: string }
  ): FindTypes[K] | null;
  findClosestByPath<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES,
    opts?: FindPathOpts & FilterPredicate<FIND_STRUCTURES> & { algorithm?: string }
  ): T | null;
}

declare interface Room {
  find<K extends FindConstant>(type: K, opts?: FilterPredicate<K>): Array<FindTypes[K]>;
  find<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES, opts?: FilterPredicate<FIND_STRUCTURES>
  ): T[];
}

import { StateMachine } from '@src/state/state-machine';

export interface StateConstructor {
  // Derived State must have static state property
  state: string;
  new (): State;
}

export abstract class State {
  // Instance copy of state name
  state: string;
  constructor() {
    // Copy static property to instance
    this.state = (this.constructor as StateConstructor).state;
  }
  // Execute derived state
  abstract execute(stateMachine: StateMachine): void;
}

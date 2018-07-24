import { StateMachine } from '@src/state/state-machine';

export interface StateConstructor {
  state: string;
  new (): State;
}

export abstract class State {
  state: string;
  constructor() {
    this.state = (this.constructor as StateConstructor).state;
  }
  abstract execute(stateMachine: StateMachine): void;
}

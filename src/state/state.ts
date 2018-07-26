import { StateMachine } from '@src/state/state-machine';

export interface Stateful {
  state: string;
}

export interface StateConstructor extends Stateful {
  new (): State;
}

export abstract class State implements Stateful {

  state: string;

  constructor() {
    // Copy static property to instance
    this.state = (this.constructor as StateConstructor).state;
  }

  /**
   * Enter state
   * Make sure to call super.enter(stateMachine)
   * @param {StateMachine<State>} stateMachine
   */
  enter<T extends State>(stateMachine: StateMachine<T>): void {}

  /**
   * Execute state
   * Make sure to call super.execute(stateMachine)
   * @param {StateMachine<State>} stateMachine
   */
  execute<T extends State>(stateMachine: StateMachine<T>): void {}

  /**
   * Exit state
   * Make sure to call super.exit(stateMachine)
   * @param {StateMachine<State>} stateMachine
   */
  exit<T extends State>(stateMachine: StateMachine<T>): void {}

}

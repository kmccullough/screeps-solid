import { DependencyManager } from '@src/dependency-manager';
import { State, Stateful } from '@src/state/state';
import { StateMachine } from '@src/state/state-machine';
import { Executor } from '@src/util/executor';

export class StateExecutor<StateType extends State> implements Stateful, Executor {

  /**
   * Instantiate StateExecutor
   * @param {StateMachine<State>} [stateMachine] StateMachine to extend
   * @param {DependencyManager<State>} [states] State factories for
   * transition enter/exit actions and state execute action
   */
  constructor(
    public stateMachine: StateMachine<StateType>,
    public states: DependencyManager<StateType>
  ) {

  }

  get state(): string {
    return this.stateMachine.state;
  }

  /**
   * Execute current state
   * @returns {this}
   */
  execute(): this {
    const initialState = this.state;
    const currentState = this.states.get(this.state);
    if (!currentState) {
      return this;
    }
    currentState.execute(this.stateMachine);
    if (this.state !== initialState) {
      currentState.exit(this.stateMachine);
      const nextState = this.states.get(this.state);
      if (nextState) {
        nextState.enter(this.stateMachine);
      }
    }
    return this;
  }

}

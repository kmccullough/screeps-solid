import { State } from '@src/state/state';
import { StateMachine } from '@src/state/state-machine';

export interface CreepStateConstructor {
  state: string;
  new (creep: Creep): CreepState;
}

export abstract class CreepState extends State {

  constructor(
    public creep: Creep
  ) {
    super();
  }

  /**
   * Execute state
   * Make sure to call super.execute(stateMachine)
   * @param {StateMachine<State>} stateMachine
   */
  enter<T extends State>(stateMachine: StateMachine<T>): void {
    super.execute(stateMachine);
    // Store creep current state in creep memory
    this.creep.memory.state = stateMachine.state;
  }

}

import { State } from '@src/state/state';
import { StateMachine } from '@src/state/state-machine';

export type Predicate = (() => boolean) | undefined;
export type OnStabilize = (() => void) | undefined;

export class StateStabilizer<StateType extends State> {

  private predicate: Predicate = undefined;
  private stabilizeCb: OnStabilize = undefined;

  constructor(
    public stateMachine: StateMachine<StateType>
  ) {
  }

  /**
   * Set predicate which returns falsey to stop execution
   * @param {() => boolean} [predicate] Returns falsey to stop execution
   * @returns {this}
   */
  continueWhile(predicate?: Predicate): this {
    this.predicate = predicate;
    return this;
  }

  /**
   * Callback when execution is complete (predicate returns falsey)
   * @param {() => void} cb
   * @returns {this}
   */
  onStabilize(cb?: OnStabilize): this {
    this.stabilizeCb = cb;
    return this;
  }

  /**
   * Execute current state, if DependencyManager present
   * @returns {this}
   */
  execute(): this {
    let firstRun = true;
    while (this.predicate ? this.predicate() : firstRun) {
      this.stateMachine.execute();
      firstRun = false;
    }
    if (this.stabilizeCb) {
      this.stabilizeCb();
    }
    return this;
  }

}

import { State, Stateful } from '@src/state/state';
import { Executor } from '@src/util/executor';

export type Predicate = (() => boolean) | undefined;
export type OnStabilize = (() => void) | undefined;

export class StateStabilizer<StateType extends State> implements Stateful, Executor {

  private predicate: Predicate = undefined;
  private stabilizeCb: OnStabilize = undefined;

  constructor(
    public stateMachine: Executor & Stateful
  ) {

  }

  get state(): string {
    return this.stateMachine.state;
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

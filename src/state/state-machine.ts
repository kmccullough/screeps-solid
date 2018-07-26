import { DependencyManager } from '@src/dependency-manager';
import { State } from '@src/state/state';

export interface Transition<TransitionType = string, StateType = string> {
  name: string;
  from?: string;
  to: string;
}

export type StateName = string | null | undefined;

export const StateUndefined = 'undefined';

export class StateMachine<StateType extends State> {

  public state: string;
  private transitions: { [key: string]: { name: string, from: { [key: string]: string } } } = {};

  // Dynamic transition methods
  [key: string]: (() => void) | any;

  /**
   * Instantiate StateMachine
   * @param {string} [state] Initial state name
   * @param {Transition[]} transitions Mappings of transition to/from states
   * @param {DependencyManager<State>} [states] State factories for
   * transition enter/exit actions and state execute action
   */
  constructor(
    state: StateName,
    transitions: Transition[],
    public states?: DependencyManager<StateType>
  ) {
    this.state = state || StateUndefined;
    this.registerTransition(...transitions);
  }

  /**
   * Register a transition from some state to another
   * @param {Transition} transitions Any number of new transitions
   * @returns {this}
   */
  registerTransition(...transitions: Transition[]): this {
    transitions.forEach(transition => {
      // Create transition method
      this[transition.name] = this[transition.name]
        || (() => this.transition(transition.name));
      // Get stored transitions for transition name
      const t = this.transitions[transition.name]
        = this.transitions[transition.name]
        || { name: transition.name };
      // Get hash of transition sources
      t.from = t.from || {};
      // Set transition destination for given sources
      _.castArray(transition.from)
        .forEach((from: string) => {
          t.from[from || 'any'] = transition.to;
        });
    });
    return this;
  }

  /**
   * Gives expected state if given transition is executed on current state
   * @param {string} transition Transition to translate
   * @param {string|null} [currentState] Optional explicit current state
   * @returns {string} State expected after transition
   */
  stateFromTransition(transition: string, currentState?: string): string | null {
    const t = this.transitions[transition || 'any'];
    const expectedState = t.from[currentState || this.state] || t.from.any;
    return expectedState || null;
  }

  /**
   * Execute transition of given name
   * @param {string} name Name of transition to execute
   * @returns {this}
   */
  transition(name: string): this {
    const state = this.stateFromTransition(name);
    if (state) {
      this.transitionTo(state);
    }
    return this;
  }

  /**
   * Transition to the given state name
   * @param {string} state
   * @param {boolean} forceTransition
   * @returns {this}
   */
  transitionTo(state: string, forceTransition: boolean = false): this {
    if (this.state !== state || forceTransition) {
      if (this.states) {
        const stateInstance = this.states.get(this.state);
        if (stateInstance) {
          stateInstance.exit(this as any);
        }
      }
      this.state = state;
      if (this.states) {
        const stateInstance = this.states.get(this.state);
        if (stateInstance) {
          stateInstance.enter(this as any);
        }
      }
    }
    return this;
  }

  /**
   * Execute current state, if DependencyManager present
   * @returns {this}
   */
  execute(): this {
    if (this.states) {
      const stateInstance = this.states.get(this.state);
      if (stateInstance) {
        stateInstance.execute(this as any);
      }
    }
    return this;
  }

  /**
   * Execute states while predicate returns truthy, if DependencyManager present
   * @param {(sm: this) => boolean} predicate Returns falsey to stop execution
   * @returns {this}
   */
  executeWhile(predicate: (sm: this) => boolean): this {
    const state = this.state;
    while (predicate(this)) {
      this.execute();
    }
    if (this.state !== state) {
      console.log(this.state);
    }
    return this;
  }

}

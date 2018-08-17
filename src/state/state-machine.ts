import { State } from '@src/state/state';

export interface Transition<TransitionType = string, StateType = string> {
  name: string;
  from?: string;
  to: string;
}

export type StateName = string | null | undefined;

export const StateUndefined = 'undefined';

export class StateMachine<StateType extends State> {

  private _state: string = StateUndefined;
  private transitions: { [key: string]: { name: string, from: { [key: string]: string } } } = {};

  // Dynamic transition methods
  [key: string]: (() => void) | any;

  /**
   * Instantiate StateMachine
   * @param {string} [state] Initial state name
   * @param {Transition[]} transitions Mappings of transition to/from states
   */
  constructor(
    state: StateName,
    transitions: Transition[]
  ) {
    this.transitionTo(state || StateUndefined);
    this.registerTransition(...transitions);
  }

  get state(): string {
    return this._state;
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
    let expectedState;
    const t = this.transitions[transition || 'any'];
    if (t) {
      expectedState = t.from[currentState || this.state]
        || t.from.any;
    }
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
   * @returns {this}
   */
  transitionTo(state: string): this {
    this._state = state;
    return this;
  }

}

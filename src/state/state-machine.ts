import { DependencyManager } from '@src/dependency-manager';
import { StateFactory } from '@src/state/state-factory';

export interface Transition<TransitionType = string, StateType = string> {
  name: string;
  from?: string;
  to: string;
}

export class StateMachine {

  // Dynamic transition methods
  [key: string]: any;

  constructor(
    public state: string,
    transitions: Transition[],
    states?: DependencyManager<StateFactory>
  ) {
    this.registerTransition(...transitions);
    this.transitionTo(state, true);
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
      this.transitions = this.transitions || {};
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
    this.state = state;
    return this;
  }

}

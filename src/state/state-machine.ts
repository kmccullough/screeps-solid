export type StateName = string;
export type TransitionName = string;

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

export interface StateMachineTransitionConfig {
  name: TransitionName;
  from?: StateName;
  to: StateName;
}

export interface StateMachineConfig {
  init: string;
  transitions: StateMachineTransitionConfig[];
}

export class StateMachine {

  // Current state
  state: string;

  // Dynamic transition methods
  [key: string]: any;

  constructor(config: StateMachineConfig) {
    this.registerTransition(...config.transitions);
    this.enter(this.state = config.init);
  }

  registerTransition(...transitions: StateMachineTransitionConfig[]) {
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
        .forEach((from: StateName) => {
          t.from[from || 'any'] = transition.to;
        });
    });
  }

  transition(name: TransitionName) {
    const transition = this.transitions[name || 'any'];
    const to = transition.from[this.state]
      || transition.from.any;
    if (to) {
      this.enter(to);
    }
  }

  enter(state: StateName) {
    this.state = state;
  }

}

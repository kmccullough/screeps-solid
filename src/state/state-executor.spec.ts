import { DependencyManager } from '@src/dependency-manager';
import { State } from '@src/state/state';
import { StateExecutor } from '@src/state/state-executor';
import { StateMachine } from '@src/state/state-machine';

describe('StateExecutor', () => {

  it('should give state of stateMachine', () => {
    const sm = new StateMachine('initial-state', []);
    const dm = new DependencyManager<State>();
    const se = new StateExecutor(sm, dm);
    expect(se.state).toBe('initial-state');
    sm.transitionTo('new-state');
    expect(se.state).toBe('new-state');
  });

  it('should not execute unknown state', () => {
    const sm = new StateMachine('initial-state', []);
    const dm = new DependencyManager<State>();
    const se = new StateExecutor(sm, dm);
    expect(se.state).toBe('initial-state');
    sm.transitionTo('new-state');
    expect(se.state).toBe('new-state');
  });

});

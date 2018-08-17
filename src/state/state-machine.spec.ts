import { StateMachine } from '@src/state/state-machine';

describe('StateMachine', () => {

  describe('initially after construction', () => {

    it('should be in the given state', () => {
      const sm = new StateMachine(
        'initial-state',
        []
      );
      expect(sm.state).toBe('initial-state');
    });

    it('should create dynamic transition methods', () => {
      const sm = new StateMachine(
        'initial-state',
        [
          { name: 'run',  to: 'running' },
          { name: 'jump', to: 'jumping' },
          { name: 'fly',  to: 'flying' },
        ]
      );
      expect(sm.run).toEqual(jasmine.any(Function));
      expect(sm.jump).toEqual(jasmine.any(Function));
      expect(sm.fly).toEqual(jasmine.any(Function));
    });

  });

  it('should transition to given state directly', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    );
    sm.transitionTo('jumping');
    expect(sm.state).toBe('jumping');
    sm.transitionTo('running');
    expect(sm.state).toBe('running');
    sm.transitionTo('swimming');
    expect(sm.state).toBe('swimming');
  });

  it('should give expected state for given transition without actually changing state', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    );
    expect(
      sm.stateFromTransition('jump')
    ).toBe('jumping');
    expect(sm.state).toBe('initial-state');
    expect(
      sm.stateFromTransition('run')
    ).toBe('running');
    expect(sm.state).toBe('initial-state');
    expect(
      sm.stateFromTransition('fly')
    ).toBe('flying');
    expect(sm.state).toBe('initial-state');
  });

  it('should give null state for unknown transition without actually changing state', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    );
    expect(
      sm.stateFromTransition('swim')
    ).toBeNull();
    expect(sm.state).toBe('initial-state');
  });

  it('should give null state for invalid transition without actually changing state', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
        { name: 'swim', from: 'other-state', to: 'swimming' },
      ]
    );
    expect(
      sm.stateFromTransition('swim')
    ).toBeNull();
    expect(sm.state).toBe('initial-state');
    expect(
      sm.stateFromTransition('swim', 'other-state')
    ).toBe('swimming');
    expect(sm.state).toBe('initial-state');
  });

  it('should transition states through given transition', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    );
    sm.transition('jump');
    expect(sm.state).toBe('jumping');
    sm.transition('run');
    expect(sm.state).toBe('running');
    sm.transition('fly');
    expect(sm.state).toBe('flying');
  });

  it('should not transition states through unknown transition', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    );
    sm.transition('swim');
    expect(sm.state).toBe('initial-state');
  });

  it('should not transition states through invalid transition', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
        { name: 'swim', from: 'other-state', to: 'swimming' },
      ]
    );
    sm.transition('swim');
    expect(sm.state).toBe('initial-state');
    sm.transitionTo('other-state');
    sm.transition('swim');
    expect(sm.state).toBe('swimming');
  });

  it('should transition to given state using dynamic transition method', () => {
    const sm = new StateMachine(
      'initial-state',
      [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    );
    sm.jump();
    expect(sm.state).toBe('jumping');
    sm.run();
    expect(sm.state).toBe('running');
    sm.fly();
    expect(sm.state).toBe('flying');
  });

});

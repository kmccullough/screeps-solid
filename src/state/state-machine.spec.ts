import { StateMachine } from '@src/state/state-machine';

describe('StateMachine', () => {

  describe('initially after construction', () => {

    it('should be in the given state', () => {
      const sm = new StateMachine({
        init: 'initial-state',
        transitions: []
      });
      expect(sm.state).toBe('initial-state');
    });

    it('should create dynamic transition methods', () => {
      const sm = new StateMachine({
        init: 'initial-state',
        transitions: [
          { name: 'run',  to: 'running' },
          { name: 'jump', to: 'jumping' },
          { name: 'fly',  to: 'flying' },
        ]
      });
      expect(sm.run).toEqual(jasmine.any(Function));
      expect(sm.jump).toEqual(jasmine.any(Function));
      expect(sm.fly).toEqual(jasmine.any(Function));
    });

  });

  it('should transition to given state', () => {
    const sm = new StateMachine({
      init: 'initial-state',
      transitions: [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    });
    sm.transition('jump');
    expect(sm.state).toBe('jumping');
    sm.transition('run');
    expect(sm.state).toBe('running');
    sm.transition('fly');
    expect(sm.state).toBe('flying');
  });

  it('should transition to given state using dynamic transition method', () => {
    const sm = new StateMachine({
      init: 'initial-state',
      transitions: [
        { name: 'run',  to: 'running' },
        { name: 'jump', to: 'jumping' },
        { name: 'fly',  to: 'flying' },
      ]
    });
    sm.jump();
    expect(sm.state).toBe('jumping');
    sm.run();
    expect(sm.state).toBe('running');
    sm.fly();
    expect(sm.state).toBe('flying');
  });

});

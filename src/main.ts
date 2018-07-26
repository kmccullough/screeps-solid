// When compiling TS to JS and bundling with rollup, the line numbers and file
// names in error messages change. This utility uses source maps to get the line
// numbers and file names of the original, TS source code.
import { ErrorMapper } from 'utils/ErrorMapper';

import 'mixins/lodash';

import { CreepState } from '@src/state/creep/creep-state';
import { creepStateTransitions, defaultCreepState } from './config/config';
import { creepStates } from './state/creep/creep-states';

import { DependencyManager } from '@src/dependency-manager';
import { CreepFacade } from '@src/facade/creep/creep';
import { SpawnerFacade } from '@src/facade/spawner';
import { StateStabilizer } from '@src/state/state-stabilizer';
import { StateMachine } from 'state/state-machine';

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  const spawners = SpawnerFacade.findSpawners();
  // Just constantly create creeps at all spawners
  spawners.forEach(spawner => {
    new SpawnerFacade(spawner)
      .createCreep([WORK, MOVE, CARRY]);
  });

  const creeps = CreepFacade.findCreeps();
  creeps.forEach(creepObject => {
    const creep = new CreepFacade(creepObject);

    // Nothing to do while spawning
    if (creep.isSpawning()) {
      return;
    }

    // Collection of CreepState implementations
    const states = new DependencyManager<CreepState>(
      StateClass => new StateClass(creepObject),
      creepStates
    );

    const stateMachine = new StateMachine(
      // Current state or undefined
      creep.getState(),
      // Transition to state mappings
      creepStateTransitions,
      // State implementations
      states
    );
    // Enter initial state, if needed
    if (!creep.getState()) {
      stateMachine.transitionTo(
        defaultCreepState
      );
    }

    creep.setBusy(false);

    const startState = stateMachine.state;
    let firstRun = true;
    const stateStabilizer = new StateStabilizer(stateMachine);
    stateStabilizer
      .continueWhile(() => {
        const looped = !firstRun
          && stateMachine.state === startState;
        firstRun = false;
        return !creep.isBusy() && !looped;
      })
      .onStabilize(() => {
        if (stateMachine.state !== startState) {
          console.log(stateMachine.state);
        }
      })
      .execute();

  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});

// When compiling TS to JS and bundling with rollup, the line numbers and file
// names in error messages change. This utility uses source maps to get the line
// numbers and file names of the original, TS source code.
import { ErrorMapper } from 'util/ErrorMapper';

import 'mixin/lodash';

import { log } from 'util/log';

import { CreepState } from '@src/state/creep/creep-state';
import { creepStateTransitions, defaultCreepState } from './config/config';
import { creepStates } from './state/creep/creep-states';

import { DependencyManager } from '@src/dependency-manager';
import { CreepFacade } from '@src/facade/creep/creep';
import { SpawnerFacade } from '@src/facade/spawner';
import { StateExecutor } from '@src/state/state-executor';
import { StateStabilizer } from '@src/state/state-stabilizer';
import { StateMachine } from 'state/state-machine';

export const loop = ErrorMapper.wrapLoop(() => {
  log.log(`Current game tick is ${Game.time}`);
  log.logAt('tick', `Current game tick is ${Game.time}`);

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

    // Transition to different states
    const stateMachine = new StateMachine<CreepState>(
      // Current state or undefined
      creep.getState(),
      // Transition to state mappings
      creepStateTransitions
    );
    // Enter initial state, if needed
    if (!creep.getState()) {
      stateMachine.transitionTo(
        defaultCreepState
      );
    }

    // Executes State enter/execute/exit methods on state changes
    const stateExecutor = new StateExecutor(
      stateMachine,
      // State implementations
      states
    );

    // TODO: Might be able to skip busy creeps
    creep.setBusy(false);

    // Stabilize creep state following state logic
    // until creep busy or sent to first state again
    const startState = stateMachine.state;
    let firstRun = true;
    const stateStabilizer = new StateStabilizer(
      stateExecutor
    );
    stateStabilizer
      .continueWhile(() => {
        const looped = !firstRun
          && stateMachine.state === startState;
        firstRun = false;
        return !creep.isBusy() && !looped;
      })
      .onStabilize(() => {
        // Output creep state if changed this tick
        if (stateMachine.state !== startState) {
          log.logAt('creeps', stateMachine.state);
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

  log.dump();

});

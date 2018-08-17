// When compiling TS to JS and bundling with rollup, the line numbers and file
// names in error messages change. This utility uses source maps to get the line
// numbers and file names of the original, TS source code.
import { ErrorMapper } from 'util/ErrorMapper';

import 'mixin/lodash';

import { logger } from 'debug/logger';

import { CreepState } from '@src/state/creep/creep-state';
import { creepStateTransitions, defaultCreepState } from './config/config';
import { creepStates } from './state/creep/creep-states';

import { DependencyManager } from '@src/dependency-manager';
import { CreepFacade } from '@src/facade/creep/creep';
import { SpawnerFacade } from '@src/facade/spawner';
import { StateExecutor } from '@src/state/state-executor';
import { StateStabilizer } from '@src/state/state-stabilizer';
import { MeanAverage } from '@src/util/average';
import { StateMachine } from 'state/state-machine';

export const loop = ErrorMapper.wrapLoop(() => {

  const creepCount = CreepFacade.findCreeps().length;

  Memory.maximums = Memory.maximums || {};
  Memory.maximums.ticks = Memory.maximums.ticks || 0;
  ++Memory.maximums.ticks;
  Memory.maximums.deadCreeps = Memory.maximums.deadCreeps || 0;
  Memory.maximums.creeps
    = Math.max(Memory.maximums.creeps || 0, creepCount);
  Memory.maximums.energy = Memory.maximums.energy
    || 0;

  Memory.averages = Memory.averages || {};
  Memory.averages.creeps = Memory.averages.creeps || 0;
  Memory.averages.creeps
    = new MeanAverage(
      Memory.averages.creeps,
      Memory.maximums.ticks
    ).add(creepCount).value();
  Memory.averages.energy = Memory.averages.energy || 0;
  Memory.averages.energy
    = new MeanAverage(
    Memory.averages.energy,
    Memory.maximums.ticks
  ).add(Memory.maximums.energy).value();

  Memory.per100 = Memory.per100 || {};
  Memory.per100.spawns = Memory.per100.spawns || {
    current: 0,
    average: 0,
    maximum: 0,
  };
  Memory.per100.energy = Memory.per100.energy || {
    current: 0,
    average: 0,
    maximum: 0,
  };
  Memory.per100.tick = Memory.per100.tick
    || Memory.maximums.ticks;
  Memory.per100.ticks = Memory.maximums.ticks - Memory.per100.tick;
  Memory.maximums.ticks100 = Memory.maximums.ticks100
    || 0;
  Memory.per100.spawns.maximum = Math.max(
    Memory.per100.spawns.maximum,
    Memory.per100.spawns.current
  );
  Memory.per100.energy.maximum = Math.max(
    Memory.per100.energy.maximum,
    Memory.per100.energy.current
  );
  if (Memory.per100.ticks >= 100) {
    Memory.per100.tick = Memory.maximums.ticks;
    Memory.per100.ticks = 0;
    ++Memory.maximums.ticks100;
    Memory.per100.spawns.average
      = new MeanAverage(
      Memory.per100.spawns.average,
      Memory.maximums.ticks100
    ).add(Memory.per100.spawns.current).value();
    Memory.per100.spawns.current = 0;
    Memory.per100.energy.average
      = new MeanAverage(
      Memory.per100.energy.average,
      Memory.maximums.ticks100
    ).add(Memory.per100.energy.current).value();
    Memory.per100.energy.current = 0;
  }

  const logField = (label: string, value: any) =>
    `<i>${label}</i>: <b>${value}</b>`;

  logger
    .logAt('summary', 'Screep SOLID')
    .logAt('counts',
      '<b>Creeps</b>:',
      logField('Qty', creepCount),
      logField('Avg', Math.floor(Memory.averages.creeps)),
      logField('Max', Memory.maximums.creeps),
      logField('RIP', Memory.maximums.deadCreeps),
    )
    .logAt('counts',
      '<b>Spawns (per 100t)</b>:',
      logField('Qty', Memory.per100.spawns.current),
      logField('Avg', Math.floor(Memory.per100.spawns.average)),
      logField('Max', Memory.per100.spawns.maximum),
    )
    .logAt('counts',
      '<b>Energy</b>:',
      logField('Qty', Memory.maximums.energy),
      logField('Avg', Math.floor(Memory.averages.energy)),
      logField('Max', Memory.maximums.energy),
    )
    .logAt('counts',
      '<b>Energy (per 100t)</b>:',
      logField('Qty', Memory.per100.energy.current),
      logField('Avg', Math.floor(Memory.per100.energy.average)),
      logField('Max', Memory.per100.energy.maximum),
    )
    .logAt('tick', `${Memory.maximums.ticks100}:${('0' + Memory.per100.ticks).slice(-2)}`)
    .logAt('test', '1')
    .logAt('test', '2')
    .logAt('test', '3');

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
    creep.setSpawned();

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
          logger.logAt('creeps', stateMachine.state);
        }
      })
      .execute();

  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      ++Memory.maximums.deadCreeps;
      delete Memory.creeps[name];
    }
  }

  logger.dump();

});

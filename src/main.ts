// When compiling TS to JS and bundling with rollup, the line numbers and file
// names in error messages change. This utility uses source maps to get the line
// numbers and file names of the original, TS source code.
import { ErrorMapper } from 'utils/ErrorMapper';

import 'mixins/lodash';

import { StateMachine } from 'state/state-machine';
import { creepStateTransitions, defaultCreepState } from './config/config';
import { CreepStates } from './state/creep/creep-states';

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  const spawners = findSpawners();
  // Just constantly create creeps at all spawners
  spawners.forEach(spawner => {
    createCreep(spawner, [WORK, MOVE, CARRY]);
  });

  const creeps = findCreeps();
  creeps.forEach(creep => {
    // Nothing to do while spawning
    if (creep.spawning) {
      return;
    }

    const stateMachine = new StateMachine({
      init: creep.memory.state || defaultCreepState,
      transitions: creepStateTransitions
    });

    const stateName = creep.memory.state = stateMachine.state;
    const StateClass = CreepStates[stateName];
    const state = new StateClass(creep);
    state.execute(stateMachine);
    console.log(stateMachine.state);

    creep.memory.state = stateMachine.state;
  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});

function createCreep(spawner: StructureSpawn, body: BodyPartConstant[]): void {
  let attemptSpawn = !spawner.spawning;
  let nameSuffix = null;
  while (attemptSpawn) {
    attemptSpawn = false;
    const result = spawner.spawnCreep(
      body,
      Game.time.toString() + (nameSuffix ? '.' + nameSuffix : '')
    );
    switch (result) {
      case OK:
        console.log('The spawning operation has been scheduled successfully.');
        break;
      case ERR_NAME_EXISTS:
        console.log('There is a creep with the same name already.');
        attemptSpawn = true;
        nameSuffix = nameSuffix ? nameSuffix + 1 : 2;
        break;
      case ERR_BUSY:
        console.log('The spawn is already in process of spawning another creep.');
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        //console.log('The spawn and its extensions contain not enough energy to create a creep with the given body.');
        break;
      case ERR_INVALID_ARGS:
        console.log('Body is not properly described or name was not provided.');
        break;
      case ERR_RCL_NOT_ENOUGH:
        console.log('Your Room Controller level is insufficient to use this spawn.');
        break;
      default:
        console.log('Spawners said "Something bad happened."');
    }
  }
}

function findCreeps(): Creep[] {
  const creeps: Creep[] = [];
  Object.keys(Game.creeps).forEach(creepName => {
    creeps.push(Game.creeps[creepName]);
  });
  return creeps;
}

function findSpawners(): StructureSpawn[] {
  const spawners: StructureSpawn[] = [];
  Object.keys(Game.rooms).forEach(roomName => {
    const room = Game.rooms[roomName];
    const roomSpawners = room.find<StructureSpawn>(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_SPAWN }
    });
    spawners.push(...roomSpawners);
  });
  return spawners;
}

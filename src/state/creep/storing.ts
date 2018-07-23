import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Storing extends CreepState {
  static get state() { return 'storing'; };
  execute(stateMachine: StateMachine) {
    const creep = this.creep;
    if (!creep.carry[RESOURCE_ENERGY]) {
      stateMachine.idle();
    } else {
      const spawner = findSpawner(creep);
      if (!spawner) {
        console.log('no spawner?');
        stateMachine.next();
      } else {
        if (isAdjacentTo(creep.pos, spawner.pos)) {
          transferTo(creep, spawner);
        } else {
          moveTo(creep, spawner);
        }
      }
    }
  }
}

function findSpawner(creep: Creep): StructureSpawn | null {
  return creep.pos.findClosestByPath<StructureSpawn>(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_SPAWN }
  });
}

function isAdjacentTo(posA: RoomPosition, posB: RoomPosition) {
  return posA.roomName === posB.roomName
    && Math.abs(posA.x - posB.x) <= 1
    && Math.abs(posA.y - posB.y) <= 1;
}

function transferTo(creep: Creep, spawner: StructureSpawn) {
  const result = creep.transfer(spawner, RESOURCE_ENERGY);
  switch (result) {
    case OK:
      //console.log('The transfer operation has been scheduled successfully.');
      break;
    case ERR_INVALID_TARGET:
      console.log('The target is not a valid object which can contain the specified resource.');
      break;
    case ERR_FULL:
      console.log('The target cannot receive any more resources.');
      break;
    case ERR_NOT_IN_RANGE:
      console.log('The target is too far away.');
      break;
    default:
      console.log('Creep said "Something bad happened."');
  }
}

function moveTo(creep: Creep, target: RoomPosition|{pos: RoomPosition}) {
  const result = creep.moveTo(target);
  switch (result) {
    case OK:
      //console.log('The movement operation has been scheduled successfully.');
      break;
    case ERR_NO_PATH:
      console.log('No path to the target could be found.');
      break;
    case ERR_INVALID_TARGET:
      console.log('The target provided is invalid.');
      break;
    case ERR_TIRED:
      //console.log('The fatigue indicator of the creep is non-zero.');
      break;
    case ERR_NO_BODYPART:
      // Note, this can get knocked off by an attack
      console.log('There are no MOVE body parts in this creep’s body.');
      break;
    default:
      console.log('Creep said "Something bad happened."');
  }
}

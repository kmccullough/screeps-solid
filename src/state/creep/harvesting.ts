import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Harvesting extends CreepState {
  static get state() { return 'harvesting'; };
  execute(stateMachine: StateMachine) {
    const creep = this.creep;
    if (isCreepEnergyFull(creep)) {
      stateMachine.idle();
    } else {
      const source = findSource(creep);
      if (!source) {
        stateMachine.next();
      } else {
        if (isAdjacentTo(creep.pos, source.pos)) {
          harvestSource(creep, source);
        } else {
          moveTo(creep, source);
        }
      }
    }
  }
}

function findSource(creep: Creep): Source | null {
  return creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
}

function isCreepEnergyFull(creep: Creep) {
  return creep.carry[RESOURCE_ENERGY] === creep.carryCapacity;
}

function isAdjacentTo(posA: RoomPosition, posB: RoomPosition) {
  return posA.roomName === posB.roomName
    && Math.abs(posA.x - posB.x) <= 1
    && Math.abs(posA.y - posB.y) <= 1;
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

function harvestSource(creep: Creep, source: Source) {
  const result = creep.harvest(source);
  switch (result) {
    case OK:
      //console.log('The harvesting operation has been scheduled successfully.');
      break;
    case ERR_NOT_ENOUGH_RESOURCES:
      console.log('The target source does not contain any harvestable energy.');
      break;
    case ERR_INVALID_TARGET:
      console.log('The target is not a valid source object.');
      break;
    case ERR_NOT_IN_RANGE:
      console.log('The target is too far away.');
      break;
    case ERR_NO_BODYPART:
      // Note, this can get knocked off by an attack
      console.log('There are no WORK body parts in this creep’s body. Creep:', creep.name);
      break;
    default:
      console.log('Creep said "Something bad happened."');
  }
}

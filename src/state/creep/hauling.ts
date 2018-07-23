import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Hauling extends CreepState {
  static get state() { return 'hauling'; };
  execute(stateMachine: StateMachine) {
    const creep = this.creep;
    if (isCreepEnergyFull(creep)) {
      stateMachine.idle();
    } else {
      const energy = findEnergy(creep);
      if (!energy) {
        stateMachine.next();
      } else {
        if (isAdjacentTo(creep.pos, energy.pos)) {
          pickUp(creep, energy);
        } else {
          moveTo(creep, energy);
        }
      }
    }
  }
}

function findEnergy(creep: Creep): Resource | null {
  return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: { resourceType: RESOURCE_ENERGY }
  });
}

function isCreepEnergyFull(creep: Creep) {
  return creep.carry[RESOURCE_ENERGY] === creep.carryCapacity;
}

function isAdjacentTo(posA: RoomPosition, posB: RoomPosition) {
  return posA.roomName === posB.roomName
    && Math.abs(posA.x - posB.x) <= 1
    && Math.abs(posA.y - posB.y) <= 1;
}

function pickUp(creep: Creep, target: Resource) {
  const result = creep.pickup(target);
  switch (result) {
    case OK:
      //console.log('The pickup operation has been scheduled successfully.');
      break;
    case ERR_INVALID_TARGET:
      console.log('The target is not a valid object to pick up.');
      break;
    case ERR_FULL:
      console.log('The creep cannot receive any more energy.');
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

import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Idle extends CreepState {
  static get state() { return 'idle'; }
  execute(stateMachine: StateMachine) {
    if (isCreepEnergyFull(this.creep)) {
      stateMachine.store();
    } else {
      stateMachine.next();
    }
  }
}

function isCreepEnergyFull(creep: Creep) {
  return creep.carry[RESOURCE_ENERGY] === creep.carryCapacity;
}

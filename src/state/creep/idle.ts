import { IdlerFacade } from '@src/facade/creep/idler';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Idle extends CreepState {

  static get state() { return 'idle'; }

  idler: IdlerFacade;

  constructor(creep: Creep) {
    super(creep);
    this.idler = new IdlerFacade(creep);
  }

  execute(stateMachine: StateMachine<State>): void {

    super.execute(stateMachine);

    if (this.idler.isEnergyFull()) {
      return stateMachine.store();
    }

    return stateMachine.next();

  }

}

function isCreepEnergyFull(creep: Creep) {
  return creep.carry[RESOURCE_ENERGY] === creep.carryCapacity;
}

import { HaulerFacade } from '@src/facade/creep/hauler';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Hauling extends CreepState {

  static get state() { return 'hauling'; }

  hauler: HaulerFacade;

  constructor(creep: Creep) {
    super(creep);
    this.hauler = new HaulerFacade(creep);
  }

  execute(stateMachine: StateMachine<State>): void {

    super.execute(stateMachine);

    if (this.hauler.isEnergyFull()) {
      return stateMachine.idle();
    }

    const energy = this.hauler.findEnergy();
    if (!energy) {
      return stateMachine.next();
    }

    if (this.hauler.isAdjacentTo(energy.pos)) {
      this.hauler.pickUp(energy);
    } else {
      this.hauler.moveTo(energy);
    }

  }

}

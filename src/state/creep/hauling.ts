import { HaulerFacade } from '@src/facade/creep/hauler';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Hauling extends CreepState {

  static get state() { return 'hauling'; }

  execute<T extends State>(stateMachine: StateMachine<T>): void {

    super.execute(stateMachine);

    const creep = new HaulerFacade(this.creep);

    if (creep.isEnergyFull()) {
      return stateMachine.idle();
    }

    const energy = creep.findEnergy();
    if (!energy) {
      return stateMachine.next();
    }

    if (creep.isAdjacentTo(energy.pos)) {
      creep.pickUp(energy);
    } else {
      creep.moveTo(energy);
    }

  }

}

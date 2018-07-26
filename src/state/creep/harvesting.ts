import { HarvesterFacade } from '@src/facade/creep/harvester';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Harvesting extends CreepState {

  static get state() { return 'harvesting'; }

  /**
   * Execute state
   * Make sure to call super.execute(stateMachine)
   * @param {StateMachine<State>} stateMachine
   */
  execute<T extends State>(stateMachine: StateMachine<T>): void {

    super.execute(stateMachine);

    const creep = new HarvesterFacade(this.creep);

    if (creep.isEnergyFull()) {
      return stateMachine.idle();
    }

    const source = creep.findSource();
    if (!source) {
      return stateMachine.next();
    }

    if (creep.isAdjacentTo(source)) {
      creep.harvestSource(source);
    } else {
      creep.moveTo(source);
    }

  }

}

import { HarvesterFacade } from '@src/facade/creep/harvester';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Harvesting extends CreepState {

  static get state() { return 'harvesting'; }

  harvester: HarvesterFacade;

  constructor(creep: Creep) {
    super(creep);
    this.harvester = new HarvesterFacade(creep);
  }

  /**
   * Execute state
   * Make sure to call super.execute(stateMachine)
   * @param {StateMachine<State>} stateMachine
   */
  execute(stateMachine: StateMachine<State>): void {

    super.execute(stateMachine);

    if (this.harvester.isEnergyFull()) {
      return stateMachine.idle();
    }

    const source = this.harvester.findSource();
    if (!source) {
      return stateMachine.next();
    }

    if (this.harvester.isAdjacentTo(source)) {
      this.harvester.harvestSource(source);
    } else {
      this.harvester.moveTo(source);
    }

  }

}

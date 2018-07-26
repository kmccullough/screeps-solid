import { StorerFacade } from '@src/facade/creep/storer';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Storing extends CreepState {

  static get state() { return 'storing'; }

  storer: StorerFacade;

  constructor(creep: Creep) {
    super(creep);
    this.storer = new StorerFacade(creep);
  }

  execute(stateMachine: StateMachine<State>): void {

    super.execute(stateMachine);

    if (this.storer.isEnergyEmpty()) {
      return stateMachine.idle();
    }

    const spawner = this.storer.findSpawner();
    if (!spawner) {
      console.log('no spawner?');
      return stateMachine.next();
    }

    if (this.storer.isAdjacentTo(spawner)) {
      this.storer.transferTo(spawner);
    } else {
      this.storer.moveTo(spawner);
    }

  }

}

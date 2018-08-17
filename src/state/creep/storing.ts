import { logger } from 'debug/logger';

import { StorerFacade } from '@src/facade/creep/storer';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Storing extends CreepState {

  static get state() { return 'storing'; }

  execute<T extends State>(stateMachine: StateMachine<T>): void {

    super.execute(stateMachine);

    const creep = new StorerFacade(this.creep);

    if (creep.isEnergyEmpty()) {
      return stateMachine.idle();
    }

    const spawner = creep.findSpawner();
    if (!spawner) {
      logger.log('no spawner?');
      return stateMachine.next();
    }

    if (creep.isAdjacentTo(spawner)) {
      creep.transferTo(spawner);
    } else {
      creep.moveTo(spawner);
    }

  }

}

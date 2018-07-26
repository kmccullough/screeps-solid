import { IdlerFacade } from '@src/facade/creep/idler';
import { State } from '@src/state/state';
import { StateMachine } from '../state-machine';
import { CreepState } from './creep-state';

export class Idle extends CreepState {

  static get state() { return 'idle'; }

  execute<T extends State>(stateMachine: StateMachine<T>): void {

    super.execute(stateMachine);

    const creep = new IdlerFacade(this.creep);

    if (creep.isEnergyFull()) {
      return stateMachine.store();
    }

    return stateMachine.next();

  }

}

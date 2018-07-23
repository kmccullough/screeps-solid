import { State, StateMachine } from '../state-machine';

export interface CreepStateConstructor {
  state: string;
  new (creep: Creep): CreepState;
}

export abstract class CreepState extends State {
  constructor(
    public creep: Creep
  ) {
    super();
  }
}

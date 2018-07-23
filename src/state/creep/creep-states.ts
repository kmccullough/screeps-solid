import { CreepStateConstructor } from './creep-state';

import { Harvesting } from './harvesting';
export { Harvesting } from './harvesting';
import { Hauling } from './hauling';
export { Hauling } from './hauling';
import { Idle } from './idle';
export { Idle } from './idle';
import { Storing } from './storing';
export { Storing } from './storing';

export interface CreepStatesHash {
  [key: string]: CreepStateConstructor;
}

export const CreepStates: CreepStatesHash = {
  harvesting: Harvesting,
  hauling:    Hauling,
  idle:       Idle,
  storing:    Storing,
};

import { logger } from 'debug/logger';

import { CreepFacade } from './creep';

export class HaulerFacade extends CreepFacade {

  findEnergy(): Resource | null {
    return this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: { resourceType: RESOURCE_ENERGY }
    });
  }

  pickUp(target: Resource) {
    const result = this.creep.pickup(target);
    switch (result) {
      case OK:
        //logger.log('The pickup operation has been scheduled successfully.');
        this.setBusy(true);
        break;
      case ERR_INVALID_TARGET:
        logger.log('The target is not a valid object to pick up.');
        break;
      case ERR_FULL:
        logger.log('The creep cannot receive any more energy.');
        break;
      case ERR_NOT_IN_RANGE:
        logger.log('The target is too far away.');
        break;
      default:
        logger.log('Creep said "Something bad happened."');
    }
  }

}

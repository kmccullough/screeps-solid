import { logger } from 'debug/logger';

import { CreepFacade } from './creep';

export class HarvesterFacade extends CreepFacade {

  findSource(): Source | null {
    return this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }

  harvestSource(source: Source) {
    const result = this.creep.harvest(source);
    switch (result) {
      case OK:
        //logger.log('The harvesting operation has been scheduled successfully.');
        this.setBusy(true);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        logger.log('The target source does not contain any harvestable energy.');
        break;
      case ERR_INVALID_TARGET:
        logger.log('The target is not a valid source object.');
        break;
      case ERR_NOT_IN_RANGE:
        logger.log('The target is too far away.');
        break;
      case ERR_NO_BODYPART:
        // Note, this can get knocked off by an attack
        logger.log('There are no WORK body parts in this creep’s body. Creep:', this.creep.name);
        break;
      default:
        logger.log('Creep said "Something bad happened."');
    }
  }
}

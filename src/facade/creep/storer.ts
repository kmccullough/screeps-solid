import { logger } from 'debug/logger';

import { CreepFacade } from './creep';

export class StorerFacade extends CreepFacade {

  findSpawner(): StructureSpawn | null {
    return this.creep.pos.findClosestByPath<StructureSpawn>(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_SPAWN }
    });
  }

  transferTo(spawner: StructureSpawn) {
    const result = this.creep.transfer(spawner, RESOURCE_ENERGY);
    switch (result) {
      case OK:
        const energy = this.creep.carry[RESOURCE_ENERGY];
        Memory.per100.energy.current += energy;
        Memory.maximums.energy += energy;
        //logger.log('The transfer operation has been scheduled successfully.');
        this.setBusy(true);
        break;
      case ERR_INVALID_TARGET:
        logger.log('The target is not a valid object which can contain the specified resource.');
        break;
      case ERR_FULL:
        logger.log('The target cannot receive any more resources.');
        break;
      case ERR_NOT_IN_RANGE:
        logger.log('The target is too far away.');
        break;
      default:
        logger.log('Creep said "Something bad happened."');
    }
  }

}

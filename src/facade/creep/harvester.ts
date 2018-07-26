import { CreepFacade } from './creep';

export class HarvesterFacade extends CreepFacade {

  findSource(): Source | null {
    return this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }

  harvestSource(source: Source) {
    const result = this.creep.harvest(source);
    switch (result) {
      case OK:
        //console.log('The harvesting operation has been scheduled successfully.');
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        console.log('The target source does not contain any harvestable energy.');
        break;
      case ERR_INVALID_TARGET:
        console.log('The target is not a valid source object.');
        break;
      case ERR_NOT_IN_RANGE:
        console.log('The target is too far away.');
        break;
      case ERR_NO_BODYPART:
        // Note, this can get knocked off by an attack
        console.log('There are no WORK body parts in this creep’s body. Creep:', this.creep.name);
        break;
      default:
        console.log('Creep said "Something bad happened."');
    }
  }
}

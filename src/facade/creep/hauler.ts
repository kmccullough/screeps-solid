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
        //console.log('The pickup operation has been scheduled successfully.');
        this.setBusy(true);
        break;
      case ERR_INVALID_TARGET:
        console.log('The target is not a valid object to pick up.');
        break;
      case ERR_FULL:
        console.log('The creep cannot receive any more energy.');
        break;
      case ERR_NOT_IN_RANGE:
        console.log('The target is too far away.');
        break;
      default:
        console.log('Creep said "Something bad happened."');
    }
  }

}

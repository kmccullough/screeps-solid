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
        //console.log('The transfer operation has been scheduled successfully.');
        break;
      case ERR_INVALID_TARGET:
        console.log('The target is not a valid object which can contain the specified resource.');
        break;
      case ERR_FULL:
        console.log('The target cannot receive any more resources.');
        break;
      case ERR_NOT_IN_RANGE:
        console.log('The target is too far away.');
        break;
      default:
        console.log('Creep said "Something bad happened."');
    }
  }

}

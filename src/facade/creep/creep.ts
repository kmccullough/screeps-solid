import { logger } from 'debug/logger';

import { RoomFacade, RoomPositionObject } from '@src/facade/room';

export class CreepFacade {

  static findCreeps(): Creep[] {
    const creeps: Creep[] = [];
    Object.keys(Game.creeps).forEach(creepName => {
      creeps.push(Game.creeps[creepName]);
    });
    return creeps;
  }

  constructor(
    public creep: Creep
  ) {
  }

  isSpawning() {
    return this.creep.spawning;
  }

  setSpawned(): this {
    if (!this.creep.memory.spawned) {
      this.creep.memory.spawned = true;
    }
    return this;
  }

  isEnergyEmpty() {
    return !this.creep.carry[RESOURCE_ENERGY];
  }

  isEnergyFull() {
    return this.creep.carry[RESOURCE_ENERGY] === this.creep.carryCapacity;
  }

  isAdjacentTo(posB: RoomPositionObject) {
    return RoomFacade.isAdjacentTo(this.creep, posB);
  }

  moveTo(target: RoomPositionObject) {
    const result = this.creep.moveTo(target);
    switch (result) {
      case OK:
        //logger.log('The movement operation has been scheduled successfully.');
        this.setBusy(true);
        break;
      case ERR_NO_PATH:
        logger.log('No path to the target could be found.');
        break;
      case ERR_INVALID_TARGET:
        logger.log('The target provided is invalid.');
        break;
      case ERR_TIRED:
        //logger.log('The fatigue indicator of the creep is non-zero.');
        break;
      case ERR_NO_BODYPART:
        // Note, this can get knocked off by an attack
        logger.log('There are no MOVE body parts in this creep’s body.');
        break;
      default:
        logger.log('Creep said "Something bad happened."');
    }
  }

  getState(): string | undefined {
    return this.creep.memory.state;
  }

  setState(state: string): this {
    this.creep.memory.state = state;
    return this;
  }

  isBusy(): boolean {
    return !!this.creep.memory.isBusy;
  }

  setBusy(isBusy: boolean): this {
    this.creep.memory.isBusy = isBusy;
    return this;
  }

}

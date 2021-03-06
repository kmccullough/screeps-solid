import { logger } from 'debug/logger';

export class SpawnerFacade {

  constructor(
    public spawner: StructureSpawn
  ) {
  }

  static findSpawners(): StructureSpawn[] {
    const spawners: StructureSpawn[] = [];
    Object.keys(Game.rooms).forEach(roomName => {
      const room = Game.rooms[roomName];
      const roomSpawners = room.find<StructureSpawn>(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_SPAWN }
      });
      spawners.push(...roomSpawners);
    });
    return spawners;
  }

  createCreep(body: BodyPartConstant[]): void {
    let attemptSpawn = !this.spawner.spawning;
    let nameSuffix = null;
    while (attemptSpawn) {
      attemptSpawn = false;
      const result = this.spawner.spawnCreep(
        body,
        Game.time.toString() + (nameSuffix ? '.' + nameSuffix : '')
      );
      switch (result) {
        case OK:
          logger.log('The spawning operation has been scheduled successfully.');
          Memory.per100.spawns.current = Memory.per100.spawns.current || 0;
          ++Memory.per100.spawns.current;
          break;
        case ERR_NAME_EXISTS:
          logger.log('There is a creep with the same name already.');
          attemptSpawn = true;
          nameSuffix = nameSuffix ? nameSuffix + 1 : 2;
          break;
        case ERR_BUSY:
          logger.log('The spawn is already in process of spawning another creep.');
          break;
        case ERR_NOT_ENOUGH_ENERGY:
          //logger.log('The spawn and its extensions contain not enough energy to create a creep with the given body.');
          break;
        case ERR_INVALID_ARGS:
          logger.log('Body is not properly described or name was not provided.');
          break;
        case ERR_RCL_NOT_ENOUGH:
          logger.log('Your Room Controller level is insufficient to use this spawn.');
          break;
        default:
          logger.log('Spawners said "Something bad happened."');
      }
    }
  }

}

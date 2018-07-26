export type RoomPositionObject = RoomPosition | { pos: RoomPosition };

export class RoomFacade {

  constructor(
    public room: Room
  ) {
  }

  static normalizePosition(pos: RoomPositionObject): RoomPosition {
    return pos instanceof RoomPosition ? pos : pos.pos;
  }

  static isAdjacentTo(posA: RoomPositionObject, posB: RoomPositionObject) {
    posA = RoomFacade.normalizePosition(posA);
    posB = RoomFacade.normalizePosition(posB);
    return posA.roomName === posB.roomName
      && Math.abs(posA.x - posB.x) <= 1
      && Math.abs(posA.y - posB.y) <= 1;
  }

}

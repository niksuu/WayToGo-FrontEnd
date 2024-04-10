export class MapLocation {
  constructor(
    public id: string,
    public name: string,
    public coordinates: {
      type: string;
      coordinates: number[];
    },
    public description?: string,
    public createdDate?: Date,
    public updateDate?: Date,
  ) {}
}

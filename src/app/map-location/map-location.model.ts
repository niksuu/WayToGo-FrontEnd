export class MapLocation {
  constructor(
    public name: string,
    public coordinates: {
      type: string;
      coordinates: number[];
    },
    public id?: string,
    public description?: string,
    public createdDate?: Date,
    public updateDate?: Date,
  ) {}
}

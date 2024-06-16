import {User} from "../user/user.model";
import {MapLocation} from "../map-location/map-location.model";

export class Audio {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public user: User,
    public mapLocation: MapLocation,
    public audioFilename: String
  ) {}
}

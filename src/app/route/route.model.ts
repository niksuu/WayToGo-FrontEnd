import {User} from "../user/user.model";

export class Route {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public user: User,
  ) {}
}

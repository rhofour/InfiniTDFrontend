import { User as FbUser } from 'firebase/app';
import { User } from './user';

export class LoggedInUser {
  fbUser: FbUser;
  user?: User; // Available if the user is registered.

  constructor(fbUser: FbUser, user?: User) {
    this.fbUser = fbUser;
    this.user = user;
  }
}

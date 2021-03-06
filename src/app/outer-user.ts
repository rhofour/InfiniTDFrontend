import firebase from 'firebase/app';
import { User } from './user';

export class OuterUser {
  fbUser?: firebase.User;
  user?: User; // Available if the user is registered.

  constructor(fbUser?: firebase.User, user?: User) {
    this.fbUser = fbUser;
    this.user = user;
  }

  loggedIn(): boolean {
    return this.fbUser !== undefined;
  }

  registered(): boolean {
    return this?.user?.name !== undefined;
  }

  matches(otherUser: User) {
    return this.user?.name == otherUser.name;
  }
}

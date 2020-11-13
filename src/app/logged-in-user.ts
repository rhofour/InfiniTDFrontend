import firebase from 'firebase/app';
import { User } from './user';

export class LoggedInUser {
  fbUser: firebase.User;
  user?: User; // Available if the user is registered.

  constructor(fbUser: firebase.User, user?: User) {
    this.fbUser = fbUser;
    this.user = user;
  }

  matches(otherUser: User) {
    return this.user?.name == otherUser.name;
  }
}

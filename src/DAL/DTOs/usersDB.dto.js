import { ROLE_ADMIN } from '../mongoDB/models/users.model.js';

export default class UsersDB_DTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.cart = user.cart;
    this.role = user.role;
    this.id = user._id;
    this.isAdmin = user.role === ROLE_ADMIN;
  }
}

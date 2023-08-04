export default class UsersDB_DTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.cart = user.cart;
    this.role = user.role;
  }
}

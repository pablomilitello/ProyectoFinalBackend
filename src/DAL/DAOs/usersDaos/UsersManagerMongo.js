import { userModel } from '../../mongoDB/models/users.model.js';
import BasicManager from '../basicDaos/BasicManager.js';
export default class UsersManager extends BasicManager {
  constructor(model) {
    super(model);
  }

  async findByEmail(email) {
    const user = await userModel.findOne({ email });
    return user;
  }

  async createOne(user) {
    const { email, password } = user;

    const existUser = await userModel.find({ email, password });
    if (existUser.length === 0) {
      const newUser = await userModel.create(user);
      return newUser;
    } else {
      return null;
    }
  }

  async deleteInactive() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    try {
      const result = await userModel.deleteMany({ last_connection: { $lt: oneHourAgo } });
      return result;
    } catch (err) {
      console.error('Error al borrar usuarios inactivos:', err);
      throw err;
    }
  }
}

export const userManager = new UsersManager(userModel);

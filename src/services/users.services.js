import { usersManager } from '../DAL/DAOs/usersDaos/UsersManagerMongo.js';

export const findAllUsers = async () => {
  const users = await usersManager.findAll();
  return users;
};

export const findById = async (id) => {
  const user = await usersManager.findOneById(id);
  return user;
};

export const createOneUser = async (obj) => {
  const newUser = await usersManager.createOne(obj);
  return newUser;
};

export const updateOneUser = async (id, obj) => {
  const user = await usersManager.updateOne(id, obj);
  return user;
};

export const deleteUser = async (id) => {
  const user = await usersManager.deleteOne(id);
  return user;
};

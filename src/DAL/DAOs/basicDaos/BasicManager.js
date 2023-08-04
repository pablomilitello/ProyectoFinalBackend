export default class BasicManager {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    const response = await this.model.find();
    return response;
  }

  async findOneById(id) {
    const response = await this.model.findById(id);
    return response;
  }

  async createOne(obj) {
    const response = await this.model.create(obj);
    return response;
  }

  async updateOne(id, obj) {
    const response = await this.model.findOneAndUpdate({ _id: id }, { $set: obj });
    return response;
  }

  async deleteOne(id) {
    const response = await this.model.deleteOne({ _id: id });
    return response;
  }
}

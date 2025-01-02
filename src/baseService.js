export class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(options) {
    return this.repository.findAll(options);
  }

  async findById(id, options) {
    return this.repository.findByPk(id, options);
  }

  async create(createInput) {
    return this.repository.create(createInput);
  }

  async update(id, updateInput, options) {
    const [num, updated] = await this.repository.update(
      updateInput,
      {
        where: {id: id},
        returning: true,
        plain: true,
        ...options
      }
    );
    return updated;
  }

  async delete(id) {
    return await this.repository.destroy({
      where: {id: id},
    })
  }
}
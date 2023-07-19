
import { Connection, MoreThanOrEqual, getRepository } from "typeorm";

import { Form } from "../entity/Form";

export class FormDao {
  private formRepository = getRepository(Form);
  constructor(private connection: Connection) {
    this.formRepository = this.connection.getRepository(Form);
  }

  async saveForm(form: Form): Promise<Form> {
    return this.formRepository.save(form);
  }
  
  async getForms(page: number, pageSize: number): Promise<Form[]> {
    const skip = (page - 1) * pageSize;
    return this.formRepository.find({
      skip,
      take: pageSize,
    });
  }

  async getFormById(id: number): Promise<Form> {
    try {
      const form = await this.formRepository.findOne({ where: { id: MoreThanOrEqual(id) } });
      return form || null;
    } catch (error) {
      console.error('Error while fetching form by ID:', error);
      return null;
    }
  }

  async deleteForm(id: number): Promise<void> {
    try {
      await this.formRepository.delete(id);
    } catch (error) {
      console.error('Error while deleting form:', error);
      throw error;
    }
  }
}

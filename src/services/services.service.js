import { BaseService } from "../baseService.js";
import { Service } from "./models/service.model.js";

export class ServicesService extends BaseService {
  constructor() {
    super(Service)
  }
}
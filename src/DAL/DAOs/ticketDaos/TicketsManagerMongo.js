import { ticketsModel } from '../../mongoDB/models/tickets.model.js';
import BasicManager from '../basicDaos/BasicManager.js';

export default class TicketManager extends BasicManager {
  constructor(model) {
    super(model);
  }
}

export const ticketManager = new TicketManager(ticketsModel);

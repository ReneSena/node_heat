import { Request, Response } from 'express';
import { GetLastMessagesService } from '../services/GetLastMessagesService/GetLastMessagesService';

class GetLastMessagesController {
	async handle(request: Request, response: Response) {
		const service = await new GetLastMessagesService();

		const resultOfThreeLastMessages = await service.execute();

		return response.json(resultOfThreeLastMessages);
	}
}

export { GetLastMessagesController };
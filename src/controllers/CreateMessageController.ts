import { Request, Response } from "express";
import { CreateMessageService, ICreateMessageService } from "../services/CreateMessageService/CreateMessageService";

export interface IRequestCustom extends Request {
	user_id: string
}
class CreateMessageController {
    async handle(request: IRequestCustom, response: Response) {
		const { message: text } = request.body;
		const { user_id } = request;

		const service = new CreateMessageService();

		const params: ICreateMessageService = { text, user_id }

		const result = await service.execute(params);

		return response.json(result);
    }
}

export { CreateMessageController };
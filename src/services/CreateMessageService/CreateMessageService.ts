import prismaClient from "../../prisma";

export interface ICreateMessageService {
	text: string;
	user_id: string;
}

class CreateMessageService {
	async execute({ text, user_id } : ICreateMessageService) {
		const message = await prismaClient.message.create({
			data: {
				text,
				user_id
			},
			include: {
				user: true
			}
		})

		return message;
	}
}

export { CreateMessageService }
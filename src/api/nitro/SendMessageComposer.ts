import { IMessageComposer } from '@nitrots/nitro-renderer';
import { GetConnection } from './GetConnection';

export const SendMessageComposer = (event: IMessageComposer<unknown[]>) =>
{
	const connection = GetConnection();

	if(!connection) return;

	connection.send(event);
}

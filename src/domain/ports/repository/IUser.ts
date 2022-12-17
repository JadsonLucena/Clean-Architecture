import User from '../../entities/User'

import IRepository from './IRepository'

export default interface IUserRepository extends IRepository {

	find({
		id,
		projectId,
		name,
		email,
		phone,
		createdAt
	}: {
		id?: string,
		projectId?: string,
		name?: string,
		email?: string,
		phone?: string,
		login?: string,
		createdAt?: string
	}, transactionId?: string): Promise<User[]>

	has({
		login
	}: {
		login: string
	}, transactionId?: string): Promise<boolean>

	insert(user: User, transactionId?: string): Promise<string>

	update(user: User, transactionId?: string): Promise<boolean>

	delete(id: string, transactionId?: string): Promise<boolean>

}
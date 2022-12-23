import Role from '../../entities/Role'

import IRepository from './IRepository'

export default interface IRoleRepository extends IRepository {

	find({
		id,
		projectId,
		name,
		permissions,
		createdBy,
		createdAt
	}: {
		id?: string,
		projectId?: string,
		name?: string,
		permissions?: string[],
		createdBy?: string,
		createdAt?: string
	}, transactionId?: string): Promise<Role[]>

	has({
		name,
		projectId
	}: {
		name: string,
		projectId: string
	}, transactionId?: string): Promise<boolean>

	insert(role: Role, transactionId?: string): Promise<string>

	update(role: Role, transactionId?: string): Promise<boolean>

	delete(id: string, transactionId?: string): Promise<boolean>

}
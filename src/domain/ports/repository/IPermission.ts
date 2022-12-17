import Permission from '../../entities/Permission'

import IRepository from './IRepository'

export default interface IPermissionRepository extends IRepository {

	find({
		id,
		scope
	}: {
		id?: string,
		scope?: string
	}, transactionId?: string): Promise<Permission[]>

	has({
		scope
	}: {
		scope: string
	}, transactionId?: string): Promise<boolean>

	insert(member: Permission, transactionId?: string): Promise<string>

	update(member: Permission, transactionId?: string): Promise<boolean>

	delete(id: string, transactionId?: string): Promise<boolean>

}
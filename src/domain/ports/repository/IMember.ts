import Member from '../../entities/Member'

import IRepository from './IRepository'

export default interface IMemberRepository extends IRepository {

	find({
		id,
		projectId,
		userId,
		roleId,
		createdBy,
		createdAt
	}: {
		id?: string,
		projectId?: string,
		userId?: string,
		roleId?: string,
		createdBy?: string,
		createdAt?: string
	}, transactionId?: string): Promise<Member[]>

	has({
		projectId,
		userId
	}: {
		projectId: string,
		userId: string
	}, transactionId?: string): Promise<boolean>

	insert(member: Member, transactionId?: string): Promise<string>

	update(member: Member, transactionId?: string): Promise<boolean>

	delete(id: string, transactionId?: string): Promise<boolean>

}
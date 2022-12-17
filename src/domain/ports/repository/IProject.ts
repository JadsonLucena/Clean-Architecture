import Project from '../../entities/Project'

import IRepository from './IRepository'

export default interface IProjectRepository extends IRepository {

	find({
		id,
		userId,
		name,
		createdBy,
		createdAt
	}:{
		id?: string,
		userId?: string,
		name?: string,
		createdBy?: string,
		createdAt?: string
	}, transactionId?: string): Promise<Project[]>

	has({
		name,
		createdBy
	}: {
		name: string,
		createdBy: string
	}, transactionId?: string): Promise<boolean>

	insert(project: Project, transactionId?: string): Promise<string>

	update(project: Project, transactionId?: string): Promise<boolean>

	delete(id: string, transactionId?: string): Promise<boolean>

}
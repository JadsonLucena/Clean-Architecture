import UUID from '../../../domain/VO/UUID'
import Name from '../../../domain/VO/Name'

import Project from '../../../domain/entities/Project'

import IProjectRepository from '../../../domain/ports/repository/IProject'

import Repository from './Repository'

export default class ProjectRepository extends Repository implements IProjectRepository {

	constructor({
		host,
		username,
		password,
		dbname
	}: {
		host: string,
		username: string,
		password?: string,
		dbname: string
	}) {

		super({
			host,
			username,
			password,
			dbname
		})

	}

	async find({
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
	}, transactionId?: string): Promise<Project[]> {

		let tables = [`projects`]
		let where: string[] = []

		let params: {
			id?: string,
			name?: string,
			userId?: string,
			createdBy?: string,
			createdAt?: string
		} = {}
		let types: {
			id?: 'string',
			name?: 'string',
			userId?: 'string',
			createdBy?: 'string',
			createdAt?: 'timestamp'
		} = {}

		if (id) {

			where.push(`id = @id`)
			params.id = new UUID(id).toString()
			types.id = 'string'

		} else {

			if (userId) {

				tables.push(`members`)
				where.push(`projects.id = members.project_id`)
				where.push(`members.user_id = @userId`)
				params.userId = new UUID(userId).toString()
				types.userId = 'string'

			}

			if (name) {

				where.push(`projects.name = @name`)
				params.name = new Name(name, {
					minAmountOfLastNames: 0
				}).toString()
				types.name = 'string'

			}

			if (createdBy) {

				where.push(`projects.created_by = @createdBy`)
				params.createdBy = new UUID(createdBy).toString()
				types.createdBy = 'string'

			}

			if (createdAt) {

				where.push(`projects.created_at = @createdAt`)
				params.createdAt = new Date(createdAt).toISOString()
				types.createdAt = 'timestamp'

			}

		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT * FROM ${tables.join(`, `)} ${where.length ? `WHERE ${where.join(` AND `)}` : ''}`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.map((row: any) => new Project(row.toJSON()))

	}

}
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

	async has({
		name,
		createdBy
	}: {
		name: string,
		createdBy: string
	}, transactionId?: string): Promise<boolean> {

		let params = {
			name: new Name(name, {
				minAmountOfLastNames: 0
			}).toString(),
			createdBy: new UUID(createdBy).toString()
		}
		let types = {
			name: 'string',
			createdBy: 'string'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT * FROM roles WHERE name = @name AND created_by = @createdBy`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 1

	}

	async insert(project: Project, transactionId?: string): Promise<string> {

		let params = {
			id: project.id,
			name: project.name,
			thumb: project.thumb,
			createdBy: project.createdBy,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt
		}
		let types = {
			id: 'string',
			name: 'string',
			thumb: 'string',
			createdBy: 'string',
			createdAt: 'timestamp',
			updatedAt: 'timestamp'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `INSERT INTO projects (id, name, thumb, created_by, created_at, updated_at) VALUES (@id, @name, @thumb, @createdBy, @createdAt, @updatedAt) RETURNING id`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.shift()?.toJSON().id

	}

	async update(project: Project, transactionId?: string): Promise<boolean> {

		let set = [
			`name = @name`,
			`updated_at = @updatedAt`
		]

		let params: { [k: string]: any } = {
			id: project.id,
			name: project.name,
			updatedAt: project.updatedAt
		}
		let types: { [k: string]: any } = {
			id: 'string',
			name: 'string',
			updatedAt: 'timestamp'
		}

		if (project.thumb) {

			set.push(`thumb = @thumb`)
			params.thumb = project.thumb
			types.thumb = 'string'

		}

		if (project.deletedAt) {

			set.push(`deleted_at = @deletedAt`)
			params.deletedAt = project.deletedAt
			types.deletedAt = 'timestamp'

		} else {

			set.push(`deleted_at = null`)

		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `UPDATE projects SET ${set.join(', ')} WHERE id = @id`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 0

	}

}
import UUID from '../../../domain/VO/UUID'

import Member from '../../../domain/entities/Member'

import IMemberRepository from '../../../domain/ports/repository/IMember'

import Repository from './Repository'

export default class MemberRepository extends Repository implements IMemberRepository {

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
		projectId,
		userId,
		roleId,
		createdBy,
		createdAt
	}: {
		id?: string,
		projectId: string,
		userId?: string,
		roleId?: string,
		createdBy?: string,
		createdAt?: string
	}, transactionId?: string): Promise<Member[]> {

		let tables = [`members`]
		let where: string[] = []

		let params: {
			id?: string,
			projectId?: string,
			userId?: string,
			roleId?: string,
			createdBy?: string,
			createdAt?: string
		} = {}
		let types: {
			id?: 'string',
			projectId?: 'string',
			userId?: 'string',
			roleId?: 'string',
			createdBy?: 'string',
			createdAt?: 'timestamp'
		} = {}

		if (id) {

			where.push(`id = @id`)
			params.id = new UUID(id).toString()
			types.id = 'string'

		} else {

			if (projectId) {

				where.push(`project_id = @projectId`)
				params.projectId = new UUID(projectId).toString()
				types.projectId = 'string'

			}

			if (userId) {

				where.push(`user_id = @userId`)
				params.userId = new UUID(userId).toString()
				types.userId = 'string'

			}

			if (roleId) {

				where.push(`role_id = @roleId`)
				params.roleId = new UUID(roleId).toString()
				types.roleId = 'string'

			}

			if (createdBy) {

				where.push(`created_by = @createdBy`)
				params.createdBy = new UUID(createdBy).toString()
				types.createdBy = 'string'

			}

			if (createdAt) {

				where.push(`created_at = @createdAt`)
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

		return rows.map((row: any) => new Member(row.toJSON()))

	}

}
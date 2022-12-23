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

	async has({
		projectId,
		userId
	}: {
		projectId: string,
		userId: string
	}, transactionId?: string): Promise<boolean> {

		let params = {
			projectId: new UUID(projectId).toString(),
			userId: new UUID(userId).toString()
		}
		let types = {
			projectId: 'string',
			userId: 'string'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT * FROM members WHERE project_id = @projectId AND user_id = @userId`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 1

	}

	async insert(member: Member, transactionId?: string): Promise<string> {

		let params = {
			id: member.id,
			projectId: member.projectId,
			userId: member.userId,
			roleId: member.roleId,
			createdBy: member.createdBy,
			createdAt: member.createdAt,
			updatedAt: member.updatedAt
		}
		let types = {
			id: 'string',
			projectId: 'string',
			userId: 'string',
			roleId: 'string',
			createdBy: 'string',
			createdAt: 'timestamp',
			updatedAt: 'timestamp'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `INSERT INTO members (id, project_id, user_id, role_id, created_by, created_at, updated_at) VALUES (@id, @projectId, @userId, @roleId, @createdBy, @createdAt, @updatedAt) RETURNING id`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.shift()?.toJSON().id

	}

	async update(member: Member, transactionId?: string): Promise<boolean> {

		let set = [
			`role_id = @roleId`,
			`updated_at = @updatedAt`
		]

		let params: { [k: string]: any } = {
			id: member.id,
			roleId: member.roleId,
			updatedAt: member.updatedAt
		}
		let types: { [k: string]: any } = {
			id: 'string',
			roleId: 'string',
			updatedAt: 'timestamp'
		}

		if (member.confirmedAt) {

			set.push(`confirmed_at = @confirmedAt`)
			params.confirmedAt = member.confirmedAt
			types.confirmedAt = 'timestamp'

		} else {

			set.push(`confirmed_at = null`)

		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `UPDATE members SET ${set.join(', ')} WHERE id = @id`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 0

	}

}
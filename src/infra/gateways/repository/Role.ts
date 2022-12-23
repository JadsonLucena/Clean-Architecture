import UUID from '../../../domain/VO/UUID'
import Name from '../../../domain/VO/Name'

import IRoleRepository from '../../../domain/ports/repository/IRole'

import Role from '../../../domain/entities/Role'

import Repository from './Repository'

export default class RoleRepository extends Repository implements IRoleRepository {

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
	}, transactionId?: string): Promise<Role[]> {

		let tables = [`roles`]
		let where: string[] = []

		let params: {
			id?: string,
			projectId?: string,
			name?: string,
			permissions?: string[],
			createdBy?: string,
			createdAt?: string
		} = {}
		let types: {
			id?: 'string',
			projectId?: 'string',
			name?: 'string',
			permissions?: {
				type: 'array',
				child: {
					type: 'string'
				}
			},
			createdBy?: 'string',
			createdAt?: 'timestamp'
		} = {}

		if (id) {

			where.push(`id = @id`)
			params.id = new UUID(id).toString()
			types.id = 'string'

		} else {

			if (projectId) {

				tables.push(`members`)
				where.push(`roles.id = members.role_id`)
				where.push(`members.project_id = @projectId`)
				params.projectId = new UUID(projectId).toString()
				types.projectId = 'string'

			}

			if (name) {

				where.push(`roles.name = @name`)
				params.name = new Name(name, {
					minAmountOfLastNames: 0
				}).toString()
				types.name = 'string'

			}

			if (permissions) {

				tables.push(`acl`)
				where.push(`roles.id = acl.role_id`)
				where.push(`acl.permission_id IN (@permissions)`)
				params.permissions = permissions.map(permissionId => new UUID(permissionId).toString())
				types.permissions = {
					type: 'array',
					child: {
						type: 'string'
					}
				}

			}

			if (createdBy) {

				where.push(`roles.created_by = @createdBy`)
				params.createdBy = new UUID(createdBy).toString()
				types.createdBy = 'string'

			}

			if (createdAt) {

				where.push(`roles.created_at = @createdAt`)
				params.createdAt = new Date(createdAt).toString()
				types.createdAt = 'timestamp'

			}

		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT *, ARRAY(SELECT permissions.id FROM permissions, acl WHERE permissions.id = acl.permission_id AND acl.role_id = roles.id) AS permissions FROM ${tables.join(`, `)} ${where.length ? `WHERE ${where.join(` AND `)}` : ''}`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.map((row: any) => new Role(row.toJSON()))

	}

	async has({
		name,
		projectId
	}: {
		name: string,
		projectId: string
	}, transactionId?: string): Promise<boolean> {

		let params = {
			name: new Name(name, {
				minAmountOfLastNames: 0
			}).toString(),
			projectId: new UUID(projectId).toString()
		}
		let types = {
			name: 'string',
			projectId: 'string'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT * FROM roles WHERE name = @name AND project_id = @projectId`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 1

	}

}
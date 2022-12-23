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

	async insert(role: Role, transactionId?: string): Promise<string> {

		let params = {
			id: role.id,
			name: role.name,
			projectId: role.projectId,
			createdBy: role.createdBy,
			createdAt: role.createdAt,
			updatedAt: role.updatedAt
		}
		let types = {
			id: 'string',
			name: 'string',
			projectId: 'string',
			createdBy: 'string',
			createdAt: 'timestamp',
			updatedAt: 'timestamp'
		}


		let internalTransactionId = transactionId || await this.transaction()


		try {

			const [ rows, state, metadata ] = await this.transactions[internalTransactionId].run({
				sql: `INSERT INTO roles (id, name, project_id, created_by, created_at, updated_at) VALUES (@id, @name, @projectId, @createdBy, @createdAt, @updatedAt) RETURNING id`,
				params,
				types
			}).catch((err: any) => {

				throw err

			})

			const roleId = rows.shift()?.toJSON().id


			for (let permissionId of (role.permissions || [])) {

				await this.transactions[internalTransactionId].run({
					sql: `INSERT INTO acl (role_id, permission_id, created_by, created_at) VALUES (@roleId, @permissionId, @createdBy, @createdAt)`,
					params: {
						roleId,
						permissionId,
						createdBy: role.createdBy,
						createdAt: role.createdAt
					},
					types: {
						roleId: 'string',
						permissionId: 'string',
						createdBy: 'string',
						createdAt: 'timestamp'
					}
				}).catch((err: any) => {

					throw err

				})

			}


			return roleId

		} catch(err) {

			if (!transactionId) {

				this.rollback(internalTransactionId)

			}

			throw err

		}

	}

}
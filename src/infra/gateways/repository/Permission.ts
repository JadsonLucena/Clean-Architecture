import UUID from '../../../domain/VO/UUID'
import Scope from '../../../domain/VO/Scope'

import Permission from '../../../domain/entities/Permission'

import IPermissionRepository from '../../../domain/ports/repository/IPermission'

import Repository from './Repository'

export default class PermissionRepository extends Repository implements IPermissionRepository {

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
		scope
	}: {
		id?: string,
		scope?: string
	}, transactionId?: string): Promise<Permission[]> {

		let tables = [`permissions`]
		let where: string[] = []

		let params: {
			id?: string,
			scope?: string
		} = {}
		let types: {
			id?: 'string',
			scope?: 'string'
		} = {}

		if (id) {

			where.push(`id = @id`)
			params.id = new UUID(id).toString()
			types.id = 'string'

		}

		if (scope) {

			where.push(`scope = @scope`)
			params.scope = new Scope(scope).toString()
			types.scope = 'string'

		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT * FROM ${tables.join(`, `)} ${where.length ? `WHERE ${where.join(` AND `)}` : ''}`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.map((row: any) => new Permission(row.toJSON()))

	}

}
import UUID from '../../../domain/VO/UUID'
import Name from '../../../domain/VO/Name'
import Email from '../../../domain/VO/Email'
import Phone from '../../../domain/VO/Phone'
import Login from '../../../domain/VO/Login'

import User from '../../../domain/entities/User'

import IUserRepository from '../../../domain/ports/repository/IUser'

import Repository from './Repository'

export default class UserRepository extends Repository implements IUserRepository {

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
		phone,
		email,
		login,
		createdAt
	}: {
		id?: string,
		projectId?: string,
		name?: string,
		phone?: string,
		email?: string,
		login: string,
		createdAt?: string
	}, transactionId?: string): Promise<User[]> {

		let tables = [`users`]
		let where: string[] = []

		let params: {
			id?: string,
			name?: string,
			phone?: string,
			email?: string,
			login?: string,
			projectId?: string,
			createdAt?: string
		} = {}
		let types: {
			id?: 'string',
			name?: 'string',
			phone?: 'string',
			email?: 'string',
			login?: 'string',
			projectId?: 'string',
			createdAt?: 'timestamp'
		} = {}

		if (id) {

			where.push(`id = @id`)
			params.id = new UUID(id).toString()
			types.id = 'string'

		} else {

			if (projectId) {

				tables.push(`members`)
				where.push(`users.id = members.user_id`)
				where.push(`members.project_id = @projectId`)
				params.projectId = new UUID(projectId).toString()
				types.projectId = 'string'

			}

			if (name) {

				where.push(`users.name = @name`)
				params.name = new Name(name).toString()
				types.name = 'string'

			}

			if (phone) {

				where.push(`users.phone = @phone`)
				params.phone = new Phone(phone).toString()
				types.phone = 'string'

			}

			if (email) {

				where.push(`users.email = @email`)
				params.email = new Email(email).toString()
				types.email = 'string'

			}

			if (login) {

				where.push(`users.login = @login`)
				params.login = new Login(login).toString()
				types.login = 'string'

			}

			if (createdAt) {

				where.push(`users.created_at = @createdAt`)
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

		return rows.map((row: any) => new User(row.toJSON()))

	}

	async has({
		login
	}: {
		login: string
	}, transactionId?: string): Promise<boolean> {

		let params = {
			login: new Login(login).toString()
		}
		let types = {
			login: 'string'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `SELECT * FROM users WHERE login = @login`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 1

	}

}
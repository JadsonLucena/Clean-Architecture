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

	async insert(user: User, transactionId?: string): Promise<string> {

		let params = {
			id: user.id,
			name: user.name,
			phone: user.phone,
			email: user.email,
			login: user.login,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt
		}
		let types = {
			id: 'string',
			name: 'string',
			phone: 'string',
			email: 'string',
			login: 'string',
			password: 'string',
			createdAt: 'timestamp',
			updatedAt: 'timestamp'
		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `INSERT INTO users (id, name, phone, email, login, password, created_at, updated_at) VALUES (@id, @name, @phone, @email, @login, @password, @createdAt, @updatedAt) RETURNING id`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.shift()?.toJSON().id

	}

	async update(user: User, transactionId?: string): Promise<boolean> {

		let set = [
			`name = @name`,
			`phone = @phone`,
			`email = @email`,
			`password = @password`,
			`tfa = @tfa`,
			`updated_at = @updatedAt`
		]

		let params: { [k: string]: any } = {
			id: user.id,
			name: user.name,
			phone: user.phone,
			email: user.email,
			password: user.password,
			tfa: user.tfa,
			updatedAt: user.updatedAt
		}
		let types: { [k: string]: any } = {
			id: 'string',
			name: 'string',
			phone: 'string',
			email: 'string',
			password: 'string',
			tfa: 'bool',
			updatedAt: 'timestamp'
		}

		if (user.confirmedAt) {

			set.push(`confirmed_at = @confirmedAt`)
			params.confirmedAt = user.confirmedAt
			types.confirmedAt = 'timestamp'

		} else {

			set.push(`confirmed_at = null`)

		}

		if (user.deletedAt) {

			set.push(`deleted_at = @deletedAt`)
			params.deletedAt = user.deletedAt
			types.deletedAt = 'timestamp'

		} else {

			set.push(`deleted_at = null`)

		}

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `UPDATE users SET ${set.join(', ')} WHERE id = @id`,
			params,
			types
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 0

	}

	async delete(id: string, transactionId?: string): Promise<boolean> {

		const [ rows, state, metadata ] = await (transactionId ? this.transactions[transactionId] : this.database).run({
			sql: `DELETE FROM users WHERE id = @id`,
			params: {
				id: new UUID(id).toString()
			},
			types: {
				id: 'string'
			}
		}).catch((err: any) => {

			throw err

		})

		return rows.length > 0

	}

}
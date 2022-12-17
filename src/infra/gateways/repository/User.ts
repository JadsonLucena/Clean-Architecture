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

}
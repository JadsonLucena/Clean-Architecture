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

}
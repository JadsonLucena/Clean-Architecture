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

}
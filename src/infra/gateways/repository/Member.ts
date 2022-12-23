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

}
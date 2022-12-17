import UUID from '../../../domain/VO/UUID'
import Name from '../../../domain/VO/Name'

import Project from '../../../domain/entities/Project'

import IProjectRepository from '../../../domain/ports/repository/IProject'

import Repository from './Repository'

export default class ProjectRepository extends Repository implements IProjectRepository {

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
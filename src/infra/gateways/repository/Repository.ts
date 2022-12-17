import Entity from '../../../domain/entities/Entity'

import IRepository from '../../../domain/ports/repository/IRepository'

import { Spanner, Transaction } from '@google-cloud/spanner' // types: 'float64' | 'int64' | 'numeric' | 'bool' | 'string' | 'bytes' | 'json' | 'timestamp' | 'date' | 'struct' | 'array'

export default abstract class Repository implements IRepository {

	readonly host
	readonly username
	readonly password
	readonly dbname

	protected readonly spanner
	protected readonly instance
	protected readonly database
	protected readonly transactions: { [k: string]: Transaction }

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

		this.host = host
		this.username = username
		this.password = password
		this.dbname = dbname

		this.spanner = new Spanner({ projectId: host })
		this.instance = this.spanner.instance(username)
		this.database = this.instance.database(dbname)

		this.transactions = {}

	}

	abstract find(props: { [k: string]: any }, transactionId?: string): Promise<Entity[]>

	abstract insert(entity: Entity, transactionId?: string): Promise<string>

	abstract update(entity: Entity, transactionId?: string): Promise<boolean>

	abstract delete(id: string, transactionId?: string): Promise<boolean>

}
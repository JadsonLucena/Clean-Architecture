import Scope from '../VO/Scope'

import Entity from './Entity'

export default class Permission extends Entity {

	// @ts-ignore
	#scope: Scope
	// @ts-ignore
	#updatedAt: Date

	constructor({
		id,
		scope,
		createdAt,
		updatedAt
	}: {
		id: string,
		scope: string,
		createdAt: string,
		updatedAt: string
	}) {

		super({
			id,
			createdAt
		})

		this.scope = scope
		this.updatedAt = updatedAt

	}

	set scope(scope: string) {

		this.#scope = new Scope(scope)

	}

	set updatedAt(updatedAt: string) {

		this.#updatedAt = new Date(updatedAt)

	}

	get scope() { return this.#scope.toString() }
	get updatedAt() { return this.#updatedAt.toISOString() }

}
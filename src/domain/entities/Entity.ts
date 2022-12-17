import UUID from '../VO/UUID'

export default abstract class Entity {

	// @ts-ignore
	#id: UUID
	// @ts-ignore
	#createdAt: Date

	constructor({
		id,
		createdAt
	}: {
		id: string,
		createdAt: string
	}) {

		this.id = id
		this.createdAt = createdAt

	}

	set id(id: string) {

		this.#id = new UUID(id)

	}

	set createdAt(createdAt: string) {

		this.#createdAt = new Date(createdAt)

	}

	get id() { return this.#id.toString() }
	get createdAt() { return this.#createdAt.toISOString() }

}
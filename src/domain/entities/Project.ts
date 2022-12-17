import UUID from '../VO/UUID'
import Name from '../VO/Name'
import Base64 from '../VO/Base64'

import Entity from './Entity'

export default class Project extends Entity {

	// @ts-ignore
	#name: Name
	// @ts-ignore
	#thumb?: Base64 | null
	// @ts-ignore
	#createdBy?: UUID | null
	// @ts-ignore
	#updatedAt: Date
	// @ts-ignore
	#deletedAt?: Date | null

	constructor({
		id,
		name,
		thumb,
		createdBy,
		createdAt,
		updatedAt,
		deletedAt
	}: {
		id: string,
		name: string,
		thumb?: string,
		createdBy?: string,
		createdAt: string,
		updatedAt: string,
		deletedAt?: string
	}) {

		super({
			id,
			createdAt
		})

		this.name = name
		this.thumb = thumb
		this.createdBy = createdBy
		this.updatedAt = updatedAt
		this.deletedAt = deletedAt

	}

	set name(name: string) {

		this.#name = new Name(name, {
			minAmountOfLastNames: 0
		})

	}

	set thumb(thumb: string | null | undefined) {

		this.#thumb = typeof thumb == 'string' ? new Base64(thumb) : thumb

	}

	set createdBy(createdBy: string | null | undefined) {

		this.#createdBy = typeof createdBy == 'string' ? new UUID(createdBy) : createdBy

	}

	set updatedAt(updatedAt: string) {

		this.#updatedAt = new Date(updatedAt)

	}

	set deletedAt(deletedAt: string | null | undefined) {

		this.#deletedAt = typeof deletedAt == 'string' ? new Date(deletedAt) : deletedAt

	}

	get name() { return this.#name.toString() }
	get thumb() { return this.#thumb?.toString() }
	get createdBy() { return this.#createdBy?.toString() }
	get updatedAt() { return this.#updatedAt.toISOString() }
	get deletedAt() { return this.#deletedAt?.toISOString() }

}
import UUID from '../VO/UUID'
import Name from '../VO/Name'

import Entity from './Entity'

export default class Role extends Entity {

	// @ts-ignore
	#name: Name
	// @ts-ignore
	#projectId: UUID
	// @ts-ignore
	#permissions: UUID[]
	// @ts-ignore
	#createdBy?: UUID | null
	// @ts-ignore
	#updatedAt: Date

	constructor({
		id,
		name,
		projectId,
		permissions,
		createdBy,
		createdAt,
		updatedAt
	}: {
		id: string,
		name: string,
		projectId: string,
		permissions: string[],
		createdBy?: string,
		createdAt: string,
		updatedAt: string
	}) {

		super({
			id,
			createdAt
		})

		this.name = name
		this.projectId = projectId
		this.permissions = permissions
		this.createdBy = createdBy
		this.updatedAt = updatedAt

	}

	set name(name: string) {

		this.#name = new Name(name, {
			minAmountOfLastNames: 0
		})

	}

	set projectId(projectId: string) {

		this.#projectId = new UUID(projectId)

	}

	set permissions(permissions: string[]) {

		this.#permissions = permissions.map(permissionId => new UUID(permissionId))

	}

	set createdBy(createdBy: string | null | undefined) {

		this.#createdBy = typeof createdBy == 'string' ? new UUID(createdBy) : createdBy

	}

	set updatedAt(updatedAt: string) {

		this.#updatedAt = new Date(updatedAt)

	}

	get name() { return this.#name.toString() }
	get projectId() { return this.#projectId?.toString() }
	get permissions() { return this.#permissions?.map(permissionId => permissionId.toString()) }
	get createdBy() { return this.#createdBy?.toString() }
	get updatedAt() { return this.#updatedAt.toISOString() }

}
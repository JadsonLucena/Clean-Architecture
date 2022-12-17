import UUID from '../VO/UUID'

import Entity from './Entity'

export default class Member extends Entity {

	// @ts-ignore
	#projectId: UUID
	// @ts-ignore
	#userId: UUID
	// @ts-ignore
	#roleId: UUID
	// @ts-ignore
	#createdBy?: UUID | null
	// @ts-ignore
	#confirmedAt?: Date | null
	// @ts-ignore
	#updatedAt: Date

	constructor({
		id,
		projectId,
		userId,
		roleId,
		createdBy,
		createdAt,
		confirmedAt,
		updatedAt
	}: {
		id: string,
		projectId: string,
		userId: string,
		roleId: string,
		createdBy?: string,
		createdAt: string,
		confirmedAt?: string,
		updatedAt: string
	}) {

		super({
			id,
			createdAt
		})

		this.projectId = projectId
		this.userId = userId
		this.roleId = roleId
		this.createdBy = createdBy
		this.confirmedAt = confirmedAt
		this.updatedAt = updatedAt

	}

	set projectId(projectId: string) {

		this.#projectId = new UUID(projectId)

	}

	set userId(userId: string) {

		this.#userId = new UUID(userId)

	}

	set roleId(roleId: string) {

		this.#roleId = new UUID(roleId)

	}

	set createdBy(createdBy: string | null | undefined) {

		this.#createdBy = typeof createdBy == 'string' ? new UUID(createdBy) : createdBy

	}

	set confirmedAt(confirmedAt: string | null | undefined) {

		this.#confirmedAt = typeof confirmedAt == 'string' ? new Date(confirmedAt) : confirmedAt

	}

	set updatedAt(updatedAt: string) {

		this.#updatedAt = new Date(updatedAt)

	}

	get projectId() { return this.#projectId.toString() }
	get userId() { return this.#userId.toString() }
	get roleId() { return this.#roleId.toString() }
	get createdBy() { return this.#createdBy?.toString() }
	get confirmedAt() { return this.#confirmedAt?.toISOString() }
	get updatedAt() { return this.#updatedAt.toISOString() }

}
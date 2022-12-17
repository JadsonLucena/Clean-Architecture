import Name from '../VO/Name'
import Email from '../VO/Email'
import Login from '../VO/Login'
import Phone from '../VO/Phone'
import Password from '../VO/Password'

import Entity from './Entity'

export default class User extends Entity {

	// @ts-ignore
	#name: Name
	// @ts-ignore
	#phone: Phone
	// @ts-ignore
	#email: Email
	// @ts-ignore
	// readonly newEmail: Email
	// @ts-ignore
	// readonly username: string
	// @ts-ignore
	#login: Login
	// @ts-ignore
	#password: Password
	// @ts-ignore
	#tfa: Boolean
	// @ts-ignore
	#confirmedAt?: Date | null
	// @ts-ignore
	#updatedAt: Date
	// @ts-ignore
	#deletedAt?: Date | null

	constructor({
		id,
		name,
		phone,
		email,
		login,
		password,
		tfa,
		createdAt,
		confirmedAt,
		updatedAt,
		deletedAt
	}: {
		id: string,
		name: string,
		phone: string,
		email: string,
		login: string,
		password: string,
		tfa: boolean,
		createdAt: string,
		confirmedAt?: string | null,
		updatedAt: string,
		deletedAt?: string | null
	}) {

		super({
			id,
			createdAt
		})

		this.name = name
		this.phone = phone
		this.email = email
		this.login = login
		this.password = password
		this.tfa = tfa
		this.confirmedAt = confirmedAt
		this.updatedAt = updatedAt
		this.deletedAt = deletedAt

	}

	set name(name: string) {

		this.#name = new Name(name)

	}

	set phone(phone: string) {

		this.#phone = new Phone(phone)

	}

	set email(email: string) {

		this.#email = new Email(email)

	}

	set login(login: string) {

		this.#login = new Login(login)

	}

	set password(password: string) {

		this.#password = new Password(password)

	}

	set tfa(tfa: boolean) {

		this.#tfa = new Boolean(tfa)

	}

	set confirmedAt(confirmedAt: string | null | undefined) {

		this.#confirmedAt = typeof confirmedAt == 'string' ? new Date(confirmedAt) : confirmedAt

	}

	set updatedAt(updatedAt: string) {

		this.#updatedAt = new Date(updatedAt)

	}

	set deletedAt(deletedAt: string | null | undefined) {

		this.#deletedAt = typeof deletedAt == 'string' ? new Date(deletedAt) : deletedAt

	}

	get name() { return this.#name.toString() }
	get phone() { return this.#phone.toString() }
	get email() { return this.#email.toString() }
	get login() { return this.#login.toString() }
	get password() { return this.#password.toString() }
	get tfa() { return Boolean(this.#tfa) }
	get confirmedAt() { return this.#confirmedAt?.toISOString() }
	get updatedAt() { return this.#updatedAt.toISOString() }
	get deletedAt() { return this.#deletedAt?.toISOString() }

}
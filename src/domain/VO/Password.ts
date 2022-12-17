import crypto from 'crypto'

export default class Password extends String {

	private static readonly pattern = new RegExp(`^\\$(?<digest>(${crypto.getHashes().join('|')}))\\$(?<iterations>\\d+)\\$(?<salt>[^.]+)\\.(?<hash>.+)$`, 'i')

	constructor(password: string, {
		digest,
		iterations,
		keylen,
		minLength = 3,
		salt,
		strong = false
	}: {
		digest?: string,
		iterations?: number,
		keylen?: number,
		minLength?: number,
		salt?: string,
		strong?: boolean
	} = {}) {

		if (Password.isHashed(password)) {

			super(password.trim())

		} else {

			if (password.length < minLength) {

				throw new TypeError('password less than required')

			} else if (strong && !Password.isStrong(password)) {

				throw new TypeError('password is not strong')

			}

			super(Password.format(password, {
				digest,
				iterations,
				keylen,
				salt
			}))
		}

	}

	private static format(password: string, {
		digest = 'sha512',
		iterations = 100000,
		keylen = 64,
		salt = crypto.randomBytes(16).toString('base64url')
	}: {
		digest?: string,
		iterations?: number,
		keylen?: number,
		salt?: string
	} = {}) {

		if (Password.isHashed(password)) {

			throw new SyntaxError('password is already hashed')

		} else if (!crypto.getHashes().includes(digest)) {

			throw new TypeError('Invalid digest')

		} else if (iterations < 1) {

			throw new TypeError('Invalid iterations')

		} else if (keylen < 1) {

			throw new TypeError('Invalid keylen')

		} else if (salt.length < 1) {

			throw new TypeError('Invalid salt')

		}

		const hash = crypto.pbkdf2Sync(Buffer.from(password.normalize('NFC'), 'utf8'), salt, iterations, keylen, digest).toString('base64url')

		// Modular Crypt Format
		return `$${digest}$${iterations}$${salt}.${hash}`

	}

	static hasNumber(password: string) {

		return /\d/.test(password)

	}

	static hasLowercase(password: string) {

		return /[a-z]/.test(password)

	}

	static hasUppercase(password: string) {

		return /[A-Z]/.test(password)

	}

	static hasSpecialCharacter(password: string) {

		return /[^a-z0-9]/i.test(password)

	}

	static isHashed(password: string) {

		return Password.pattern.test(password)

	}

	static isStrong(password: string) {

		if (
			!Password.hasNumber(password)
			|| !Password.hasLowercase(password)
			|| !Password.hasUppercase(password)
			|| !Password.hasSpecialCharacter(password)
		) {

			return false

		}

		return true

	}

	parse() {

		return this.match(Password.pattern)!.groups as {
			digest: string,
			iterations: string,
			salt: string,
			hash: string
		}

	}

	static verify(hashedPassword: string, password: string) {

		const parsedPassword = hashedPassword.match(Password.pattern)?.groups

		if (!parsedPassword) {

			throw new TypeError('Invalid hashedPassword')

		}

		return crypto.timingSafeEqual(Buffer.from(parsedPassword.hash, 'base64url'), crypto.pbkdf2Sync(password, parsedPassword.salt, parseInt(parsedPassword.iterations), Buffer.from(parsedPassword.hash, 'base64url').length, parsedPassword.digest))

	}

}
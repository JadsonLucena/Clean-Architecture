export default class Email extends String {

	private static readonly pattern = new RegExp(`^\\s*(?<username>[a-z\\d](?:[+.-]?\\w+)*)@(?<domain>(?:[^.]+\\.)*(?:[a-z\\d][a-z\\d-]+[a-z\\d])(?:\\.[a-z]{2,})(?:.[a-z]{2})?)\\s*$`, 'i')

	constructor(email: string) {

		if (!Email.verify(email)) {

			throw new TypeError('Invalid email')

		}


		super(Email.format(email))

	}

	private static format(email: string) {

		return email.normalize('NFC').trim().toLowerCase()

	}

	parse() {

		return this.match(Email.pattern)!.groups as {
			username: string,
			domain: string
		}

	}

	static verify(email: string) {

		return Email.pattern.test(email)

	}

}
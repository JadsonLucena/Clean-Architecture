export default class Login extends String {

	private static readonly pattern = new RegExp(`^\\s*(?<username>[a-z\\d](?:[+.-]?\\w+)*)(@(?<domain>(?:[^.]+\\.)*(?:[a-z\\d][a-z\\d-]+[a-z\\d])(?:\\.[a-z]{2,})(?:.[a-z]{2})?))?\\s*$`, 'i')

	constructor(login: string) {

		if (!Login.verify(login)) {

			throw new TypeError('Invalid login')

		}


		super(Login.format(login))

	}

	private static format(login: string) {

		return login.normalize('NFC').trim().toLowerCase()

	}

	parse() {

		return this.match(Login.pattern)!.groups as {
			username: string,
			domain: string
		}

	}

	static verify(login: string) {

		return Login.pattern.test(login)

	}

}
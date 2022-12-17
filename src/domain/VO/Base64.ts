export default class Base64 extends String {

	private static readonly pattern = new RegExp(`^\\s*(?:data\\s*:\\s*(?<mediaType>[^/]+\\s*/\\s*[^;]+(?:\\s*;\\s*[a-z0-9-]+=[a-z0-9-]+)?)?(?:\\s*;\\s*base64)?\\s*,?)?\\s*(?<data>[A-Z0-9+/]*=*)\\s*$`, 'i')

	constructor(base64: string) {

		if (!Base64.verify(base64)) {

			throw new TypeError('Invalid base64')

		}


		super(Base64.format(base64))

	}

	private static format(base64: string) {

		return base64.normalize('NFC').trim().replace(/\s+/g, '')

	}

	parse() {

		return this.match(Base64.pattern)!.groups as {
			mediaType: string,
			data: string
		}

	}

	static verify(base64: string) {

		return Base64.pattern.test(base64)

	}

}
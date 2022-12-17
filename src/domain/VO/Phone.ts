export default class Phone extends String {

	private static readonly pattern = new RegExp(`^\\s*(?<country>\\s*\\+\\s*(?:1\\s*-)?\\s*\\d{1,3}\\*?)\\s*?\\(?\\s*(?<area>\\d{1,3})\\s*\\)?\\s*?(?<number>\\d\\s*\\d{3,4}\\s*-?\\s*\\d{4})\\s*$`)

	constructor(phone: string) {

		if (!Phone.verify(phone)) {

			throw new TypeError('Invalid phone')

		}

		super(Phone.format(phone))

	}

	private static format(phone: string) {

		return (({
			country,
			area,
			number
		}: {
			country?: string,
			area?: string,
			number?: string
		} = {}): string => {

			number = number?.replace(/(\s|-)/g, '')

			return `${country} (${area}) ${number?.slice(0, -4)}-${number?.slice(-4)}`

		})(phone.normalize('NFC').trim().replace(/\s+/g, ' ').match(Phone.pattern)?.groups)

	}

	parse() {

		return this.match(Phone.pattern)!.groups as {
			country: string,
			area: string,
			number: string
		}

	}

	static verify(phone: string) {

		return Phone.pattern.test(phone)

	}

}
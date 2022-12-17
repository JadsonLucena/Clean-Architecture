export default class Name extends String {

	private static readonly pattern = new RegExp(`^\\s*(?<firstName>[A-ZÀ-Ÿ][A-zÀ-ÿ']*)(?:\\s+(?<lastName>[A-ZÀ-Ÿ][A-zÀ-ÿ']*(?:\\s+[A-ZÀ-Ÿ][A-zÀ-ÿ']*)*))?\\s*$`, 'i')

	constructor(name: string, {
		minLength,
		maxLength,
		minAmountOfLastNames
	}: {
		minLength?: number,
		maxLength?: number,
		minAmountOfLastNames?: number
	} = {}) {

		if (!Name.verify(name, {
			minLength,
			maxLength,
			minAmountOfLastNames
		})) {

			throw new TypeError('Invalid name')

		}


		super(Name.format(name))

	}

	private static format(name: string) {

		return name.normalize('NFC').trim().replace(/\s+/g, ' ')

	}

	parse() {

		return this.match(Name.pattern)!.groups as {
			firstName: string,
			lastName: string
		}

	}

	static verify(name: string, {
		minLength = 1,
		maxLength = 255,
		minAmountOfLastNames = 1
	}: {
		minLength?: number,
		maxLength?: number,
		minAmountOfLastNames?: number
	} = {}) {

		if (minLength < 1) {

			throw new SyntaxError('Invalid minLength')

		} else if (maxLength < minLength) {

			throw new SyntaxError('Invalid maxLength')

		} else if (minAmountOfLastNames < 0) {

			throw new SyntaxError('Invalid minAmountOfLastNames')

		}

		const nameParsed = name.match(Name.pattern)?.groups

		return (
			name.length >= minLength
			&& name.length <= maxLength
			&& nameParsed
			&& (nameParsed.lastName?.length || 0) >= minAmountOfLastNames
		)

	}

}
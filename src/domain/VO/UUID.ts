// To do: Extend to v1 and v5

import crypto from 'crypto'

export default class UUID extends String {

	private static readonly pattern = new RegExp(`^\\s*(?<time_low>[0-9a-f]{8})-?(?<time_mid>[0-9a-f]{4})-?(?<time_hi_and_version>(?<version>[0-9a-f])[0-9a-f]{3})-?(?<clock_sequence_and_variant>(?<variant>[0-9a-f])[0-9a-f]{3})-?(?<node>[0-9a-f]{12})\\s*$`, 'i')

	constructor(uuid: string = crypto.randomUUID()) {

		super(UUID.format(uuid))

	}

	private static format(uuid: string) {

		if (!UUID.verify(uuid)) {

			throw new TypeError('Invalid uuid')

		}

		uuid = uuid.normalize('NFC').trim().replace(/-/g, '')

		return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20, 32)}`

	}

	parse() {

		return this.match(UUID.pattern)!.groups as {
			time_low: string,
			time_mid: string,
			time_hi_and_version: string,
			version: string,
			clock_sequence_and_variant: string,
			variant: string,
			node: string
		}

	}

	static verify(uuid: string) {

		return uuid.normalize('NFC').trim().match(UUID.pattern)?.groups?.version == '4'

	}

}
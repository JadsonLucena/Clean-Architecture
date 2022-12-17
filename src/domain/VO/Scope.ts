export default class Scope extends String {

	static readonly methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE']
	private static readonly pattern = new RegExp(`^\\s*(?<method>(${Scope.methods.join('|')})):(?<resource>[^:@./?=#]+)\\s*$`, 'i')

	constructor(scope: string) {

		if (!Scope.verify(scope)) {

			throw new TypeError('Invalid scope')

		}


		super(Scope.format(scope))

	}

	private static format(scope: string) {

		return scope.normalize('NFC').trim().toUpperCase()

	}

	parse() {

		return this.match(Scope.pattern)!.groups as {
			method: string,
			resource: string
		}

	}

	static verify(scope: string) {

		return Scope.pattern.test(Scope.format(scope))

	}

}
import { expect } from 'chai'
import { resolveReference, ruleParents } from '../source/utils'

describe('ruleParents', function() {
	it('should procude an array of the parents of a rule', function() {
		let parents = ruleParents(
			'CDD . taxe . montant annuel . exonération annuelle'
		)
		expect(parents).to.eql(['CDD . taxe . montant annuel', 'CDD . taxe', 'CDD'])
	})
})
describe('resolveReference', function() {
	it("should disambiguate a reference to another rule in a rule, given the latter's namespace", function() {
		const rawRules = {
			CDD: { question: 'CDD ?' },
			'CDD . taxe': { formule: 'montant annuel / 12' },
			'CDD . condition': {},
			'CDD . taxe . montant annuel': {
				formule: '20 - exonération annuelle'
			},
			'CDD . taxe . montant annuel . exonération annuelle': {
				formule: 20
			}
		}
		expect(
			resolveReference(
				rawRules,
				'CDD . taxe . montant annuel',
				'exonération annuelle'
			)
		).to.eql('CDD . taxe . montant annuel . exonération annuelle')
		expect(
			resolveReference(rawRules, 'CDD . taxe . montant annuel', 'condition')
		).to.eql('CDD . condition')
	})
})

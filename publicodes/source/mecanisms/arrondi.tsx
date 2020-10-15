import React from 'react'
import { InfixMecanism } from '../components/mecanisms/common'
import { evaluateNode, makeJsx, mergeMissing } from '../evaluation'
import { EvaluatedNode } from '../types'

export type ArrondiExplanation = {
	valeur: EvaluatedNode<string, number>
	arrondi: EvaluatedNode<string, number>
}
	
function MecanismArrondi({ explanation }) {
	return (
		<InfixMecanism value={explanation.valeur}>
			<p>
				<strong>Arrondi : </strong>
				{makeJsx(explanation.arrondi)}
			</p>
		</InfixMecanism>
	)
}

function roundWithPrecision(n: number, fractionDigits: number) {
	return +n.toFixed(fractionDigits)
}

const evaluate = (cache, situation, parsedRules, node) => {
	const evaluateAttribute = evaluateNode.bind(
		null,
		cache,
		situation,
		parsedRules
	)
	const valeur = evaluateAttribute(node.explanation.valeur)
	const nodeValue = valeur.nodeValue
	let arrondi = node.explanation.arrondi
	if (nodeValue !== false) {
		arrondi = evaluateAttribute(arrondi)
	}

	return {
		nodeValue:
			typeof arrondi.nodeValue === 'number'
				? roundWithPrecision(valeur.nodeValue, arrondi.nodeValue)
				: arrondi.nodeValue === true
				? roundWithPrecision(valeur.nodeValue, 0)
				: arrondi.nodeValue === null
				? null
				: valeur.nodeValue,
		explanation: { valeur, arrondi },
		missingVariables: mergeMissing(valeur, arrondi)
	}
}

export default function Arrondi(recurse, v)  {
	const explanation = {
		valeur: recurse(v.valeur),
		arrondi: recurse(v.arrondi)
	}
	return {
		evaluate,
		jsx: MecanismArrondi,
		explanation,
		category: 'mecanism',
		name: 'arrondi',
		type: 'numeric',
		unit: explanation.valeur.unit
	}
}

Arrondi.nom = 'arrondi'

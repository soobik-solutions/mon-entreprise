import { goBackToSimulation } from 'Actions/actions'
import SearchButton from 'Components/SearchButton'
import * as Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Documentation, getDocumentationSiteMap } from 'publicodes'
import React, { useCallback, useContext, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation, Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import SearchBar from 'Components/SearchBar'
import emoji from 'react-easy-emoji'
import styled from 'styled-components'

export default function RulePage() {
	const currentSimulation = useSelector(
		(state: RootState) => !!state.simulation?.url
	)
	const engine = useContext(EngineContext)
	const documentationPath = useContext(SitePathsContext).documentation.index
	const { pathname } = useLocation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	const { i18n } = useTranslation()

	if (pathname === '/documentation') {
		return <DocumentationLanding rules={engine.getParsedRules()} />
	}
	if (!documentationSitePaths[pathname]) {
		return <Redirect to="/404" />
	}
	return (
		<Animate.fromBottom>
			<ScrollToTop key={pathname} />
			<div
				css={`
					display: flex;
					margin-top: 2rem;
					justify-content: space-between;
				`}
			>
				{currentSimulation ? <BackToSimulation /> : <span />}
				<SearchButton key={pathname} />
			</div>
			<Documentation
				language={i18n.language as 'fr' | 'en'}
				engine={engine}
				documentationPath={documentationPath}
			/>
			{/* <button>Voir l</button> */}
		</Animate.fromBottom>
	)
}
function BackToSimulation() {
	const dispatch = useDispatch()
	const handleClick = useCallback(() => {
		dispatch(goBackToSimulation())
	}, [])
	return (
		<button
			className="ui__ simple small push-left button"
			onClick={handleClick}
		>
			← <Trans i18nKey="back">Reprendre la simulation</Trans>
		</button>
	)
}

function DocumentationLanding({ rules }) {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<h1>
				<Trans i18nKey="page.documentation.title">
					Couverture législative <>{emoji('⚖')}</>
				</Trans>
			</h1>
			<p>
				Cette page référence les dispositifs existants dans la législation
				française en matière de droit de la sécurité sociale, droit fiscal, et
				plus partiellement en droit du travail. Cette liste n'est pas exhaustive
				mais permet d'avoir un aperçu synthétique des sujets couverts et de ceux
				non couverts par{' '}
				<Link to={sitePaths.simulateurs.index}>nos simulateurs</Link>.
			</p>
			<div css="display: flex">
				<span>{emoji('🔍')}</span>
				<SearchBar rules={rules} />
			</div>
			<div css="margin-left: -3%;">
				<DocumentationLandingSection>
					<h3>Formes de travail {emoji('📃')}</h3>
					<p>
						<strong>Salariés et assimilés : </strong> CDI, CDD, CDI de chantier,
						CUI, CTT, Contrat d'apprentissage, Contrat de professionnalisation,
						Convention de stage, Doctorat, Travailleur à domicile, Assistant
						maternel et familial
					</p>
					<p>
						<strong>Indépendants : </strong> Auto-entrepreneurs, Artisan,
						commerçant, Professions libérales, Professions libérales réglementés
						(medecin, avocat, notaire, etc.), Dirigeants assimilés salarié,
						Agriculteurs, Artistes-auteurs, Marins, Conjoint collaborateur
					</p>
					<p>
						<strong>Fonction publique : </strong> Titulaires, Non titulaires
						(contractuels, auxiliaires, vacataires, etc.), Élus, Militaires
					</p>
				</DocumentationLandingSection>
				<DocumentationLandingSection>
					<h3>Formes sociales {emoji('🏢')}</h3>
					<ul>
						<li>Micro-entreprise</li>
						<li>Entreprise individuelle (EI, EIRL)</li>
						<li>Sociétés anonymes avec un gérant indépendant (SARL, EURL)</li>
						<li>
							Sociétés anonymes avec un président assimilé salarié (SA, SAS,
							SASU)
						</li>
						<li>
							Entreprises d'exercice libéral (SELARL, SELAFA, SELCA, SELAS,
							SELASU)
						</li>
						<li>Sociétés civiles (SCI, SCP, SCCV, SEP) </li>
						<li>Sociétés de personnes (SNC, SCS)</li>
						<li>Coopératives (SCOP, SCIC, SCA) #181</li>
						<li>Exploitations agricoles (EARL, GAEC, SCEA)</li>
						<li>Societas europaea (SE)</li>
						<li>Associations #585 (loi 1901, AARPI)</li>
						<li>Sociétés d'économie mixte (SAEM, SAEML, SAIEM)</li>
						<li>Sociétés d'investissement et titrisation (SIIC, FCT, ST)</li>
						<li>Groupements (GIE, GIP, GFF, GFI)</li>
						<li>Établissements publics (EPA, EPIC)</li>
						<li>Fondations, fonds de dotation</li>
					</ul>
				</DocumentationLandingSection>
			</div>
		</>
	)
}

const DocumentationLandingSection = styled.section`
	border: 1px solid var(--lighterColor);
	float: left;
	margin-left: 3%;
	margin-top: 1rem;
	width: 47%;
	padding: 0 1.5rem 2rem;

	p,
	ul {
		font-size: 0.8em;
	}
`

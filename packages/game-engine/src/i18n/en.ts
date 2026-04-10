export const en: Record<string, string> = {
  // ─── Difficulty ────────────────────────────────────────────────────────────
  'difficulty.easy.flavor': 'The wind is at your back. For now.',
  'difficulty.normal.flavor': 'The republic trembles. You decide if it falls.',
  'difficulty.hard.flavor': 'The abyss stares at you. Will you stare back?',
  'difficulty.crisis.flavor': 'Everything is on fire. Welcome.',

  // ─── Shocks ────────────────────────────────────────────────────────────────
  'shock.oilPriceSpike': 'Oil Price Spike',
  'shock.globalRecession': 'Global Recession',
  'shock.currencyAttack': 'Currency Speculative Attack',
  'shock.tradeWar': 'International Trade War',
  'shock.pandemic': 'Pandemic',
  'shock.naturalDisaster': 'Natural Disaster',
  'shock.techBoom': 'Tech Boom',
  'shock.foreignInvestment': 'Massive Foreign Investment',

  // ─── Political cards ───────────────────────────────────────────────────────
  'event.pol_001.title': 'Corruption Scandal',
  'event.pol_001.body': 'Leaked documents reveal irregular payments to officials of the ruling party. The media demands an immediate response.',
  'event.pol_001.choice_a': 'Publicly dismiss the accusations',
  'event.pol_001.choice_b': 'Order an independent investigation',
  'event.pol_001.choice_c': 'Announce an anti-corruption reform package',

  'event.pol_002.title': 'General Strike',
  'event.pol_002.body': 'Unions call a 48-hour strike to protest working conditions. The streets fill with demonstrators.',
  'event.pol_002.choice_a': 'Yield to union demands',
  'event.pol_002.choice_b': 'Declare essential services mandatory',

  'event.pol_003.title': 'Coalition Fracture',
  'event.pol_003.body': 'A minor coalition partner threatens to withdraw support unless their demands are included in the budget.',
  'event.pol_003.choice_a': 'Negotiate budget concessions',
  'event.pol_003.choice_b': 'Publicly reject their political blackmail',

  'event.pol_004.title': 'Constitutional Reform',
  'event.pol_004.body': 'Your party proposes significant constitutional reforms. The opposition cries coup, the people are divided.',
  'event.pol_004.choice_a': 'Force a constitutional referendum',
  'event.pol_004.choice_b': 'Withdraw the reform, wait for a better moment',
  'event.pol_004.choice_c': 'Present a moderate version to Congress',

  'event.pol_005.title': 'Journalist Assassinated',
  'event.pol_005.body': 'An investigative journalist is murdered. Everything points to links between organized crime and government contacts.',
  'event.pol_005.choice_a': 'Control the flow of information',
  'event.pol_005.choice_b': 'Order an open judicial investigation',

  'event.pol_006.title': 'Minimum Wage Increase',
  'event.pol_006.body': 'Workers demand a 40% minimum wage increase. Business leaders threaten mass layoffs.',
  'event.pol_006.choice_a': 'Decree the increase immediately',
  'event.pol_006.choice_b': 'Negotiate a gradual increase with industry',

  'event.pol_007.title': 'Cabinet Crisis',
  'event.pol_007.body': 'Three key ministers simultaneously resign, citing irreconcilable differences with the government\'s direction.',
  'event.pol_007.choice_a': 'Accept resignations and renew the cabinet',
  'event.pol_007.choice_b': 'Retain ministers with new incentives',

  'event.pol_008.title': 'Municipal Elections',
  'event.pol_008.body': 'Municipal election results arrive: mixed results reflecting the electorate\'s mood.',
  'event.pol_008.choice_a': 'Celebrate advances and project confidence',
  'event.pol_008.choice_b': 'Acknowledge weaknesses and promise changes',

  'event.pol_009.title': 'Structural Reform Package',
  'event.pol_009.body': 'The IMF recommends deep structural reforms. Congress is reluctant. The economy needs it.',
  'event.pol_009.choice_a': 'Submit a comprehensive bill to Congress',
  'event.pol_009.choice_b': 'Implement reforms by emergency decree',

  'event.pol_010.title': 'Summit with Opposition',
  'event.pol_010.body': 'The opposition leader proposes national dialogue to overcome polarization. An opportunity or a trap.',
  'event.pol_010.choice_a': 'Accept dialogue on equitable terms',
  'event.pol_010.choice_b': 'Reject and highlight opposition hypocrisy',

  'event.pol_011.title': 'Social Housing Plan',
  'event.pol_011.body': 'Thousands of homeless families demand urgent solutions. An ambitious plan could change things.',
  'event.pol_011.choice_a': 'Launch a massive public housing program',
  'event.pol_011.choice_b': 'Incentivize private construction with subsidies',

  'event.pol_012.title': 'Energy Policy Referendum',
  'event.pol_012.body': 'Citizens demand to vote on the country\'s energy future: renewables vs. fossil fuels.',
  'event.pol_012.choice_a': 'Call a binding referendum',
  'event.pol_012.choice_b': 'Implement policy by technical decree',

  'event.pol_013.title': 'Violence at Protests',
  'event.pol_013.body': 'Anti-government demonstrations escalate into clashes with security forces. There are injuries.',
  'event.pol_013.choice_a': 'Order dialogue and immediate de-escalation',
  'event.pol_013.choice_b': 'Reinforce police presence to restore order',

  'event.pol_014.title': 'Strategic Electoral Alliance',
  'event.pol_014.body': 'A party with significant representation proposes a formal alliance that would shift the balance of power.',
  'event.pol_014.choice_a': 'Formalize the alliance with concrete commitments',
  'event.pol_014.choice_b': 'Reject the alliance on ideological grounds',

  'event.pol_015.title': 'Human Rights Report',
  'event.pol_015.body': 'An international report criticizes human rights conditions under your government. International pressure mounts.',
  'event.pol_015.choice_a': 'Accept the observations and commit to improvement',
  'event.pol_015.choice_b': 'Reject the report as foreign interference',

  // ─── Presidential election arc ───────────────────────────────────────────
  'event.pol_election_campaign.title': 'ELECTION CAMPAIGN',
  'event.pol_election_campaign.body': 'The presidential election is approaching. Polls are tight. How will you fight for re-election?',
  'event.pol_election_campaign.choice_a': 'Massive spending campaign: rallies, ads, and popular promises',
  'event.pol_election_campaign.choice_b': 'Mobilize the grassroots coalition with territorial activism',
  'event.pol_election_campaign.choice_c': 'Media campaign: TV debates and social media',
  'event.pol_election_campaign.choice_d': 'Re-election economic plan: promises to key sectors',

  'event.pol_election_result.title': 'ELECTION DAY',
  'event.pol_election_result.body': 'Argentines went to the polls. Results are coming in from across the country. Tonight the fate of the government is decided.',
  'event.pol_election_result.choice_win': 'The government wins: the people renew the mandate',
  'event.pol_election_result.choice_lose': 'Historic defeat: the opposition wins the election',

  'event.pol_congressional_elections.title': 'MID-TERM ELECTIONS',
  'event.pol_congressional_elections.body': 'Argentines go to the polls to renew half of Congress. The result could strengthen or weaken the ruling bloc.',
  'event.pol_congressional_elections.choice_a': 'Aggressive campaign: the president rallies across the country',
  'event.pol_congressional_elections.choice_b': 'Bipartisan deal: bring in moderate opposition candidates',
  'event.pol_congressional_elections.choice_c': 'Skip the campaign and focus on governing',
  'event.pol_congressional_elections.choice_d': 'Populist pledges: announce bonuses and raises before voting day',

  // ─── Economic cards ────────────────────────────────────────────────────────
  'event.eco_001.title': 'Inflationary Pressure',
  'event.eco_001.body': 'Consumer prices rise for the third consecutive month. The central bank debates whether to intervene.',
  'event.eco_001.choice_a': 'Raise interest rates to curb inflation',
  'event.eco_001.choice_b': 'Hold rates and stimulate growth',
  'event.eco_001.choice_c': 'Establish temporary price controls',

  'event.eco_002.title': 'Foreign Direct Investment',
  'event.eco_002.body': 'A multinational proposes investing $500M in infrastructure but demands special conditions.',
  'event.eco_002.choice_a': 'Accept with the requested conditions',
  'event.eco_002.choice_b': 'Reject and prioritize domestic investment',

  'event.eco_003.title': 'Banking Crisis',
  'event.eco_003.body': 'Two regional banks show liquidity problems. Contagion to the entire system is a real threat.',
  'event.eco_003.choice_a': 'Bank bailout with public funds',
  'event.eco_003.choice_b': 'Let the market resolve the situation',

  'event.eco_004.title': 'Fiscal Reform',
  'event.eco_004.body': 'The fiscal deficit grows. A revenue reform is necessary, but any tax generates resistance.',
  'event.eco_004.choice_a': 'Implement austerity fiscal reform',
  'event.eco_004.choice_b': 'Increase sovereign debt to finance the deficit',

  'event.eco_005.title': 'Exchange Rate Float',
  'event.eco_005.body': 'Markets press on the exchange rate parity. The central bank has limited reserves to defend the rate.',
  'event.eco_005.choice_a': 'Devalue the currency in a controlled manner',
  'event.eco_005.choice_b': 'Defend the exchange rate with reserves',

  'event.eco_006.title': 'IMF Negotiation',
  'event.eco_006.body': 'The IMF offers an emergency credit line with conditionalities. Do you play by their rules?',
  'event.eco_006.choice_a': 'Accept the loan with conditions',
  'event.eco_006.choice_b': 'Refuse and seek alternative financing',

  'event.eco_007.title': 'Tech Sector Boom',
  'event.eco_007.body': 'Domestic startups attract record investment. An opportunity to reorient the economy toward the future.',
  'event.eco_007.choice_a': 'Create a special economic zone for technology',
  'event.eco_007.choice_b': 'Prioritize traditional and industrial sectors',

  'event.eco_008.title': 'State Enterprise Privatization',
  'event.eco_008.body': 'A loss-making public company can be privatized to clean up the books. Unions are opposed.',
  'event.eco_008.choice_a': 'Proceed with partial privatization',
  'event.eco_008.choice_b': 'Keep public company and recapitalize it',

  'event.eco_009.title': 'Stabilization Plan',
  'event.eco_009.body': 'Economists recommend a stabilization shock. Immediate pain, but possible recovery.',
  'event.eco_009.choice_a': 'Implement economic shock therapy',
  'event.eco_009.choice_b': 'Opt for gradual adjustment and moderate expansion',

  'event.eco_010.title': 'Public Spending Cut',
  'event.eco_010.body': 'The budget falls short. Something has to give: education, health, or subsidies.',
  'event.eco_010.choice_a': 'Across-the-board public spending cut',
  'event.eco_010.choice_b': 'Maintain spending with new debt',

  'event.eco_011.title': 'Capital Flight',
  'event.eco_011.body': 'Investors withdraw funds amid political uncertainty. The currency weakens rapidly.',
  'event.eco_011.choice_a': 'Establish temporary capital controls',
  'event.eco_011.choice_b': 'Raise rates to retain investors',

  'event.eco_012.title': 'Infrastructure Mega-Projects',
  'event.eco_012.body': 'A public works plan can reactivate the economy and create massive employment.',
  'event.eco_012.choice_a': 'Launch works plan with public financing',
  'event.eco_012.choice_b': 'Postpone projects and prioritize fiscal stability',

  'event.eco_013.title': 'Credit Rating Downgrade',
  'event.eco_013.body': 'A rating agency downgrades the country\'s credit to junk status. Markets react.',
  'event.eco_013.choice_a': 'Announce emergency austerity plan',
  'event.eco_013.choice_b': 'Ignore the rating and stimulate consumption',

  'event.eco_014.title': 'Energy Subsidies',
  'event.eco_014.body': 'Energy prices spike cost of living. Subsidizing is costly, not subsidizing is too.',
  'event.eco_014.choice_a': 'Expand universal energy subsidies',
  'event.eco_014.choice_b': 'Remove subsidies and let the market act',

  'event.eco_015.title': 'Sovereign Debt Crisis',
  'event.eco_015.body': 'Debt maturities exceed available reserves. A restructuring is inevitable, or is it?',
  'event.eco_015.choice_a': 'Negotiate sovereign debt restructuring',
  'event.eco_015.choice_b': 'Issue new debt to cover maturities',

  // ─── Social cards ──────────────────────────────────────────────────────────
  'event.soc_001.title': 'Mass March',
  'event.soc_001.body': 'Hundreds of thousands march in the capital. Demands vary, but discontent is singular.',
  'event.soc_001.choice_a': 'Receive representatives and negotiate',
  'event.soc_001.choice_b': 'Ignore the march and stay the course',
  'event.soc_001.choice_c': 'Convene a national dialogue table',

  'event.soc_002.title': 'Education Crisis',
  'event.soc_002.body': 'Teachers have been on strike for 30 days. Closed schools threaten the academic year.',
  'event.soc_002.choice_a': 'Meet teacher salary demands',
  'event.soc_002.choice_b': 'Declare education an essential service',

  'event.soc_003.title': 'Basic Food Shortage',
  'event.soc_003.body': 'Inflation and distribution problems cause shortages of flour, oil, and milk.',
  'event.soc_003.choice_a': 'Impose price controls and rationing',
  'event.soc_003.choice_b': 'Import emergency food supplies using reserves',

  'event.soc_004.title': 'Healthcare System Reform',
  'event.soc_004.body': 'Collapse of the public health system demands reform. An opportunity and a minefield.',
  'event.soc_004.choice_a': 'Implement comprehensive universal healthcare reform',
  'event.soc_004.choice_b': 'Partial privatization with targeted subsidies',

  'event.soc_005.title': 'Media Law',
  'event.soc_005.body': 'New media regulation could democratize information... or silence critical voices.',
  'event.soc_005.choice_a': 'Pass media plurality regulation',
  'event.soc_005.choice_b': 'Block the law in the name of press freedom',

  'event.soc_006.title': 'Rising Crime',
  'event.soc_006.body': 'Violence statistics reach historic highs. Society demands a firm hand.',
  'event.soc_006.choice_a': 'Security plan with more police forces',
  'event.soc_006.choice_b': 'Social reform focused on prevention',

  'event.soc_007.title': 'Migration Crisis',
  'event.soc_007.body': 'Thousands of refugees arrive at the borders. Society is polarized between acceptance and rejection.',
  'event.soc_007.choice_a': 'Policy of reception and integration',
  'event.soc_007.choice_b': 'Reinforce border controls',

  'event.soc_008.title': 'Pension Reform',
  'event.soc_008.body': 'The pension system collapses in 10 years without reform. Retirees protest any change.',
  'event.soc_008.choice_a': 'Gradual reform respecting acquired rights',
  'event.soc_008.choice_b': 'Structural individual capitalization reform',

  'event.soc_009.title': 'Separatist Movement',
  'event.soc_009.body': 'A historically marginalized region demands expanded autonomy and threatens to declare independence.',
  'event.soc_009.choice_a': 'Negotiate with regional leaders privately',
  'event.soc_009.choice_b': 'Offer special autonomy statute',

  'event.soc_010.title': 'National Census',
  'event.soc_010.body': 'Census results show significant demographic shifts that challenge current policies.',
  'event.soc_010.choice_a': 'Adapt social policies to new demographics',
  'event.soc_010.choice_b': 'Maintain current policies unchanged',

  'event.soc_011.title': 'Gender Equality Law',
  'event.soc_011.body': 'A proposed gender equality law sparks national debate. Conservative and progressive sectors clash.',
  'event.soc_011.choice_a': 'Pass complete law with mandatory parity',
  'event.soc_011.choice_b': 'Reduced version without mandatory quotas',

  'event.soc_012.title': 'Agrarian Reform',
  'event.soc_012.body': 'Landless farmers protest massively. Agrarian reform could resolve historical conflicts.',
  'event.soc_012.choice_a': 'Implement redistribution of idle land',
  'event.soc_012.choice_b': 'Create land bank with compensation',

  'event.soc_013.title': 'Mental Health Pandemic',
  'event.soc_013.body': 'Anxiety, depression, and suicide statistics reach alarming levels post-economic crisis.',
  'event.soc_013.choice_a': 'National mental health plan with investment',
  'event.soc_013.choice_b': 'Low-cost awareness campaigns',

  'event.soc_014.title': 'Student Movement',
  'event.soc_014.body': 'University students take to the streets demanding free education and system reforms.',
  'event.soc_014.choice_a': 'Open direct negotiation with student leaders',
  'event.soc_014.choice_b': 'Announce scholarship fund and gradual reforms',

  'event.soc_015.title': 'Youth Unemployment',
  'event.soc_015.body': '35% of people aged 18-25 are unemployed. The lost generation demands solutions.',
  'event.soc_015.choice_a': 'Massive subsidized youth employment program',
  'event.soc_015.choice_b': 'Labor reform to ease hiring',

  // ─── International cards ───────────────────────────────────────────────────
  'event.int_001.title': 'Free Trade Agreement',
  'event.int_001.body': 'A regional power proposes a free trade agreement. Economic opportunities with political costs.',
  'event.int_001.choice_a': 'Sign the trade agreement',
  'event.int_001.choice_b': 'Reject and protect domestic industry',

  'event.int_002.title': 'International Financial Assistance',
  'event.int_002.body': 'A development fund offers assistance conditioned on structural reforms.',
  'event.int_002.choice_a': 'Accept assistance with conditions',
  'event.int_002.choice_b': 'Reject interference and forge own path',

  'event.int_003.title': 'Border Tension',
  'event.int_003.body': 'A border incident escalates tensions with the neighboring country. Chancelleries are working.',
  'event.int_003.choice_a': 'Take a firm stance and mobilize forces',
  'event.int_003.choice_b': 'Seek immediate international mediation',

  'event.int_004.title': 'Monetary Stabilization Agreement',
  'event.int_004.body': 'Neighboring central banks propose a regional currency stabilization mechanism.',
  'event.int_004.choice_a': 'Join the regional mechanism',
  'event.int_004.choice_b': 'Maintain full monetary independence',

  'event.int_005.title': 'International Climate Summit',
  'event.int_005.body': 'The world presses for more ambitious climate commitments. A regional leadership opportunity.',
  'event.int_005.choice_a': 'Announce ambitious climate commitments',
  'event.int_005.choice_b': 'Prioritize economic development over climate goals',

  'event.int_006.title': 'Economic Sanctions',
  'event.int_006.body': 'A bloc of nations imposes sanctions over diplomatic disputes. The economy feels the blow.',
  'event.int_006.choice_a': 'Seek alternative alliances and new markets',
  'event.int_006.choice_b': 'Negotiate lifting of sanctions with concessions',

  'event.int_007.title': 'Record Exports',
  'event.int_007.body': 'National exports reach historic highs thanks to global demand.',
  'event.int_007.choice_a': 'Reinvest revenue in infrastructure',
  'event.int_007.choice_b': 'Distribute direct bonuses to the population',

  'event.int_008.title': 'State Visit',
  'event.int_008.body': 'A world leader visits the country. The agenda includes investments, cooperation, and a photo op.',
  'event.int_008.choice_a': 'Prioritize concrete economic agreements',
  'event.int_008.choice_b': 'Emphasize security cooperation',

  'event.int_009.title': 'Currency Speculative Attack',
  'event.int_009.body': 'International funds short the national currency. The central bank must act.',
  'event.int_009.choice_a': 'Let the exchange rate fall to save reserves',
  'event.int_009.choice_b': 'Defend the currency using international reserves',

  'event.int_010.title': 'International Governance Award',
  'event.int_010.body': 'An international institution recognizes advances in government transparency.',
  'event.int_010.choice_a': 'Capitalize politically on the recognition',
  'event.int_010.choice_b': 'Use the momentum to deepen reforms',

  'event.int_011.title': 'Chinese Mega-Loan',
  'event.int_011.body': 'China offers a mega-loan for infrastructure with favorable terms but strategic commitments.',
  'event.int_011.choice_a': 'Accept the loan for major works',
  'event.int_011.choice_b': 'Decline and seek multilateral financing',

  'event.int_012.title': 'Regional Integration',
  'event.int_012.body': 'A deep regional integration process includes common currency and regional bank.',
  'event.int_012.choice_a': 'Lead and deepen regional integration',
  'event.int_012.choice_b': 'Maintain independence and cooperate selectively',

  'event.int_013.title': 'Security Cooperation',
  'event.int_013.body': 'An allied country proposes security cooperation and counter-narcotics efforts with territorial presence.',
  'event.int_013.choice_a': 'Accept cooperation with sovereignty guaranteed',
  'event.int_013.choice_b': 'Reject all foreign presence on the territory',

  'event.int_014.title': 'Naval Blockade',
  'event.int_014.body': 'A maritime dispute results in a partial blockade affecting foreign trade.',
  'event.int_014.choice_a': 'Escalate diplomatically and seek allies',
  'event.int_014.choice_b': 'Concede blockade terms to resolve it',

  'event.int_015.title': 'Regional Marshall Plan',
  'event.int_015.body': 'A consortium of developed nations offers a massive aid plan for the region.',
  'event.int_015.choice_a': 'Accept and use funds for structural reform',
  'event.int_015.choice_b': 'Use the plan for direct social redistribution',

  // ─── Crisis cards ──────────────────────────────────────────────────────────
  'event.cri_debt_001.title': 'CRISIS: International Credit Cutoff',
  'event.cri_debt_001.body': 'Markets cut credit to the country. Sovereign bonds collapse. You must act urgently.',
  'event.cri_debt_001.choice_a': 'War austerity: immediate severe cuts',
  'event.cri_debt_001.choice_b': 'Fiscal expansion to reactivate the economy',

  'event.cri_debt_002.title': 'CRISIS: IMF Rescue Mission',
  'event.cri_debt_002.body': 'The IMF arrives with a rescue mission. Conditions are harsh. The alternative is worse.',
  'event.cri_debt_002.choice_a': 'Accept the full rescue package',
  'event.cri_debt_002.choice_b': 'Negotiate more favorable conditions',

  'event.cri_debt_003.title': 'CRISIS: Sovereign Restructuring',
  'event.cri_debt_003.body': 'Creditors propose restructuring the debt. A 30% haircut is on the table.',
  'event.cri_debt_003.choice_a': 'Accept restructuring and start fresh',
  'event.cri_debt_003.choice_b': 'Reject and seek bilateral agreement with allies',

  'event.cri_hyper_001.title': 'CRISIS: Hyperinflationary Spiral',
  'event.cri_hyper_001.body': 'Prices double every week. Shelves are empty. The monetary system collapses.',
  'event.cri_hyper_001.choice_a': 'Monetary shock: peg to a strong currency',
  'event.cri_hyper_001.choice_b': 'Price controls and mass rationing',

  'event.cri_hyper_002.title': 'CRISIS: Emergency Dollarization',
  'event.cri_hyper_002.body': 'Citizens abandon the national currency. Spontaneous dollarization advances uncontrolled.',
  'event.cri_hyper_002.choice_a': 'Formalize dollarization as state policy',
  'event.cri_hyper_002.choice_b': 'Intervene to rescue the national currency',

  'event.cri_hyper_003.title': 'CRISIS: Total Monetary Reform',
  'event.cri_hyper_003.body': 'Only a radical change to the monetary system can stop the spiral. Time is running out.',
  'event.cri_hyper_003.choice_a': 'New currency with fixed exchange rate and reserves',
  'event.cri_hyper_003.choice_b': 'Emergency loan with sovereign guarantees',

  'event.cri_social_001.title': 'CRISIS: State of Siege',
  'event.cri_social_001.body': 'Street violence is uncontrollable. The cabinet pushes to declare a state of siege.',
  'event.cri_social_001.choice_a': 'Declare state of siege and curfew',
  'event.cri_social_001.choice_b': 'Negotiate urgently with social leaders',

  'event.cri_social_002.title': 'CRISIS: National Guard Intervention',
  'event.cri_social_002.body': 'Riots force deployment of the National Guard. The line between order and repression is thin.',
  'event.cri_social_002.choice_a': 'Deploy with maximum restraint instructions',
  'event.cri_social_002.choice_b': 'Open dialogue channel while maintaining presence',

  'event.cri_social_003.title': 'CRISIS: Emergency Social Pact',
  'event.cri_social_003.body': 'Leaders from all sectors propose an emergency pact to restore social peace.',
  'event.cri_social_003.choice_a': 'Sign the pact with significant concessions',
  'event.cri_social_003.choice_b': 'Propose government alternative to the pact',

  'event.cri_legis_001.title': 'CRISIS: Motion of No Confidence',
  'event.cri_legis_001.body': 'The opposition files a motion of no confidence against the government. The numbers are tight.',
  'event.cri_legis_001.choice_a': 'Negotiate with independents to survive',
  'event.cri_legis_001.choice_b': 'Run popular campaign to pressure Congress',

  'event.cri_legis_002.title': 'CRISIS: Dissolve Congress',
  'event.cri_legis_002.body': 'Legislative paralysis is total. The nuclear option of dissolving Congress is on the table.',
  'event.cri_legis_002.choice_a': 'Dissolve Congress and call elections',
  'event.cri_legis_002.choice_b': 'Negotiate grand national unity coalition',

  'event.cri_legis_003.title': 'CRISIS: Minister Removal',
  'event.cri_legis_003.body': 'Congress interpellates key ministers. The threat of removal is real.',
  'event.cri_legis_003.choice_a': 'Sacrifice ministers to save the government',
  'event.cri_legis_003.choice_b': 'Defend cabinet with intense political campaign',

  'event.cri_impeach_001.title': 'CRISIS: Political Trial',
  'event.cri_impeach_001.body': 'Congress votes to begin impeachment proceedings. Your stay in office is at stake.',
  'event.cri_impeach_001.choice_a': 'Appeal directly to the people with a historic speech',
  'event.cri_impeach_001.choice_b': 'Resort to legal maneuvers to delay the process',

  'event.cri_impeach_002.title': 'CRISIS: Congressional Testimony',
  'event.cri_impeach_002.body': 'You must testify before Congress. Transparency could save or sink you.',
  'event.cri_impeach_002.choice_a': 'Full and transparent testimony',
  'event.cri_impeach_002.choice_b': 'Invoke executive privilege and refuse to testify',

  'event.cri_impeach_003.title': 'CRISIS: Moment of Truth',
  'event.cri_impeach_003.body': 'The final impeachment vote is imminent. All your political capital is on the line.',
  'event.cri_impeach_003.choice_a': 'Mobilize your base in a historic act',
  'event.cri_impeach_003.choice_b': 'Accept a dignified negotiated exit',

  // ─── Game over headlines ───────────────────────────────────────────────────
  'gameover.hyperinflation.headline': 'REPUBLIC COLLAPSES: Hyperinflation Devours the Country',
  'gameover.popularityCollapse.headline': 'THE PEOPLE ABANDON THE PRESIDENT: End of an Unpopular Government',
  'gameover.socialCollapse.headline': 'TOTAL SOCIAL ORDER COLLAPSE: Republic in State of Anarchy',
  'gameover.bankrupt.headline': 'SOVEREIGN BANKRUPTCY: Country Without Reserves or Credit',
  'gameover.impeachment.headline': 'HISTORIC REMOVAL: Congress Ousts the President',
  'gameover.term_complete.headline': 'TERM COMPLETED! President Hands Over Power With Head Held High',

  // ─── Mandatory legislative sessions (every 4 turns) ──────────────────────
  'event.session_law_001.title': 'LEGISLATIVE SESSION: BUDGET LAW',
  'event.session_law_001.body': 'Congress debates the National Budget. Without a parliamentary agreement, public spending spirals. The opposition demands funds for their provinces. Negotiation time.',
  'event.session_law_001.choice_a': 'Budget passed — deficit reduced through fiscal discipline',
  'event.session_law_001.choice_b': 'Budget rejected — government loses fiscal credibility',
  'event.session_law_001.choice_c': 'Executive Decree: President passes the budget unilaterally',

  'event.session_law_002.title': 'LEGISLATIVE SESSION: BASES LAW',
  'event.session_law_002.body': 'The ambitious structural reform promises deregulation and investment. Unions oppose it. Markets are waiting. The independent vote is decisive.',
  'event.session_law_002.choice_a': 'Bases Law passed — markets celebrate, stability suffers',
  'event.session_law_002.choice_b': 'Bases Law rejected — markets collapse',
  'event.session_law_002.choice_c': 'Emergency Decree: Bases Law passed by executive order',

  'event.session_law_003.title': 'LEGISLATIVE SESSION: PENSION REFORM',
  'event.session_law_003.body': 'Congress debates pension adjustments. Seniors fill the Plaza de Mayo. The IMF watches. Pension spending already represents 12% of GDP.',
  'event.session_law_003.choice_a': 'Reform passed — retirees recover purchasing power',
  'event.session_law_003.choice_b': 'Reform rejected — retirees march against the government',
  'event.session_law_003.choice_c': 'Emergency Decree: pension adjustment by presidential order',

  'event.session_law_004.title': 'LEGISLATIVE SESSION: UNIVERSITY FUNDING',
  'event.session_law_004.body': 'Public universities demand funding for salaries and operations. Students camp outside Congress. At stake: social stability and the country\'s human capital.',
  'event.session_law_004.choice_a': 'Law passed — universities receive their budget',
  'event.session_law_004.choice_b': 'Law rejected — widespread student mobilization',
  'event.session_law_004.choice_c': 'Emergency Decree: university funding by executive order',

  'event.session_law_005.title': 'LEGISLATIVE SESSION: DNU RATIFICATION',
  'event.session_law_005.body': 'Congress debates whether to ratify the executive decrees. Ratification consolidates presidential power; rejection reduces governability.',
  'event.session_law_005.choice_a': 'Ratification approved in a tight session — decrees stand',
  'event.session_law_005.choice_b': 'Congress rejects the decrees — constitutional crisis',
  'event.session_law_005.choice_c': 'Executive issues new decrees before Congress votes',

  // ─── 10 new event cards ──────────────────────────────────────────────────
  'event.new_001.title': 'HISTORIC DROUGHT IN THE PAMPAS',
  'event.new_001.body': 'The worst drought in 60 years devastates the soybean and corn harvest. Agro exports fall 35%. The Central Bank watches reserves evaporate. The farming sector demands urgent action.',
  'event.new_001.choice_a': 'Emergency farming plan with soft credit lines',
  'event.new_001.choice_b': 'Temporarily reduce export taxes to incentivize liquidation',
  'event.new_001.choice_c': 'Declare national emergency and request IMF credit',
  'event.new_001.choice_d': 'Do not intervene — the market will self-correct',

  'event.new_002.title': 'MASSIVE BLACKOUT: THE LIGHTS GO OUT',
  'event.new_002.body': 'A failure in the power transmission system leaves 12 provinces without electricity for 18 hours. Hospitals run on generators. Public mood plummets. Energy companies blame the State.',
  'event.new_002.choice_a': 'Temporarily intervene in the energy companies',
  'event.new_002.choice_b': 'Declare energy state of emergency',
  'event.new_002.choice_c': 'Urgently tender private power generation contracts',
  'event.new_002.choice_d': 'Investigate whether the outage was politically motivated sabotage',

  'event.new_003.title': 'CYBERATTACK ON THE CENTRAL BANK',
  'event.new_003.body': 'Hackers breach the BCRA servers. The payment system collapses for 6 hours. Foreign reserve data is leaked. Markets lose confidence. Intelligence points to foreign actors.',
  'event.new_003.choice_a': 'Quiet technical response with no public statements',
  'event.new_003.choice_b': 'Declare the attack an act of economic warfare and denounce it internationally',
  'event.new_003.choice_c': 'Contract an Israeli cybersecurity firm',
  'event.new_003.choice_d': 'Create a National Financial Cybersecurity Agency',

  'event.new_004.title': 'INTERNAL ESPIONAGE SCANDAL',
  'event.new_004.body': 'The AFI was spying on judges, journalists and opposition leaders. A former agent leaked the data to the press. The scandal rocks the government. The opposition demands intervention.',
  'event.new_004.choice_a': 'Fire the director and open an audit',
  'event.new_004.choice_b': 'Defend the operation as legitimate intelligence activity',
  'event.new_004.choice_c': 'Dissolve the AFI and create a new agency',
  'event.new_004.choice_d': 'Stay silent and wait for the media cycle to move on',

  'event.new_005.title': 'LITHIUM: THE WHITE GOLD AWAKENS',
  'event.new_005.body': 'A multinational offers a record U$D 8 billion investment in lithium in the NOA. Jujuy and Salta push to proceed. Environmentalists and indigenous communities block access.',
  'event.new_005.choice_a': 'Approve the investment with minimal environmental protocol',
  'event.new_005.choice_b': 'Negotiate with communities before proceeding',
  'event.new_005.choice_c': 'Nationalize the deposit and operate it with CONICET',
  'event.new_005.choice_d': 'Postpone the decision until the next election',

  'event.new_006.title': 'G20 SUMMIT IN BUENOS AIRES',
  'event.new_006.body': 'Argentina will chair the G20. A unique opportunity to project an image to the world and attract investment. But social movements threaten massive protests during the summit.',
  'event.new_006.choice_a': 'Successful summit: showcase stability and reforms',
  'event.new_006.choice_b': 'Prioritize security with heavy police presence',
  'event.new_006.choice_c': 'Dialogue with social movements to avoid clashes',
  'event.new_006.choice_d': 'Use the summit to close urgent bilateral deals',

  'event.new_007.title': 'TRUCKERS\' STRIKE',
  'event.new_007.body': 'Freight transport unions declare an indefinite strike over wage increases. Supermarket shelves empty. Exports stall at ports. The interior of the country is cut off.',
  'event.new_007.choice_a': 'Negotiate a 30% raise and extraordinary bonus',
  'event.new_007.choice_b': 'Declare the service essential and order workers back',
  'event.new_007.choice_c': 'Activate military forces to guarantee transport',
  'event.new_007.choice_d': 'Mediate with business sector to absorb the costs',

  'event.new_008.title': 'HOUSING CRISIS IN CABA',
  'event.new_008.body': 'Rent prices in Buenos Aires rose 280% in a year. Middle-class families camp outside the Ministry. Land seizures on the periphery grew 60%. The housing deficit exceeds one million units.',
  'event.new_008.choice_a': 'Relaunch ProCreAr plan with subsidized credit lines',
  'event.new_008.choice_b': 'Regulate rental prices by executive order',
  'event.new_008.choice_c': 'Build 50,000 emergency housing units in 18 months',
  'event.new_008.choice_d': 'Push rental law reform through Congress',

  'event.new_009.title': 'ARTIFICIAL INTELLIGENCE AND EMPLOYMENT',
  'event.new_009.body': 'A MTSS report estimates AI will eliminate 1.2 million jobs in Argentina in 5 years. Unions demand regulation. Tech companies threaten to leave if barriers are imposed.',
  'event.new_009.choice_a': 'Create a job retraining fund financed by an AI tax',
  'event.new_009.choice_b': 'Regulate AI deployment with sectoral licenses',
  'event.new_009.choice_c': 'Bet on AI: position Argentina as a regional tech hub',
  'event.new_009.choice_d': 'Declare a 2-year moratorium on AI use in critical jobs',

  'event.new_010.title': 'FLOODING IN THE LITTORAL',
  'event.new_010.body': 'The Paraná River overflow affects 18 municipalities in Entre Ríos and Santa Fe. 80,000 evacuees. Productive fields submerged. The governor demands emergency declaration and urgent national funds.',
  'event.new_010.choice_a': 'Declare national emergency and release Soybean Fund resources',
  'event.new_010.choice_b': 'Coordinate with provinces on a containment works plan',
  'event.new_010.choice_c': 'Request international humanitarian assistance',
  'event.new_010.choice_d': 'Delayed response — prioritize fiscal adjustment',

  // ─── Historical Scenarios ─────────────────────────────────────────────────
  'scenario.hiperinflacion_1989.label': 'The Hyperinflation',
  'scenario.hiperinflacion_1989.period': '1989',
  'scenario.hiperinflacion_1989.description': '3,000% annual inflation. Supermarkets were looted. Alfonsín resigned before his term ended.',

  'scenario.corralito_2001.label': 'The Corralito',
  'scenario.corralito_2001.period': '2001',
  'scenario.corralito_2001.description': 'Banks shut their doors. Argentines could not access their savings. The country defaulted on its debt — the largest in history at the time.',

  'scenario.convertibilidad.label': 'The Convertibility',
  'scenario.convertibilidad.period': '1991–2001',
  'scenario.convertibilidad.description': 'One peso, one dollar. The cure that stopped inflation but drained reserves and ended in collapse.',

  'scenario.rodrigazo_1975.label': 'The Rodrigazo',
  'scenario.rodrigazo_1975.period': '1975',
  'scenario.rodrigazo_1975.description': 'Minister Rodrigo raised utility tariffs 100% overnight. Unions and the public forced his resignation within 48 hours.',

  'scenario.malvinas_1982.label': 'The Falklands',
  'scenario.malvinas_1982.period': '1982',
  'scenario.malvinas_1982.description': 'The military junta gambled on war to survive politically. The patriotic fervour lasted weeks. The defeat, forever.',

  'scenario.kirchnerismo_boom.label': 'The Tailwind Years',
  'scenario.kirchnerismo_boom.period': '2003–2007',
  'scenario.kirchnerismo_boom.description': 'Soaring commodities, restructured debt and 8% growth. The trap came when the tailwind stopped.',

  // Shock names (historical)
  'shock.hiper.saqueos': 'Widespread Supermarket Looting',
  'shock.hiper.alfonsinexit': 'Early Presidential Resignation',
  'shock.corralito.freeze': 'Banking System Freeze',
  'shock.corralito.default': 'Sovereign Default',
  'shock.convertib.overvalued': 'Overvalued Peso',
  'shock.convertib.recession': 'Recession Under Fixed Exchange Rate',
  'shock.rodrigazo.huelga': 'General Strike',
  'shock.rodrigazo.tarifazo': '100% Tariff Hike',
  'shock.malvinas.guerra': 'South Atlantic War',
  'shock.malvinas.derrota': 'Military Defeat',
  'shock.kirchner.vientocola': 'International Commodity Tailwind',
  'shock.kirchner.inflsubestimada': 'Real Inflation vs. INDEC Data',
  'shock.lla.herencia': 'Inherited Economic Disaster',
  'shock.lla.devaluacion': 'Peso Devaluation',

  // ── Months ────────────────────────────────────────────────────────────────
  'month.1': 'January',
  'month.2': 'February',
  'month.3': 'March',
  'month.4': 'April',
  'month.5': 'May',
  'month.6': 'June',
  'month.7': 'July',
  'month.8': 'August',
  'month.9': 'September',
  'month.10': 'October',
  'month.11': 'November',
  'month.12': 'December',

  // ── Scenario: Libertad Avanza 2023 ────────────────────────────────────────
  'scenario.libertad_avanza_2023.label': 'The Chainsaw',
  'scenario.libertad_avanza_2023.period': '2023–2027',
  'scenario.libertad_avanza_2023.description': 'You inherited 142% inflation, negative reserves and an opposition with two-thirds of Congress. Adjustment is unavoidable. Can you survive politically?',

  // ── Conspiraciones & Operetas ─────────────────────────────────────────────
  'event.con_001.title': 'THE BOSS PULLS STRINGS',
  'event.con_001.body': 'Intermediaries linked to CFK are operating in Congress. Loyal legislators vote in bloc against every government initiative. The anti-K plaza fills, but the legislative numbers don\'t add up.',
  'event.con_001.choice_a': 'Denounce the operation in a national address',
  'event.con_001.choice_b': 'Negotiate quietly with Peronist blocs',
  'event.con_001.choice_c': 'Appeal to the Judiciary to block the manoeuvre',

  'event.con_002.title': 'JUDICIAL SMEAR CAMPAIGN',
  'event.con_002.body': 'Kirchner-aligned judges block key Executive decrees. The government cries "reverse lawfare". The judiciary claims it acts within the law.',
  'event.con_002.choice_a': 'Attack the judges on social media',
  'event.con_002.choice_b': 'Comply with the ruling and find another legal path',

  'event.con_003.title': 'CFK DECLARES HERSELF OUTLAWED',
  'event.con_003.body': 'With a firm conviction, CFK appears on the Patria Institute balcony. Thousands of supporters block the 9 de Julio Avenue. Media split: fair trial or political persecution?',
  'event.con_003.choice_a': 'Defend judicial independence and say nothing more',
  'event.con_003.choice_b': 'Amplify the news to delegitimise Kirchnerism',
  'event.con_003.choice_c': 'Offer institutional dialogue to ease tensions',

  'event.con_004.title': 'PERONISM REORGANISES',
  'event.con_004.body': 'A PJ congress elects new authorities and vows to govern from opposition in Congress. Control of quorum is their weapon.',
  'event.con_004.choice_a': 'Challenge opposition quorum with emergency decrees',
  'event.con_004.choice_b': 'Open a dialogue table before it escalates',
  'event.con_004.choice_c': 'Lure moderate PJ legislators with public works',

  'event.con_005.title': 'SPEECH AT THE PATRIA INSTITUTE',
  'event.con_005.body': 'CFK accuses the government of "austerity for the poor and a party for the IMF". The blue dollar jumps 4 points in hours. Nervous markets watch the legislative floor.',
  'event.con_005.choice_a': 'Ignore the speech publicly',
  'event.con_005.choice_b': 'Rebut with macroeconomic data',
  'event.con_005.choice_c': 'Hold a press conference with the Economy Minister',

  'event.con_006.title': 'CRYPTO SCANDAL: $LIBRA CRASHES',
  'event.con_006.body': 'A token launched with presidential backing collapsed 95% in 24 hours. Thousands of Argentine savers lost their savings. Justice investigates possible market manipulation.',
  'event.con_006.choice_a': 'Defend yourself: "I never promoted investing in it"',
  'event.con_006.choice_b': 'Announce a Congressional investigative commission',
  'event.con_006.choice_c': 'Blame external operators and disinformation networks',

  'event.con_007.title': 'THE SPOKESMAN FLIES ON ARG-01',
  'event.con_007.body': 'Leaked tickets: the presidential spokesman used the official aircraft for a private trip. "Airlines closed for the people, plane open for friends," trending on X.',
  'event.con_007.choice_a': 'Ask for the spokesman\'s immediate resignation',
  'event.con_007.choice_b': 'Defend the decision: "the presidential plane is for the State"',
  'event.con_007.choice_c': 'Issue a technical statement and wait for it to blow over',

  'event.con_008.title': 'THE GOVERNOR DECLARES FISCAL WAR',
  'event.con_008.body': 'Kicillof withholds federal revenue sharing funds and accuses the Executive of "strangling the most populous province". The Supreme Court could intervene, but it\'s slow.',
  'event.con_008.choice_a': 'Cut more funds: full pressure game',
  'event.con_008.choice_b': 'Reach a bilateral agreement off-camera',
  'event.con_008.choice_c': 'Take the case to the Supreme Court and wait',

  'event.con_009.title': 'OFFICIALS GET NACIÓN MORTGAGES',
  'event.con_009.body': 'A report reveals senior officials accessed subsidised mortgage loans from Banco Nación while public credit was frozen for ordinary Argentines.',
  'event.con_009.choice_a': 'Cancel the programme and demand explanations',
  'event.con_009.choice_b': 'Defend its legality and provide no further information',

  'event.con_010.title': 'BRIBERY AUDIOS FROM ANDIS',
  'event.con_010.body': 'Leaked audio of ANDIS disability agency officials negotiating overpriced contracts. Opposition demands intervention; families march in protest.',
  'event.con_010.choice_a': 'Intervene ANDIS and pursue arrests',
  'event.con_010.choice_b': 'Create a bicameral investigative commission',
  'event.con_010.choice_c': 'Remove authorities without a public process',

  'event.con_011.title': 'IRAN: TERRORIST STATE?',
  'event.con_011.body': 'The government weighs designating Iran a terrorist state on the AMIA bombing anniversary. Israel and the US push for it; China warns it would jeopardise trade deals.',
  'event.con_011.choice_a': 'Proceed with designation: "principles over trade"',
  'event.con_011.choice_b': 'Abstain to preserve trade ties',
  'event.con_011.choice_c': 'Request a technical study before deciding',

  'event.con_012.title': 'ANTI-PICKET PROTOCOL',
  'event.con_012.body': 'The government activates a protocol to disperse pickets using federal forces. Unions threaten a general strike. Businesses applaud.',
  'event.con_012.choice_a': 'Apply the protocol firmly',
  'event.con_012.choice_b': 'Suspend it and negotiate with unions',
  'event.con_012.choice_c': 'Apply it only in extreme cases with prior notice',

  'event.con_013.title': 'ATHENA REACHES ORBIT',
  'event.con_013.body': 'Argentina successfully launches its first earth-observation nanosatellite. International media pick it up, generating national pride in a difficult moment.',
  'event.con_013.choice_a': 'Capitalise on the news with a Casa Rosada ceremony',
  'event.con_013.choice_b': 'Announce additional investment in space technology',

  'event.con_014.title': 'FORMER PRESIDENT CONVICTED',
  'event.con_014.body': 'The Federal Court confirms CFK\'s conviction. Social media explodes. Supporters block motorways. Kirchnerism calls for active resistance.',
  'event.con_014.choice_a': 'Stay silent: "it is an independent judicial ruling"',
  'event.con_014.choice_b': 'Celebrate it politically before your base',
  'event.con_014.choice_c': 'Call for calm and institutional dialogue',

  'event.con_015.title': 'CRACK IN THE RULING COALITION',
  'event.con_015.body': 'A hardline faction of La Libertad Avanza wants to radicalise the austerity drive. The moderate wing threatens to vote with the opposition if the course isn\'t moderated.',
  'event.con_015.choice_a': 'Give the hardliners free rein',
  'event.con_015.choice_b': 'Moderate the rhetoric to calm the moderate wing',
  'event.con_015.choice_c': 'Call for an internal agreement with mutual concessions',

  // ── Hyperinflation 1989 cards ─────────────────────────────────────────────
  'event.hist_hiper_001.title': 'PRICES SPIRAL OUT OF CONTROL',
  'event.hist_hiper_001.body': 'Prices doubled in a single week. Shoppers are buying whatever they can before the next rise. The economy minister has resigned twice this month.',
  'event.hist_hiper_001.choice_a': 'Summon supermarket executives and impose price caps',
  'event.hist_hiper_001.choice_b': 'Let the market self-correct — price controls never work',
  'event.hist_hiper_001.choice_c': 'Launch an IMF-backed shock stabilisation plan',
  'event.hist_hiper_001.choice_d': 'Print money to ease hunger and buy time',

  'event.hist_hiper_002.title': 'ALFONSÍN CALLS MENEM',
  'event.hist_hiper_002.body': 'The president-elect takes office in five months, but the situation cannot hold. Alfonsín is weighing an early transfer of power — unprecedented in Argentine democracy.',
  'event.hist_hiper_002.choice_a': 'Hand over power early — the country cannot wait',
  'event.hist_hiper_002.choice_b': 'Serve out the full term — conceding is unconstitutional',
  'event.hist_hiper_002.choice_c': 'Negotiate a transitional unity government',

  'event.hist_hiper_003.title': 'PLAN BÓNEX: CONFISCATE OR STABILISE',
  'event.hist_hiper_003.body': 'The incoming government is considering converting fixed-term deposits into ten-year bonds overnight. It would stop inflation cold — but Argentines would lose access to their savings.',
  'event.hist_hiper_003.choice_a': 'Implement Plan Bónex — stability at any cost',
  'event.hist_hiper_003.choice_b': 'Protect deposits and weather the storm',
  'event.hist_hiper_003.choice_c': 'Convert only deposits over $1 million',

  // ── El Corralito 2001 cards ───────────────────────────────────────────────
  'event.hist_corral_001.title': 'THE DOLLARS ARE FLEEING',
  'event.hist_corral_001.body': 'Capital flight is at a record high. $2bn left the banking system last week alone. Banks no longer have reserves to honour mass withdrawals.',
  'event.hist_corral_001.choice_a': 'Declare the corralito: cap withdrawals at $250 per week',
  'event.hist_corral_001.choice_b': 'Devalue and abandon convertibility immediately',
  'event.hist_corral_001.choice_c': 'Request an IMF rescue package',
  'event.hist_corral_001.choice_d': 'Launch a national confidence campaign in the peso',

  'event.hist_corral_002.title': 'THE CACEROLAZO: CITIZENS IN THE STREETS',
  'event.hist_corral_002.body': '"¡Que se vayan todos!" Plaza de Mayo is overflowing. The president declares a state of siege. The crackdown leaves 38 dead. No one in government knows what to do next.',
  'event.hist_corral_002.choice_a': 'Resign — the country needs a democratic way out',
  'event.hist_corral_002.choice_b': 'Maintain the state of siege and convertibility',
  'event.hist_corral_002.choice_c': 'Lift the state of siege and negotiate with the opposition',

  'event.hist_corral_003.title': 'THE DEFAULT',
  'event.hist_corral_003.body': 'Argentina cannot meet its debt repayments. The IMF cut funding. Four presidents in one week. Congress has appointed you as a last resort.',
  'event.hist_corral_003.choice_a': 'Declare the default — suspend foreign debt payments',
  'event.hist_corral_003.choice_b': 'Pay at the cost of total social spending cuts',
  'event.hist_corral_003.choice_c': 'Restructure debt, suspending interest payments',

  // ── La Convertibilidad cards ──────────────────────────────────────────────
  'event.hist_conv_001.title': 'ONE PESO, ONE DOLLAR',
  'event.hist_conv_001.body': 'Minister Cavallo proposes pegging the peso to the dollar with a currency board. It would kill inflation overnight — but Argentina would permanently surrender its monetary flexibility.',
  'event.hist_conv_001.choice_a': 'Pass the Convertibility Law',
  'event.hist_conv_001.choice_b': 'Reject it — a fixed exchange rate is a trap',
  'event.hist_conv_001.choice_c': 'Negotiate a managed float band instead',

  'event.hist_conv_002.title': 'RESERVES RUNNING DRY',
  'event.hist_conv_002.body': 'The central bank has lost $8bn in reserves over three months. To maintain parity, Argentina must keep borrowing or keep selling. The clock is ticking.',
  'event.hist_conv_002.choice_a': 'Hold the peg and take on more debt',
  'event.hist_conv_002.choice_b': 'Abandon the fixed exchange rate before it is too late',
  'event.hist_conv_002.choice_c': 'Negotiate an IMF financial shield ("Blindaje")',

  'event.hist_conv_003.title': 'THE BLINDAJE OR THE DEVALUATION',
  'event.hist_conv_003.body': 'The IMF\'s Blindaje package arrives late and with harsh conditions. Recession has dragged on for three years. Unemployment tops 17%. Nobody believes one-to-one can survive.',
  'event.hist_conv_003.choice_a': 'Devalue — the peso becomes 1.40 to the dollar',
  'event.hist_conv_003.choice_b': 'Accept the IMF Blindaje with deeper austerity',
  'event.hist_conv_003.choice_c': 'Full dollarisation — abolish the peso entirely',

  // ── El Rodrigazo 1975 cards ───────────────────────────────────────────────
  'event.hist_rod_001.title': 'RODRIGO\'S TARIFF SHOCK',
  'event.hist_rod_001.body': 'Minister Celestino Rodrigo announces: fuel up 172%, electricity up 75%, transport up 75%. Effective immediately. The unions have declared war.',
  'event.hist_rod_001.choice_a': 'Defend the hikes — they are the only anti-inflation medicine',
  'event.hist_rod_001.choice_b': 'Reverse them — the political cost is unsustainable',
  'event.hist_rod_001.choice_c': 'Segment: raise only freight and premium fuel',

  'event.hist_rod_002.title': 'THE CGT CALLS A GENERAL STRIKE',
  'event.hist_rod_002.body': 'The CGT calls a 48-hour stoppage. Factories halt, buses sit idle, banks close. Isabel Perón must choose between her minister and the unions.',
  'event.hist_rod_002.choice_a': 'Fire Rodrigo and yield to the unions',
  'event.hist_rod_002.choice_b': 'Back the minister — unions do not govern',
  'event.hist_rod_002.choice_c': 'Negotiate: cut tariffs 30% and ask for a truce',

  'event.hist_rod_003.title': 'ISABEL PERÓN AT THE CROSSROADS',
  'event.hist_rod_003.body': 'Without Rodrigo, without an economic plan, and with guerrilla activity intensifying, Isabel\'s government is unravelling. The armed forces are watching closely.',
  'event.hist_rod_003.choice_a': 'Resist to the end as a constitutionalist',
  'event.hist_rod_003.choice_b': 'Take leave — let the vice-president assume command',
  'event.hist_rod_003.choice_c': 'Attempt a national coalition government without the army',

  // ── Malvinas 1982 cards ───────────────────────────────────────────────────
  'event.hist_mal_001.title': 'LANDING ON THE FALKLANDS',
  'event.hist_mal_001.body': 'The junta orders the forceful recovery of the islands. Plaza de Mayo erupts in patriotic fervour. The world watches in disbelief. Thatcher mobilises the Task Force.',
  'event.hist_mal_001.choice_a': 'Press on — the islands are Argentine, whatever the cost',
  'event.hist_mal_001.choice_b': 'Halt the operation before Britain declares war',
  'event.hist_mal_001.choice_c': 'Pursue a UN diplomatic solution before any fighting',

  'event.hist_mal_002.title': 'THE BRITISH FLEET APPROACHES',
  'event.hist_mal_002.body': 'Warships have left Portsmouth. Reagan offers mediation; Haig is on a peace tour. Time is running out: reinforce the islands or seek an exit.',
  'event.hist_mal_002.choice_a': 'Reinforce with more troops and weapons',
  'event.hist_mal_002.choice_b': 'Resist and rally Latin American solidarity',
  'event.hist_mal_002.choice_c': 'Accept mediation — withdraw the bulk of the forces',

  'event.hist_mal_003.title': 'DEFEAT AT PORT STANLEY',
  'event.hist_mal_003.body': 'General Menéndez surrenders the Argentine garrison. The war lasted 74 days. 649 Argentine soldiers are dead. Patriotic fervour has turned to fury at the junta.',
  'event.hist_mal_003.choice_a': 'Call immediate democratic elections',
  'event.hist_mal_003.choice_b': 'Attempt political survival through an internal coup',
  'event.hist_mal_003.choice_c': 'Negotiate an orderly transition with political parties',

  // ── Kirchnerismo Boom 2003–2007 cards ─────────────────────────────────────
  'event.hist_kirch_001.title': 'SOYA AT $300: THE TAILWIND ARRIVES',
  'event.hist_kirch_001.body': 'China\'s demand for soya is driving prices to record highs. Agri-export revenues are exploding. The fiscal surplus lets the government rebuild the social fabric destroyed in 2001.',
  'event.hist_kirch_001.choice_a': 'Invest in public works and poverty reduction',
  'event.hist_kirch_001.choice_b': 'Use the surplus to rebuild central bank reserves',
  'event.hist_kirch_001.choice_c': 'Cut taxes to strengthen competitiveness',

  'event.hist_kirch_002.title': 'IMF PAYMENT: INDEPENDENCE OR TRAP',
  'event.hist_kirch_002.body': 'Kirchner announces the full repayment of IMF debt in a single payment: $9.81bn. Argentina breaks free of Fund conditionality — but empties its reserves.',
  'event.hist_kirch_002.choice_a': 'Pay it all at once — full economic sovereignty',
  'event.hist_kirch_002.choice_b': 'Refinance in instalments to preserve reserves',
  'event.hist_kirch_002.choice_c': 'Pay and negotiate a new standby arrangement',

  'event.hist_kirch_003.title': 'INDEC: THE REAL INFLATION',
  'event.hist_kirch_003.body': '8% growth alongside 20% real inflation. The government intervenes in the statistics agency to suppress the numbers. Private economists publish their own alternative figures.',
  'event.hist_kirch_003.choice_a': 'Let INDEC under-report — the lie serves short-term interests',
  'event.hist_kirch_003.choice_b': 'Acknowledge real inflation and launch a stabilisation plan',
  'event.hist_kirch_003.choice_c': 'Create a "consensus" alternative index with the provinces',
  // ── Game over: Deflation Spiral ───────────────────────────────────────────
  'gameover.deflation_spiral.headline': 'DEFLATIONARY SPIRAL: The Economy Freezes',
  'gameover.deflation_spiral.body': 'Sustained price drops destroyed the productive fabric. Companies closed, unemployment soared and consumption collapsed. Nobody invests when they expect everything to be cheaper tomorrow. The model failed.',

  // ── Scenario: Ukraine War 2022 ────────────────────────────────────────────
  'scenario.guerra_ucrania_2022.label': 'Ukraine War',
  'scenario.guerra_ucrania_2022.period': '2022',
  'scenario.guerra_ucrania_2022.description': 'Russia invades Ukraine and the world splits. Energy prices explode, supply chains break and Argentina must choose sides in a new world order.',

  // ── Scenario: Iran Conflict 2024 ──────────────────────────────────────────
  'scenario.conflicto_iran_2024.label': 'Iran Conflict 2024',
  'scenario.conflicto_iran_2024.period': '2024',
  'scenario.conflicto_iran_2024.description': 'Iran, Israel and the US on the brink. Oil prices surge and the global energy crisis hits Argentina just as it was trying to stabilize.',

  // ── Geopolitical event cards ──────────────────────────────────────────────
  'event.geo_001.title': 'GLOBAL ENERGY CRISIS',
  'event.geo_001.body': 'The international conflict doubled oil prices. Electricity and gas bills are pushing the public budget and household finances to the limit.',
  'event.geo_001.choice_a': 'Subsidize tariffs to protect consumers',
  'event.geo_001.choice_b': 'Pass the price to users: transparency and adjustment',
  'event.geo_001.choice_c': 'Negotiate joint purchases with neighboring countries',
  'event.geo_001.choice_d': 'Accelerate Vaca Muerta production as a local alternative',

  'event.geo_002.title': 'UKRAINIAN REFUGEES ARRIVE',
  'event.geo_002.body': 'Argentina opened a humanitarian corridor. Thousands of Ukrainians seek asylum. Public solidarity is high, but resources to integrate them are scarce.',
  'event.geo_002.choice_a': 'Open the doors wide: Argentina was built by immigrants',
  'event.geo_002.choice_b': 'Limit intake and prioritize state capacity',

  'event.geo_003.title': 'RUSSIA OFFERS CHEAP WHEAT',
  'event.geo_003.body': 'Moscow offers discounted wheat in exchange for not voting UN sanctions. The West watches. Argentine grain producers eye Russian competition warily.',
  'event.geo_003.choice_a': 'Accept the wheat: domestic supply is the priority',
  'event.geo_003.choice_b': 'Refuse: sovereignty is not for sale for cheap grain',
  'event.geo_003.choice_c': 'Abstain at the UN and maintain diplomatic silence',

  'event.geo_004.title': 'UKRAINE REQUESTS SURPLUS MILITARY GEAR',
  'event.geo_004.body': 'Kyiv requests obsolete equipment from Argentine armed forces. The US is pushing. Russia warns any shipment will have commercial consequences.',
  'event.geo_004.choice_a': 'Send non-lethal materials — humanitarian position',
  'event.geo_004.choice_b': 'Refuse any shipment: Argentina is not part of the conflict',
  'event.geo_004.choice_c': 'Refer the decision to Congress to avoid the political cost',

  'event.geo_005.title': 'ATTACK ON OIL FACILITY',
  'event.geo_005.body': 'A missile hits an allied regional refinery. Barrel price jumps 18% in 48 hours. YPF warns import costs will exceed the budgeted forecast.',
  'event.geo_005.choice_a': 'Accelerate Vaca Muerta production with emergency investment',
  'event.geo_005.choice_b': 'Negotiate a long-term LNG contract with Qatar',
  'event.geo_005.choice_c': 'Raise tariffs immediately to balance the energy budget',

  'event.geo_006.title': 'IRAN BLOCKS STRAIT OF HORMUZ',
  'event.geo_006.body': 'The strait is closed. Maritime trade is diverted and cargo insurance multiplies. Argentine exports to Asia face unprecedented cost overruns.',
  'event.geo_006.choice_a': 'Find alternative routes with European shippers',
  'event.geo_006.choice_b': 'Push diplomatically for reopening the strait',
  'event.geo_006.choice_c': 'Accept the losses and prioritize American markets',

  'event.geo_007.title': 'US DEMANDS GEOPOLITICAL ALIGNMENT',
  'event.geo_007.body': 'Washington demands Argentina publicly side with the Western bloc. In exchange: preferential market access and IMF support. Refusal would bring indirect sanctions.',
  'event.geo_007.choice_a': 'Align openly with the Western bloc',
  'event.geo_007.choice_b': 'Declare neutrality: "Argentina has no military alliances"',
  'event.geo_007.choice_c': 'Negotiate bilaterally without a public statement',

  'event.geo_008.title': 'IMF FREEZES DISBURSEMENT',
  'event.geo_008.body': 'The Fund warns that the geopolitical context raises country risk and freezes the next disbursement until the government demonstrates additional fiscal discipline.',
  'event.geo_008.choice_a': 'Accept new conditions and cut further to unlock funds',
  'event.geo_008.choice_b': 'Reject the conditions and seek alternative financing',
  'event.geo_008.choice_c': 'Open technical renegotiation without public commitment',

  // ─── NUCLEAR WAR ARC ────────────────────────────────────────────────
  'event.guerra_001.title': 'THE PRESIDENT JOINS THE WAR',
  'event.guerra_001.body': 'The international armed conflict intensifies. The government’s hard-line faction proposes that Argentina take an active side and send military support. The generals await orders. The world is watching.',
  'event.guerra_001.choice_a': 'Join the conflict: send troops and logistical support',
  'event.guerra_001.choice_b': 'Declare active neutrality and publicly condemn the war',
  'event.guerra_001.choice_c': 'Offer mediation as a neutral country',
  'event.guerra_001.choice_d': 'Ignore the conflict: Argentina has its own problems',

  'event.guerra_002.title': 'NUCLEAR ULTIMATUM: STAND DOWN OR BE ERASED',
  'event.guerra_002.body': 'A nuclear power sends a secret ultimatum: Argentina has 48 hours to withdraw all support from the conflict, or Buenos Aires will pay the price. The President must decide now.',
  'event.guerra_002.choice_a': 'Stand down immediately: the risk is not worth it',
  'event.guerra_002.choice_b': 'Ignore the threat: Argentina does not yield to blackmail',
  'event.guerra_002.choice_c': 'Seek urgent UN mediation to de-escalate',
  'event.guerra_002.choice_d': 'Escalate: show that Argentina is not afraid',

  'event.guerra_003.title': 'NUCLEAR BOMB OVER BUENOS AIRES',
  'event.guerra_003.body': 'The threat was real. At 4:17 AM, a ballistic missile strikes the Buenos Aires metro area. Radioactive fallout covers the city. There is nothing left to decide.',
  'event.guerra_003.choice_a': 'Pray',
  'event.guerra_003.choice_b': 'Run',

  // ─── MALVINAS CONFLICT ARC ──────────────────────────────────────────
  'event.malvinas_001.title': 'MALVINAS SOVEREIGNTY CLAIM',
  'event.malvinas_001.body': 'A parliamentary bloc pushes a resolution declaring Argentine sovereignty over the Falkland Islands. Public opinion is favorable. London watches with concern.',
  'event.malvinas_001.choice_a': 'Support the formal claim and bring it before the UN',
  'event.malvinas_001.choice_b': 'Manage the claim through quiet diplomacy',
  'event.malvinas_001.choice_c': 'Ignore the resolution: this is not the political moment',
  'event.malvinas_001.choice_d': 'Bring the case to the OAS seeking regional backing',

  'event.malvinas_002.title': 'GREAT BRITAIN DEPLOYS THE FLEET',
  'event.malvinas_002.body': 'The Royal Navy sails toward the South Atlantic. Thatcher — or her successor — warns that any military action will be met with full force. The Argentine Armed Forces are on alert.',
  'event.malvinas_002.choice_a': 'Hold the position: Argentina defends its sovereignty',
  'event.malvinas_002.choice_b': 'Back down: withdraw the claim to avoid conflict',
  'event.malvinas_002.choice_c': 'Request urgent UN Security Council mediation',
  'event.malvinas_002.choice_d': 'Ask the US to discreetly mediate',

  'event.malvinas_003.title': 'ARMED CONFLICT IN THE ISLANDS',
  'event.malvinas_003.body': 'First clashes between Argentine and British forces leave casualties on both sides. War is a fact. Time is running out. The country stands behind the president.',
  'event.malvinas_003.choice_a': 'Commit the full fleet to total engagement',
  'event.malvinas_003.choice_b': 'Negotiate an immediate ceasefire — any political cost is worth it',
  'event.malvinas_003.choice_c': 'Limited operation: show of force then negotiate from position',
  'event.malvinas_003.choice_d': 'Attempt a last-minute emergency diplomatic channel',

  'event.malvinas_004.title': 'UK DESTROYS THE ARGENTINE FLEET',
  'event.malvinas_004.body': 'The ARA Belgrano and escort ships are sunk. Naval aviation loses 60% of its aircraft. The islands fall. The government collapses under the defeat. History repeats itself.',
  'event.malvinas_004.choice_a': 'Announce the surrender',
  'event.malvinas_004.choice_b': 'Resign',

  // ─── Game over strings ───────────────────────────────────────────────────
  'gameOver.nuclear_annihilation.headline': 'NUCLEAR ANNIHILATION',
  'gameOver.nuclear_annihilation.sub': "You didn't survive the bomb. Neither did the country.",
  'gameOver.military_defeat.headline': 'MILITARY DEFEAT',
  'gameOver.military_defeat.sub': 'The Falklands remain British. The government did not survive the defeat.',

  // ─── Chained consequence cards ────────────────────────────────────────────────
  'event.pol_chain_001.title': 'THE UNIONS STRIKE BACK',
  'event.pol_chain_001.body': 'After the confrontation, the CTA and CGT unified. Ramírez calls a 48-hour general strike. The government must decide whether to negotiate, resist, legislate, or dialogue.',
  'event.pol_chain_001.choice_a': 'Declare the strike illegal by decree — zero tolerance',
  'event.pol_chain_001.choice_b': 'Open urgent negotiating table with phased wage increases',
  'event.pol_chain_001.choice_c': 'Present a labor reform bill to Congress',
  'event.pol_chain_001.choice_d': 'Call Ramírez to the Casa Rosada and negotiate in private',

  'event.pol_chain_002.title': 'THE INVESTIGATION GOES PUBLIC',
  'event.pol_chain_002.body': 'Sofía Guerrero published the report. Opposition media amplify the scandal. The ruling coalition demands a rebuttal. The President must choose how to respond publicly.',
  'event.pol_chain_002.choice_a': 'Publicly attack Guerrero — launch a smear campaign',
  'event.pol_chain_002.choice_b': 'Call a press conference and admit minor errors',
  'event.pol_chain_002.choice_c': 'Say nothing — "The government does not debate activist journalism"',
  'event.pol_chain_002.choice_d': 'Leak information that contradicts the report (off the record)',

  'event.pol_chain_003.title': 'THE AMBASSADOR\'S DEAL IS READY',
  'event.pol_chain_003.body': 'Harrison presents the bilateral agreement draft. It includes USD 2B in credit lines but demands foreign policy concessions. Congress must ratify it.',
  'event.pol_chain_003.choice_a': 'Sign the agreement as-is — economic priority',
  'event.pol_chain_003.choice_b': 'Renegotiate the foreign policy clauses — sovereignty first',
  'event.pol_chain_003.choice_c': 'Accept the credit lines but reject the political clauses',
  'event.pol_chain_003.choice_d': 'Submit the agreement for congressional ratification',

  'event.eco_chain_001.title': 'THE MINISTER\'S PLAN IS EXECUTED',
  'event.eco_chain_001.body': 'Carrizo presents the first results of the fiscal plan: primary surplus, but the social cost is visible. Unions and the opposition pressure for softer measures.',
  'event.eco_chain_001.choice_a': 'Hold the adjustment unchanged — the plan is working',
  'event.eco_chain_001.choice_b': 'Moderate the adjustment with targeted transfers',
  'event.eco_chain_001.choice_c': 'Accelerate the adjustment while the political window is open',
  'event.eco_chain_001.choice_d': 'Bring the debate to Congress to provide political cover for the plan',

  'event.eco_chain_002.title': 'FISCAL WAR WITH THE PROVINCE',
  'event.eco_chain_002.body': 'Governor Vidal withholds federal revenue-sharing funds in retaliation. Three allied provinces follow. The national government faces an income crisis and cross-cutting political pressure.',
  'event.eco_chain_002.choice_a': 'Activate national fund retention as a countermeasure',
  'event.eco_chain_002.choice_b': 'Negotiate privately with Vidal and concede on some points',
  'event.eco_chain_002.choice_c': 'Bring the conflict before the Supreme Court',
  'event.eco_chain_002.choice_d': 'Propose a revenue-sharing reform bill to Congress',

  'event.eco_chain_003.title': 'RESERVES IN FREE FALL',
  'event.eco_chain_003.body': 'The fiscal-provincial tension triggers capital flight. The BCRA loses USD 800M in a week. Markets start pricing in an imminent devaluation.',
  'event.eco_chain_003.choice_a': 'Raise interest rates to stop capital flight — recession risk',
  'event.eco_chain_003.choice_b': 'Apply emergency currency controls',
  'event.eco_chain_003.choice_c': 'Request urgent IMF technical assistance',
  'event.eco_chain_003.choice_d': 'Announce a comprehensive stabilization plan with fiscal and currency anchors',

  'event.soc_chain_001.title': 'RAMÍREZ CALLS A GENERAL STRIKE',
  'event.soc_chain_001.body': 'After the first meeting, Ramírez reads the government as weak and calls a general strike. Essential services are paralyzed. The government has 48 hours.',
  'event.soc_chain_001.choice_a': 'Yield: call Ramírez and sign an emergency agreement',
  'event.soc_chain_001.choice_b': 'Hold: declare essential services and ignore the strike',
  'event.soc_chain_001.choice_c': 'Mediate: propose a neutral arbitrator and a 5-day truce',
  'event.soc_chain_001.choice_d': 'Deflect: announce a media-friendly bonus payout — no negotiation',

  'event.soc_chain_002.title': 'RAMÍREZ PUSHES FOR MORE',
  'event.soc_chain_002.body': 'After the concession, Ramírez rallies every union: "The government has shown it yields under pressure." A new list of demands arrives at the Casa Rosada.',
  'event.soc_chain_002.choice_a': 'Concede partially again to avoid another strike',
  'event.soc_chain_002.choice_b': 'Refuse and harden the stance — no more concessions',
  'event.soc_chain_002.choice_c': 'Try to split the unions with sector-specific deals',
  'event.soc_chain_002.choice_d': 'Propose a tripartite government-unions-business table to Congress',

  'event.soc_chain_003.title': 'VIDAL PROPOSES A SOCIAL PROGRAM',
  'event.soc_chain_003.body': 'After the first contact, Governor Vidal presents a provincial employment program requiring national co-funding. It\'s an alliance opportunity — or a political trap.',
  'event.soc_chain_003.choice_a': 'Co-fund the program: federal cooperation gesture',
  'event.soc_chain_003.choice_b': 'Reject it: "The national government has its own programs"',
  'event.soc_chain_003.choice_c': 'Negotiate: support it if Vidal backs structural reforms',
  'event.soc_chain_003.choice_d': 'Federalize it: extend the program to all provinces',

  'event.soc_chain_004.title': 'MEDIA CRISIS SPILLS INTO THE STREETS',
  'event.soc_chain_004.body': 'The media crisis has overflowed into public protests. Human rights organizations and university groups are marching. Social media amplifies the image of an authoritarian government.',
  'event.soc_chain_004.choice_a': 'Ignore the protests — do not legitimize the demonstrators',
  'event.soc_chain_004.choice_b': 'Receive representatives and commit to reviewing press policy',
  'event.soc_chain_004.choice_c': 'Announce an independent freedom-of-expression commission',
  'event.soc_chain_004.choice_d': 'Propose a media law to Congress that regulates but protects',
};

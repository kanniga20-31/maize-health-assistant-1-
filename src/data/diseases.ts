import { DiseaseInfo } from '../types';

export const MAIZE_DISEASES: DiseaseInfo[] = [
  // ==========================================
  // BASE PAPER CLASSES (LightET-FusionNet)
  // ==========================================
  {
    id: 'healthy',
    category: 'base_paper',
    nameEn: 'Healthy Maize Leaf',
    nameTa: 'ஆரோக்கியமான மக்காச்சோள இலை',
    scientificName: 'Zea mays (Normal Foliage)',
    badge: 'Base Research Class',
    shortDescEn: 'Vibrant green leaf with smooth surface, clear parallel veins, and no visible fungal or bacterial lesions.',
    shortDescTa: 'எந்தவித புள்ளி அல்லது கருகல் இல்லாத பச்சையான ஆரோக்கியமான இலை அமைப்பு.',
    symptomsEn: [
      'Uniform bright green coloration across the leaf blade',
      'No chlorotic (yellow) halos or necrotic (dead brown) tissue',
      'Intact cuticle without powdery spore pustules or water-soaked streaks',
      'Sturdy mid-rib and normal leaf turgidity'
    ],
    symptomsTa: [
      'இலை முழுவதும் சீரான அடர் பச்சை நிறம்',
      'மஞ்சள் வளையங்கள் அல்லது காய்ந்த திசுக்கள் இல்லை',
      'பூஞ்சை துகள்கள் அல்லது கருகிய புள்ளிகள் இல்லை',
      'வலுவான நடுநரம்பு மற்றும் நல்ல இலை வளர்ச்சி'
    ],
    visualCharacteristicsEn: 'Homogeneous green hue (RGB chlorophyll balance), normal vein alignment, absence of lesions.',
    visualCharacteristicsTa: 'சீரான பச்சை நிறம், நேர்த்தியான நரம்புகள், நோய் தாக்கம் அற்ற மேற்பரப்பு.',
    organicTreatmentEn: {
      title: 'Maintain Plant Vigour & Soil Health',
      steps: [
        'Apply well-decomposed Farm Yard Manure (FYM) at 10–12 tons/acre before sowing.',
        'Inoculate soil with beneficial Azospirillum and Phosphobacteria to foster root microflora.',
        'Spray Panchagavya (3% dilution) or Jeevamrutha every 20 days to bolster immunity.',
        'Maintain optimum soil moisture; avoid water-logging in furrow beds.'
      ]
    },
    organicTreatmentTa: {
      title: 'பயிர் ஆரோக்கியம் மற்றும் மண் மேலாண்மை',
      steps: [
        'ஏக்கருக்கு 10–12 டன் நன்கு மக்கிய தொழுவுரம் இடவும்.',
        'அசோஸ்பைரில்லம் மற்றும் பாஸ்போபாக்டீரியாவை விதை நேர்த்தி அல்லது மண்ணில் இடவும்.',
        '20 நாட்களுக்கு ஒருமுறை 3% பஞ்சகாவ்யா அல்லது ஜீவாமிர்தம் தெளித்து நோய் எதிர்ப்பு திறனை கூட்டவும்.',
        'பாசன வாய்க்கால்களில் நீர் தேங்காமல் சீரான ஈரப்பதம் பராமரிக்கவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Balanced Nutrition Schedule',
      steps: [
        'Apply recommended balanced N:P:K (e.g., 60:30:30 kg/acre or based on soil health card).',
        'Apply Zinc Sulphate (10 kg/acre basal) to avoid interveinal chlorosis.',
        'Avoid over-application of synthetic urea, which makes leaves succulent and prone to pests.',
        'No chemical pesticide or fungicide needed for healthy crops.'
      ],
      warning: 'No chemical spray is required. Only apply recommended fertilizers as per soil testing.'
    },
    chemicalTreatmentTa: {
      title: 'சமச்சீர் உர மேலாண்மை',
      steps: [
        'மண் பரிசோதனை பரிந்துரைப்படி NPK உரங்களை அளவோடு இடவும்.',
        'துத்தநாக பற்றாக்குறை வராமல் தடுக்க ஏக்கருக்கு 10 கிலோ ஜிங்க் சல்பேட் அடியுரமாக இடவும்.',
        'அளவுக்கு அதிகமான யூரியா இடுவதை தவிர்க்கவும், அதிக தழைச்சத்து பூஞ்சை வரவைக்கும்.',
        'ஆரோக்கியமான இலைகளுக்கு பூஞ்சைக் கொல்லி மருந்துகள் தேவையில்லை.'
      ],
      warning: 'ரசாயன மருந்துகள் தேவையில்லை. மண் பரிசோதனை பரிந்துரைப்படி மட்டும் உரமிடவும்.'
    },
    preventionEn: [
      'Scout crop weekly during morning hours.',
      'Maintain field sanitation and clean irrigation channels.'
    ],
    preventionTa: [
      'வாரத்திற்கு ஒரு முறை காலை வேளையில் பயிரை கண்காணிக்கவும்.',
      'வயலில் களைகள் இல்லாமல் தூய்மையாக வைத்திருக்கவும்.'
    ]
  },
  {
    id: 'blight',
    category: 'base_paper',
    nameEn: 'Northern Leaf Blight (NLB)',
    nameTa: 'மக்காச்சோள இலை கருகல் நோய்',
    scientificName: 'Exserohilum turcicum (Bipolaris zeicola)',
    badge: 'Base Research Class',
    shortDescEn: 'Elongated, cigar-shaped grayish-green to tan lesions that run parallel to leaf veins.',
    shortDescTa: 'இலைகளில் சுருட்டு வடிவில் நீளமான சாம்பல் அல்லது பழுப்பு நிற கருகிய புள்ளிகள் தோன்றும் நோய்.',
    symptomsEn: [
      'Long, elliptical or cigar-shaped lesions (1 to 6 inches long)',
      'Lesions start on lower leaves and move upwards towards the tassel',
      'In high humidity, dark olive-brown velvety fungal spores form inside lesions',
      'Severe infection causes extensive premature blighting and dry straw-like canopy'
    ],
    symptomsTa: [
      'இலைகளில் 1 முதல் 6 அங்குல நீளத்தில் சுருட்டு வடிவ கருகல் புள்ளிகள்',
      'முதலில் கீழ்புற இலைகளில் தொடங்கி மேல்நோக்கி பரவும்',
      'காற்றில் அதிக ஈரப்பதம் இருக்கும்போது கருகிய பகுதிகளில் அடர் பூஞ்சை படலம் உருவாகும்',
      'அதிக தீவிரத்தில் இலைகள் காய்ந்து வைக்கோல் போல மாறும்'
    ],
    visualCharacteristicsEn: 'Tan elliptical stripes parallel to leaf midrib, dark necrotic core, yellow border edges.',
    visualCharacteristicsTa: 'நடுநரம்புக்கு இணையாக நீள்வட்ட பழுப்பு கறை, காய்ந்த உலர் திசுக்கள்.',
    organicTreatmentEn: {
      title: 'Organic & Cultural Control',
      steps: [
        'Spray Pseudomonas fluorescens liquid formulation @ 5 ml/liter of water at initial symptom appearance.',
        'Apply 5% Neem Seed Kernel Extract (NSKE) or Neem oil (3000 ppm) @ 3 ml/liter with natural wetting agent.',
        'Collect and destroy severely infected lower leaves to restrict spore splash.',
        'Adopt crop rotation with non-cereal legumes (cowpea, blackgram) to break spore survival in soil.'
      ]
    },
    organicTreatmentTa: {
      title: 'இயற்கை மற்றும் அங்கக முறை மேலாண்மை',
      steps: [
        'சூடோமோனாஸ் ஃப்ளோரசன்ஸ் திரவ கரைசலை ஒரு லிட்டர் தண்ணீருக்கு 5 மி.லி வீதம் கலந்து தெளிக்கவும்.',
        '5% வேப்பங்கொட்டை சாறு அல்லது வேப்ப எண்ணெய் (3000 ppm) லிட்டருக்கு 3 மி.லி கலந்து தெளிக்கவும்.',
        'அதிகம் பாதிக்கப்பட்ட கீழ் இலைகளை பறித்து வயலை விட்டு அப்புறப்படுத்தி எரிக்கவும்.',
        'பயிர் சுழற்சி முறையில் பயறு வகை பயிர்களை (உளுந்து, காராமணி) பயிரிடவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Fertilizer & Targeted Fungicide Management',
      steps: [
        'Avoid excess top-dressing of nitrogenous fertilizers during cool cloudy weather.',
        'Apply Potash (MOP) to improve leaf cell wall silica-cellulose rigidity against hyphal penetration.',
        'At first sign of lesions, spray Mancozeb 75% WP @ 2 to 2.5 g/liter of water.',
        'Alternatively, spray Azoxystrobin 18.2% + Difenoconazole 23.5% SC @ 1 ml/liter on severe outbreaks.'
      ],
      warning: 'Consult your local Krishi Vigyan Kendra (KVK) or Assistant Agricultural Officer (AAO) for approved fungicide brands and exact spray timing. Always wear protective masks and gloves.'
    },
    chemicalTreatmentTa: {
      title: 'உர மற்றும் ரசாயன பூஞ்சைக் கொல்லி மேலாண்மை',
      steps: [
        'மேகமூட்டமான குளிர்காலத்தில் அதிக தழைச்சத்து (யூரியா) இடுவதை தவிர்க்கவும்.',
        'செல்லின் சுவர்களை பலப்படுத்த பரிந்துரைக்கப்பட்ட பொட்டாஷ் உரத்தை இடவும்.',
        'நோய் தென்பட்டவுடன் மேன்கோசெப் (Mancozeb 75% WP) 2 முதல் 2.5 கிராம் லிட்டருக்கு கலந்து தெளிக்கவும்.',
        'தீவிரமாக பரவினால் அசோக்சிஸ்ட்ரோபின் + டைபினோகொனசோல் மருந்தை லிட்டருக்கு 1 மி.லி தெளிக்கவும்.'
      ],
      warning: 'மருந்துகளை வாங்கும் முன் உங்கள் பகுதி வேளாண்மை அலுவலர் அல்லது வேளாண் அறிவியல் மைய (KVK) ஆலோசனையை பெறவும். தெளிக்கும் போது முகக்கவசம் அணியவும்.'
    },
    preventionEn: [
      'Choose certified blight-tolerant hybrid seeds.',
      'Plough in crop residues deeply after harvest to bury overwintering chlamydospores.',
      'Maintain plant spacing of 60 cm x 20 cm to allow wind circulation.'
    ],
    preventionTa: [
      'இலை கருகலை தாங்கி வளரும் வீரிய ஒட்டு விதைகளை தேர்வு செய்யவும்.',
      'அறுவடைக்கு பின் நிலத்தை ஆழமாக உழுது பயிர் கழிவுகளை மண்ணில் மக்கச் செய்யவும்.',
      'பயிர்களுக்கு இடையே 60 செ.மீ x 20 செ.மீ இடைவெளி விட்டு நல்ல காற்றோட்டம் தரவும்.'
    ]
  },
  {
    id: 'common_rust',
    category: 'base_paper',
    nameEn: 'Common Rust',
    nameTa: 'மக்காச்சோள துரு நோய்',
    scientificName: 'Puccinia sorghi',
    badge: 'Base Research Class',
    shortDescEn: 'Small, circular to elongated golden-brown or cinnamon-red pustules on both upper and lower leaf surfaces.',
    shortDescTa: 'இலையின் இருபுறமும் தக்காளி சிவப்பு அல்லது செம்பழுப்பு நிறத்தில் சிறு கொப்புளங்கள் தோன்றும் நோய்.',
    symptomsEn: [
      'Small powdery reddish-brown pustules (uredinia) bursting through the leaf epidermis',
      'Pustules appear on both upper and lower sides of the blade in scattered clusters',
      'When wiped with a cloth or fingertip, leaves a rust-colored powdery residue',
      'As leaves age, pustules turn dark brownish-black (teliospore stage)'
    ],
    symptomsTa: [
      'இலை நரம்புகளுக்கு இடையே செம்பழுப்பு நிற சிறு கொப்புளங்கள் தோன்றும்',
      'இலையின் மேல் மற்றும் கீழ் இருபுறங்களிலும் துகள் கொப்புளங்கள் காணப்படும்',
      'விரலால் தொட்டால் துரு போன்ற பழுப்பு தூள் விரலில் ஒட்டிக்கொள்ளும்',
      'முதிர்ந்த பருவத்தில் இக்கொப்புளங்கள் அடர் கருப்பு நிறமாக மாறும்'
    ],
    visualCharacteristicsEn: 'Dense raised cinnamon pustules, chlorotic halos surrounding lesions, textured raised blisters.',
    visualCharacteristicsTa: 'செம்பழுப்பு நிற புடைத்த கொப்புளங்கள், அதைச் சுற்றி லேசான மஞ்சள் வளையம்.',
    organicTreatmentEn: {
      title: 'Organic & Bio-Control Measures',
      steps: [
        'Spray Wettable Sulphur (Organic certified) @ 2.5 g/liter during early morning or late evening.',
        'Apply fermented buttermilk + asafoetida solution (5 liters sour curd + 100g perungayam in 100L water) to inhibit spore germination.',
        'Spray Trichoderma harzianum @ 10 g/liter on lower and mid leaves as prophylactic spray.',
        'Remove wild Oxalis weeds around field bunds which act as alternate hosts for rust spores.'
      ]
    },
    organicTreatmentTa: {
      title: 'இயற்கை மற்றும் உயிரியல் முறைகள்',
      steps: [
        'நனையும் கந்தகம் (Wettable Sulphur) 2.5 கிராம் லிட்டர் தண்ணீரில் கலந்து காலை அல்லது மாலை வேளையில் தெளிக்கவும்.',
        'புளித்த மோர் கரைசல் (5 லிட்டர் புளித்த மோர் + 100 கிராம் பெருங்காயம் 100 லிட்டர் நீரில்) தெளிக்கவும்.',
        'டிரைக்கோடெர்மா விரிடி அல்லது ஹார்சியானம் லிட்டருக்கு 10 கிராம் கலந்து தெளிக்கவும்.',
        'வயல் வரப்புகளில் உள்ள மாற்று களைச் செடிகளை வேருடன் பிடுங்கி அப்புறப்படுத்தவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Fungicide Intervention',
      steps: [
        'Apply balanced potassium nutrition to enhance rust disease resistance.',
        'At 5–10% pustule canopy coverage, apply Mancozeb 75 WP @ 2 g/liter.',
        'In persistent high rust pressure, apply Propiconazole 25% EC @ 1 ml/liter.',
        'Repeat after 12–14 days if cool humid conditions persist.'
      ],
      warning: 'Follow proper pre-harvest intervals (PHI) noted on the pesticide label. Do not spray during peak midday heat.'
    },
    chemicalTreatmentTa: {
      title: 'ரசாயன பூஞ்சைக் கொல்லி பயன்பாடு',
      steps: [
        'பயிருக்கு போதுமான சாம்பல் சத்து (பொட்டாஷ்) இட்டு நோய் தாங்கும் ஆற்றலை கூட்டவும்.',
        'நோய் தென்பட தொடங்கியவுடன் மேன்கோசெப் (Mancozeb) 2 கிராம்/லிட்டர் தெளிக்கவும்.',
        'நோய் வேகமாக பரவினால் புரோபிகோனசோல் (Propiconazole 25% EC) 1 மி.லி/லிட்டர் வீதம் தெளிக்கவும்.',
        'தேவைப்பட்டால் 12 முதல் 14 நாட்கள் இடைவெளியில் மீண்டும் ஒருமுறை தெளிக்கவும்.'
      ],
      warning: 'கடைசி தெளிப்புக்கும் அறுவடைக்கும் இடைப்பட்ட காலத்தை (PHI) கவனத்தில் கொள்ளவும். வெயில் நேரத்தில் தெளிக்க வேண்டாம்.'
    },
    preventionEn: [
      'Plant resistant hybrids recommended by state agricultural university.',
      'Sow early in the season to evade peak rust spore wind fronts.',
      'Avoid high-density planting to reduce canopy humidity.'
    ],
    preventionTa: [
      'துரு நோயை எதிர்க்கும் வீரிய ஒட்டு விதைகளை விதைக்கவும்.',
      'பருவத்தின் தொடக்கத்திலேயே சரியான நேரத்தில் விதைப்பை முடிக்கவும்.',
      'அடர்த்தியாக நடவு செய்யாமல் சீரான காற்றோட்ட இடைவெளி தரவும்.'
    ]
  },
  {
    id: 'gray_leaf_spot',
    category: 'base_paper',
    nameEn: 'Gray Leaf Spot (GLS)',
    nameTa: 'சாம்பல் நிற இலைப்புள்ளி நோய்',
    scientificName: 'Cercospora zeae-maydis',
    badge: 'Base Research Class',
    shortDescEn: 'Rectangular, blocky tan-to-gray lesions strictly delimited by the parallel veins of the leaf blade.',
    shortDescTa: 'இலை நரம்புகளுக்கு இடையில் செவ்வக வடிவில் நீளவாக்கில் தோன்றும் சாம்பல் நிற புள்ளிகள்.',
    symptomsEn: [
      'Distinct rectangular lesions with sharp, parallel edges restricted by veins',
      'Lesions measure 0.5 to 2.5 inches in length and 0.1 to 0.2 inches in width',
      'Color shifts from tan to gray or charcoal as spores produce on leaf surfaces',
      'Coalescence of lesions leads to whole leaf blighting and stalk lodging'
    ],
    symptomsTa: [
      'இலை நரம்புகளால் தடுக்கப்பட்டு செவ்வக வடிவில் நேர்த்தியாக அமைந்த புள்ளிகள்',
      'புள்ளிகள் சாம்பல் அல்லது பழுப்பு நிறத்தில் நீளவாக்கில் இருக்கும்',
      'பூஞ்சை முதிரும் போது சாம்பல் நிற தூள் போன்ற தோற்றம் உண்டாகும்',
      'பல புள்ளிகள் ஒன்று சேர்ந்து முழு இலையையும் கருகச் செய்து தண்டை சாய்க்கும்'
    ],
    visualCharacteristicsEn: 'Block-like rectangular geometry, sharp parallel borders along veins, gray powdery cast.',
    visualCharacteristicsTa: 'நரம்புகளால் அடைபட்ட செவ்வக வடிவ புள்ளிகள், சாம்பல் நிற கறை.',
    organicTreatmentEn: {
      title: 'Natural Canopy Protection',
      steps: [
        'Foliar spray of 10% Cow urine extract + neem leaf decoction to suppress Cercospora mycelium.',
        'Spray Bacillus subtilis liquid bio-fungicide @ 3 ml/liter to competitively colonize leaf phyllosphere.',
        'Strip off heavily blighted lower leaves below the primary ear level.',
        'Intercrop with pulse crops to increase biodiversity and disrupt humidity accumulation.'
      ]
    },
    organicTreatmentTa: {
      title: 'இயற்கை இலை வழி பாதுகாப்பு',
      steps: [
        '10% மாட்டு கோமியம் மற்றும் வேப்பிலை கரைசல் தெளித்து பூஞ்சை வளர்ச்சியை கட்டுப்படுத்தவும்.',
        'பேசில்லஸ் சப்டிலிஸ் (Bacillus subtilis) திரவ உயிரி மருந்தை லிட்டருக்கு 3 மி.லி தெளிக்கவும்.',
        'கதிருக்கு கீழ் உள்ள அதிகம் பாதிக்கப்பட்ட இலைகளை நீக்கி விடவும்.',
        'ஊடுபயிராக பயறு வகைகளை சாகுபடி செய்து பூஞ்சை வேகத்தை குறைக்கவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Targeted Chemotherapy & Nutrient Balance',
      steps: [
        'Avoid excessive late nitrogen top-dressing; maintain balanced phosphate and potash.',
        'Apply Carbendazim 12% + Mancozeb 63% WP @ 2 g/liter at the first sign of rectangular lesions.',
        'In high risk areas, spray Pyraclostrobin 20% WG @ 1 g/liter or Azoxystrobin @ 1 ml/liter.',
        'Direct spray towards the ear leaf and leaves above the ear node.'
      ],
      warning: 'Rotate fungicide chemical classes (FRAC codes) to avoid pathogen resistance buildup. Read container labels carefully.'
    },
    chemicalTreatmentTa: {
      title: 'ரசாயன பூஞ்சைக் கொல்லி மற்றும் உர முறை',
      steps: [
        'பிற்கால கட்டங்களில் அதிகப்படியான தழைச்சத்தை தவிருங்கள், பொட்டாஷ் சமநிலையை பேணவும்.',
        'கார்பன்டசிம் + மேன்கோசெப் கலவை மருந்தை 2 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.',
        'தீவிர பாதிப்புக்கு பைராக்ளோஸ்ட்ரோபின் அல்லது அசோக்சிஸ்ட்ரோபின் மருந்தை லிட்டருக்கு 1 மிலி/கிராம் தெளிக்கவும்.',
        'குறிப்பாக கதிர் உள்ள நடுப்பகுதி இலைகளில் படுமாறு தெளிக்கவும்.'
      ],
      warning: 'ஒரே பூஞ்சைக் கொல்லியை தொடர்ந்து பயன்படுத்தாமல் மாற்றி மாற்றி தெளிக்கவும். வேளாண் அலுவலர் பரிந்துரையை பெறவும்.'
    },
    preventionEn: [
      'Select hybrids with high GLS disease rating scores.',
      'Practice 2-year non-host crop rotation where GLS is endemic.',
      'Avoid continuous no-till corn after corn.'
    ],
    preventionTa: [
      'சாம்பல் புள்ளி நோயை தாங்கும் வீரிய ரகங்களை பயிரிடவும்.',
      'மக்காச்சோளம் அறுவடைக்கு பின் மாற்று பயிர்களை சுழற்சி முறையில் நடவு செய்யவும்.',
      'மக்காச்சோளத்திற்கு பின் மீண்டும் உடனடியாக மக்காச்சோளம் பயிரிடுவதை தவிர்க்கவும்.'
    ]
  },

  // ==========================================
  // ADDITIONAL EXTENDED CLASSES
  // ==========================================
  {
    id: 'leaf_spot',
    category: 'extended',
    nameEn: 'Southern Leaf Spot (Bipolaris)',
    nameTa: 'மக்காச்சோள தெற்கு இலைப்புள்ளி நோய்',
    scientificName: 'Bipolaris maydis (Cochliobolus heterostrophus)',
    badge: 'Extended Model Class',
    shortDescEn: 'Small oval to diamond-shaped tan lesions with distinct reddish-brown borders.',
    shortDescTa: 'இலைகளில் முட்டை அல்லது வைரம் போன்ற வடிவில் சிவந்த விளிம்புகளுடன் கூடிய புள்ளிகள்.',
    symptomsEn: [
      'Small oval tan lesions (0.5 to 1 inch long) with reddish margins',
      'Lesions are smaller and more rounded than Northern Leaf Blight',
      'Attacks leaves, leaf sheaths, and occasionally ear husks',
      'Leaf tissue between spots becomes chlorotic and wilts'
    ],
    symptomsTa: [
      'இலையில் சிறிய முட்டை வடிவ பழுப்பு புள்ளிகள்',
      'புள்ளிகளை சுற்றி சிவந்த பழுப்பு நிற விளிம்பு கோடு இருக்கும்',
      'இலை தாள்கள் மற்றும் கதிர் உறைகளையும் தாக்கும்',
      'புள்ளிகளுக்கு இடையேயான இலை பகுதி மஞ்சள் நிறமாக மாறி காய்ந்துவிடும்'
    ],
    visualCharacteristicsEn: 'Oval to elliptical spots with defined reddish halos, smaller than cigar blights.',
    visualCharacteristicsTa: 'சிறிய நீள்வட்ட புள்ளிகள், சிவந்த விளிம்புகள்.',
    organicTreatmentEn: {
      title: 'Herbal & Bio-Agent Spraying',
      steps: [
        'Spray Agni Astra or 5-leaf herbal extract (Neem, Calotropis, Adhatoda, Pongamia, Papaya) at 3% concentration.',
        'Apply Pseudomonas fluorescens @ 5 g/liter at 15-day intervals.',
        'Mulch soil surface with dry organic matter to prevent soil-splashing of spores.'
      ]
    },
    organicTreatmentTa: {
      title: 'மூலிகை மற்றும் உயிரி பூஞ்சை கட்டுப்பாடு',
      steps: [
        'ஐந்து இலை கரைசல் (வேம்பு, எருக்கு, ஆடாதோடை, புங்கம், பப்பாளி) 3% தெளிக்கவும்.',
        'சூடோமோனாஸ் ஃப்ளோரசன்ஸ் 5 கிராம்/லிட்டர் வீதம் 15 நாட்கள் இடைவெளியில் தெளிக்கவும்.',
        'மண்ணில் உள்ள பூஞ்சை இலைகளில் தெறிக்காமல் இருக்க உலர்ந்த இலை மூடாக்கு இடவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Protective Fungicide Regimen',
      steps: [
        'Apply Zineb 75% WP @ 2 g/liter or Mancozeb 75% WP @ 2.5 g/liter.',
        'Ensure spray coverage reaches both leaf surfaces.',
        'Maintain balanced nitrogen:phosphate:potash ratio (4:2:1).'
      ],
      warning: 'Avoid spraying within 21 days of harvesting grain or green cobs. Follow pesticide label guidelines.'
    },
    chemicalTreatmentTa: {
      title: 'பாதுகாப்பு பூஞ்சைக் கொல்லி முறை',
      steps: [
        'சைனெப் (Zineb 75% WP) 2 கிராம் அல்லது மேன்கோசெப் 2.5 கிராம்/லிட்டர் கலந்து தெளிக்கவும்.',
        'இலையின் இருபுறமும் மருந்து நனையுமாறு தெளிக்கவும்.',
        'சமச்சீர் உர மேலாண்மையை தவறாது பின்பற்றவும்.'
      ],
      warning: 'பச்சை கதிர் அல்லது தானிய அறுவடைக்கு 21 நாட்களுக்குள் பூச்சிக்கொல்லி தெளிக்க வேண்டாம்.'
    },
    preventionEn: [
      'Use certified pathogen-free treated seed.',
      'Bury debris after harvest through deep summer tillage.'
    ],
    preventionTa: [
      'நோய் தாக்காத சான்று பெற்ற விதை நேர்த்தி செய்த விதைகளை பயன்படுத்தவும்.',
      'கோடையில் ஆழ உழவு செய்து பூஞ்சை விதைகளை அழிக்கவும்.'
    ]
  },
  {
    id: 'downy_mildew',
    category: 'extended',
    nameEn: 'Maize Downy Mildew',
    nameTa: 'மக்காச்சோள அடிச்சாம்பல் நோய்',
    scientificName: 'Peronosclerospora sorghi / heteropogoni',
    badge: 'Extended Model Class',
    shortDescEn: 'Yellow-white chlorotic striping from leaf base extending outward, accompanied by white downy growth underneath.',
    shortDescTa: 'இலையின் அடிப்பகுதியில் இருந்து மேல்நோக்கி வெளிறிய மஞ்சள் வரிகளும், இலையின் கீழ் வெள்ளை பூஞ்சை படலமும் தோன்றும் நோய்.',
    symptomsEn: [
      'Vivid chlorotic yellow-to-whitish parallel bands running from leaf base',
      'Velvety white downy mildew fungal growth on the lower leaf surface in humid mornings',
      'Stunting of infected plants, narrow erect leaves, often called "crazy top"',
      'Sterile tassels and malformed ears with leafy proliferations'
    ],
    symptomsTa: [
      'இலையின் அடியில் இருந்து வெளிறிய மஞ்சள் நிற நீண்ட வரிகள்',
      'அதிகாலை வேளையில் இலையின் கீழ் பகுதியில் வெள்ளை பஞ்சு போன்ற பூஞ்சை படலம்',
      'செடி குட்டையாகி, இலைகள் குறுகி நிற்கும்',
      'கதிர்கள் மற்றும் பூக்கள் உருமாறி மலட்டுத் தன்மையடையும்'
    ],
    visualCharacteristicsEn: 'Broad chlorotic bands starting at leaf sheath base, white fungal bloom on underside.',
    visualCharacteristicsTa: 'இலையின் அடியில் இருந்து தொடங்கும் அகன்ற மஞ்சள் பட்டைகள், கீழே வெண் படலம்.',
    organicTreatmentEn: {
      title: 'Early Sanitation & Soil Cleansing',
      steps: [
        'Rogue out (pull up and burn) all systemically infected stunted plants immediately.',
        'Treat seeds with Trichoderma viride @ 10 g/kg seed before sowing.',
        'Apply fermented cow urine (1:10 dilution) along with neem oil to strengthen unaffected plants.'
      ]
    },
    organicTreatmentTa: {
      title: 'ஆரம்ப கால வயல் தூய்மை மற்றும் விதை நேர்த்தி',
      steps: [
        'பாதிக்கப்பட்டு வளர்ச்சி குன்றிய செடிகளை உடனடியாக வேரோடு பிடுங்கி தீயிட்டு எரிக்கவும்.',
        'விதைப்பதற்கு முன் டிரைக்கோடெர்மா விரிடி 10 கிராம்/கிலோ விதைக்கு கொண்டு விதை நேர்த்தி செய்யவும்.',
        'பச்சை மாட்டு கோமியம் மற்றும் வேப்ப எண்ணெய் கரைசல் தெளித்து மற்ற செடிகளை பாதுகாக்கவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Systemic Fungicide Intervention',
      steps: [
        'Pre-sowing seed treatment with Metalaxyl-M @ 2 g/kg seed is the primary defense.',
        'If early foliar chlorosis is observed at 20-30 days, spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/liter.',
        'Ensure application is done in early morning when relative humidity is high.'
      ],
      warning: 'Downy mildew spreads systemically. Foliar chemical sprays cannot cure advanced systemic stunted plants; rogue them out immediately.'
    },
    chemicalTreatmentTa: {
      title: 'உள் பரவும் பூஞ்சைக் கொல்லி சிகிச்சை',
      steps: [
        'விதைப்பதற்கு முன் மெட்டாலாக்சில் (Metalaxyl) 2 கிராம்/கிலோ விதை நேர்த்தி செய்வது மிக முக்கியம்.',
        '20-30 நாட்களில் மஞ்சள் வரிகள் தெரிந்தால் மெட்டாலாக்சில் + மேன்கோசெப் 2.5 கிராம்/லிட்டர் தெளிக்கவும்.',
        'அதிகாலை வேளையில் பனி இருக்கும் போது தெளிப்பது சிறந்தது.'
      ],
      warning: 'முழுமையாக குட்டையான செடிகளை மருந்து தெளித்து குணப்படுத்த முடியாது. அவற்றை பிடுங்கி அழித்து மற்ற பயிரை காக்கவும்.'
    },
    preventionEn: [
      'Avoid planting maize adjacent to infected sorghum or sweet corn fields.',
      'Follow synchronous community sowing within a 10-day window.'
    ],
    preventionTa: [
      'அடிச்சாம்பல் நோய் தாக்கிய சோள வயல்களுக்கு அருகில் மக்காச்சோளம் நட வேண்டாம்.',
      'ஒரே பகுதியில் உள்ள விவசாயிகள் அனைவரும் 10 நாட்களுக்குள் விதைப்பை முடிக்கவும்.'
    ]
  },
  {
    id: 'ear_rot',
    category: 'extended',
    nameEn: 'Maize Ear Rot (Fusarium / Gibberella)',
    nameTa: 'மக்காச்சோள கதிர் அழுகல் நோய்',
    scientificName: 'Fusarium verticillioides / Gibberella zeae',
    badge: 'Extended Model Class',
    shortDescEn: 'Cottony white, pink, or reddish-brown fungal mycelium colonizing kernels inside the cob.',
    shortDescTa: 'கதிரில் உள்ள மணிகளில் வெள்ளை அல்லது இளஞ்சிவப்பு நிற பூஞ்சை பஞ்சு போல் படர்ந்து அழுகும் நோய்.',
    symptomsEn: [
      'White to pinkish-red mold growing between and over kernels',
      'Kernels show "starburst" patterns of white radiating streaks',
      'Premature bleaching of ear husks while the rest of the plant is green',
      'Kernels become brittle, discolored, and contaminated with mycotoxins (fumonisins)'
    ],
    symptomsTa: [
      'மணிகளுக்கு இடையில் வெள்ளை அல்லது இளஞ்சிவப்பு நிற பஞ்சு போன்ற பூஞ்சை வளர்ச்சி',
      'மணிகளில் விண்மீன் வெடிப்பு போன்ற வெள்ளை கோடுகள் தோன்றும்',
      'செடி பச்சையாக இருக்கும் போதே கதிர் உறை வெளிறி காய்ந்துவிடும்',
      'மணிகள் நொறுங்கி விஷத்தன்மை (மைக்கோடாக்சின்) கொண்டதாக மாறும்'
    ],
    visualCharacteristicsEn: 'Pinkish-white mycelial mass on cob kernels, damaged ear tips with rot discoloration.',
    visualCharacteristicsTa: 'கதிர் மணிகளில் இளஞ்சிவப்பு அல்லது வெள்ளை பூஞ்சை, அழுகிய மணிகள்.',
    organicTreatmentEn: {
      title: 'Grain Care & Insect Prevention',
      steps: [
        'Prevent ear borer / armyworm damage which creates entry wounds for Fusarium fungal spores.',
        'Spray Beauveria bassiana @ 5 g/liter at silk emergence to deter kernel-feeding caterpillars.',
        'Harvest immediately when physiologically mature; never allow cobs to sit damp in the field.'
      ]
    },
    organicTreatmentTa: {
      title: 'கதிர் பாதுகாப்பு மற்றும் பூச்சி கட்டுப்பாடு',
      steps: [
        'கதிர் துளைப்பான் மற்றும் புழுக்கள் கதிரை துளைக்காமல் பாதுகாக்கவும்.',
        'பூ பூக்கும் மற்றும் தட்டல் பருவத்தில் பவேரியா பேசியானா உயிரி பூச்சிக்கொல்லி தெளிக்கவும்.',
        'பயிர் முதிர்ந்தவுடன் உடனே அறுவடை செய்து விடவும், வயலில் ஈரப்பதத்தில் விடக்கூடாது.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Silk Protection & Post-Harvest Drying',
      steps: [
        'Fungicide sprays at silking (Azoxystrobin or Propiconazole @ 1 ml/L) can reduce ear infection in high-risk seasons.',
        'Dry shelled grains immediately to below 13.5% moisture within 48 hours of harvest to arrest mold.',
        'Store grains in airtight hermetic bags (PICS bags) or treated metallic bins.'
      ],
      warning: 'Never feed moldy rotten maize cobs to cattle, poultry, or humans due to dangerous mycotoxins.'
    },
    chemicalTreatmentTa: {
      title: 'கதிர் தட்டல் மற்றும் அறுவடை பின் மேலாண்மை',
      steps: [
        'கதிர் உருவாகும் தருவாயில் தேவையானால் அசோக்சிஸ்ட்ரோபின் 1 மி.லி/லிட்டர் தெளிக்கலாம்.',
        'அறுவடை செய்த 48 மணி நேரத்திற்குள் தானியத்தின் ஈரப்பதத்தை 13.5% கீழ் கொண்டு வர உலர்த்தவும்.',
        'காற்று புகாத பி.ஐ.சி.எஸ் (PICS) பைகளில் அல்லது சுத்தமான தானிய தொட்டிகளில் சேமிக்கவும்.'
      ],
      warning: 'அழுகிய அல்லது பூஞ்சை பிடித்த மக்காச்சோளத்தை மனிதர்களுக்கோ அல்லது மாடுகளுக்கோ தீவனமாக கொடுக்கக்கூடாது.'
    },
    preventionEn: [
      'Plant tight-husked, downward-drooping cob hybrids.',
      'Control ear-feeding corn borers using pheromone traps.'
    ],
    preventionTa: [
      'கதிர் உறை நன்கு மூடியிருக்கும் ரகங்களை தேர்வு செய்யவும்.',
      'இனக்கவர்ச்சி பொறிகள் வைத்து கதிர் புழுக்களை கட்டுப்படுத்தவும்.'
    ]
  },
  {
    id: 'smut',
    category: 'extended',
    nameEn: 'Maize Common Smut',
    nameTa: 'மக்காச்சோள கதிர் கரிப்பூட்டை நோய்',
    scientificName: 'Ustilago maydis',
    badge: 'Extended Model Class',
    shortDescEn: 'Fleshy, silvery-white galls or swellings that swell and burst into powdery black masses of spores.',
    shortDescTa: 'கதிர், தண்டு அல்லது இலைகளில் வெள்ளி நிற வீக்கங்கள் தோன்றி, பின்னர் உடைந்து கருப்பு தூளாக மாறும் நோய்.',
    symptomsEn: [
      'Spongy, silvery-white enclosed galls on ears, tassels, nodes, or leaves',
      'Galls can expand up to 4–5 inches in diameter',
      'As galls mature, outer membrane ruptures releasing millions of sooty black teliospores',
      'Severe early stalk galls result in barren or stunted stalks'
    ],
    symptomsTa: [
      'கதிர், பூ அல்லது தண்டு பகுதியில் உருண்டையான வெள்ளி போன்ற வெண் கட்டிகள்',
      'கட்டிகள் 4 முதல் 5 அங்குலம் வரை வீங்கி பெரிதாகும்',
      'முதிர்ச்சியடையும் போது கட்டியின் தோல் உடைந்து கருப்பு கரி போன்ற தூள்கள் வெளியேறும்',
      'செடியின் தண்டு வீங்கினால் கதிர் பிடிக்காமல் போகும்'
    ],
    visualCharacteristicsEn: 'Bulbous white tumor galls with silvery membrane, ruptured black sooty interior.',
    visualCharacteristicsTa: 'வெள்ளி நிற வீங்கிய கட்டிகள், உட்புறத்தில் கரி போன்ற கருப்பு தூள்.',
    organicTreatmentEn: {
      title: 'Manual Sanitary Removal',
      steps: [
        'Carefully cut out young unopened galls using a plastic bag covering before they rupture spores.',
        'Burry or burn removed galls far away from cultivation fields.',
        'Apply neem cake @ 100 kg/acre to soil to suppress soil-borne teliospores.'
      ]
    },
    organicTreatmentTa: {
      title: 'கட்டிகளை அப்புறப்படுத்தும் முறை',
      steps: [
        'கட்டிகள் உடைந்து கரித்தூள் வெளியேறும் முன்பே பாலித்தீன் பை கொண்டு மூடி கவனமாக வெட்டி அப்புறப்படுத்தவும்.',
        'அகற்றிய கட்டிகளை வயலை விட்டு தொலைவில் தீயிட்டு எரிக்கவும் அல்லது குழி தோண்டி புதைக்கவும்.',
        'ஏக்கருக்கு 100 கிலோ வேப்பம்பிண்ணாக்கு இட்டு மண்ணில் உள்ள வித்துக்களை அழிக்கவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Preventive Seed & Crop Protection',
      steps: [
        'No foliar fungicide is economical once galls develop.',
        'Seed treatment with Carboxin + Thiram @ 2 g/kg seed kills surface teliospores.',
        'Avoid mechanical wounding or cultivator injury during weeding, which allows Ustilago entry.'
      ],
      warning: 'Foliar sprays are ineffective against established galls. Physical removal before rupture is critical.'
    },
    chemicalTreatmentTa: {
      title: 'விதை நேர்த்தி மற்றும் பாதுகாப்பு',
      steps: [
        'கட்டிகள் உருவான பிறகு இலை மீது தெளிக்கும் மருந்துகளால் பலனில்லை.',
        'விதைக்கும் முன் கார்பாக்சின் + தீரம் 2 கிராம்/கிலோ விதை நேர்த்தி செய்யவும்.',
        'களை எடுக்கும் போதும் உழும் போதும் செடிகளில் காயம் படாமல் பார்த்துக் கொள்ளவும்.'
      ],
      warning: 'வீங்கிய கட்டிகளுக்கு பூஞ்சைக் கொல்லி பலன் தராது. கட்டிகளை உடனே வெட்டி அப்புறப்படுத்துவதே சிறந்தது.'
    },
    preventionEn: [
      'Plant hybrids with intact ear tip covers.',
      'Maintain balanced nitrogen; avoid high-nitrogen manure toxicity.'
    ],
    preventionTa: [
      'முழுமையாக மூடிய உறை கொண்ட கதிர் ரகங்களை தேர்வு செய்யவும்.',
      'அதிகப்படியான தழைச்சத்து உரங்களை தவிர்க்கவும்.'
    ]
  },
  {
    id: 'stalk_rot',
    category: 'extended',
    nameEn: 'Maize Stalk Rot (Gibberella / Fusarium)',
    nameTa: 'மக்காச்சோள தண்டு அழுகல் நோய்',
    scientificName: 'Fusarium verticillioides / Gibberella zeae',
    badge: 'Extended Model Class',
    shortDescEn: 'Internal decay and hollowing of lower stem nodes with pink or brown discolored pith, causing lodging.',
    shortDescTa: 'தண்டின் அடிப்பகுதி கணுக்கள் உள்கூடாக அழுகி, இளஞ்சிவப்பு நிறமாக மாறி செடிகள் நிலத்தில் சாயும் நோய்.',
    symptomsEn: [
      'Premature plant death and dull grayish-green wilted foliage after flowering',
      'Lower stalk internodes become soft, spongy, and easily crushed between thumb and finger',
      'Splitting the stalk reveals shredded, disintegrated pith with pink/salmon or brownish discoloration',
      'Severe lodging (falling over) in wind, making machine or manual harvesting difficult'
    ],
    symptomsTa: [
      'பூத்த பிறகு செடி திடீரென வாடி காய்ந்து போதல்',
      'தண்டின் கீழ் கணுக்கள் மென்மையாகி விரலால் அழுத்தினால் உடையும்',
      'தண்டை பிளந்து பார்த்தால் உட்பகுதி அழுகி இளஞ்சிவப்பு அல்லது பழுப்பு நிறமாக இருக்கும்',
      'லேசான காற்று அடித்தாலும் பயிர்கள் நிலத்தில் சாய்ந்துவிடும்'
    ],
    visualCharacteristicsEn: 'Darkened, softened lower stem nodes, pinkish spongy internal vascular pith disintegration.',
    visualCharacteristicsTa: 'கருத்த மென்மையான தண்டுப் பகுதி, உள்பகுதி இளஞ்சிவப்பு அழுகல்.',
    organicTreatmentEn: {
      title: 'Root & Soil Microbiome Strengthening',
      steps: [
        'Apply Trichoderma viride or T. harzianum @ 2.5 kg enriched in 250 kg FYM per acre as basal dressing.',
        'Avoid plant stress during grain fill: provide timely protective irrigation during drought.',
        'Maintain balanced plant population; avoid over-crowding.'
      ]
    },
    organicTreatmentTa: {
      title: 'மண் மற்றும் வேர் மண்டல பாதுகாப்பு',
      steps: [
        'ஏக்கருக்கு 2.5 கிலோ டிரைக்கோடெர்மா விரிடியை 250 கிலோ தொழுவுரத்துடன் கலந்து அடியுரமாக இடவும்.',
        'தானியம் நிறையும் பருவத்தில் பயிருக்கு நீர் பற்றாக்குறை வராமல் சீரான பாசனம் தரவும்.',
        'செடிகளை மிக நெருக்கமாக நடாமல் போதுமான இடைவெளி விடவும்.'
      ]
    },
    chemicalTreatmentEn: {
      title: 'Nutrient & Stalk Fortification',
      steps: [
        'Apply Potassium (MOP @ 25 kg/acre) to strengthen stalk rind cell walls.',
        'Drench soil around base with Copper Oxychloride 50% WP @ 3 g/liter or Carbendazim @ 1 g/liter if early node rot appears.',
        'Avoid excessive late nitrogen fertilization which creates thin stalk walls.'
      ],
      warning: 'Soil drenching must target the root collar zone. Do not contaminate nearby open water channels.'
    },
    chemicalTreatmentTa: {
      title: 'தண்டு உறுதிப்படுத்தும் உர முறை',
      steps: [
        'தண்டு கெட்டியாக இருக்க ஏக்கருக்கு 25 கிலோ பொட்டாஷ் உரத்தை தவறாது இடவும்.',
        'ஆரம்ப கட்டத்தில் காப்பர் ஆக்ஸிகுளோரைடு 3 கிராம்/லிட்டர் தண்ணீரில் கலந்து தூர் பகுதியில் ஊற்றவும்.',
        'பிற்காலத்தில் அளவுக்கு அதிகமான யூரியா போடுவதை முற்றிலும் தவிர்க்கவும்.'
      ],
      warning: 'மருந்து கரைசலை செடியின் வேர் பகுதியில் ஊற்றவும். பாசன வாய்க்கால்களில் மருந்தை கலக்க வேண்டாம்.'
    },
    preventionEn: [
      'Select stalk-rot resistant hybrids with high "stay-green" trait.',
      'Harvest lodged fields promptly to prevent ear contamination.'
    ],
    preventionTa: [
      'தண்டு வலுவான மற்றும் தண்டு அழுகலை தாங்கும் வீரிய ரகங்களை தேர்வு செய்யவும்.',
      'சாய்ந்த பயிர்களை காலம் தாழ்த்தாமல் உடனே அறுவடை செய்து விடவும்.'
    ]
  }
];

export const BASE_PAPER_DISEASE_IDS = ['healthy', 'blight', 'common_rust', 'gray_leaf_spot'];

export function getDiseaseById(id: string): DiseaseInfo | undefined {
  return MAIZE_DISEASES.find((d) => d.id === id);
}

export interface SampleLeaf {
  id: string;
  nameEn: string;
  nameTa: string;
  diseaseId: string;
  category: 'base_paper' | 'extended';
  descriptionEn: string;
  descriptionTa: string;
  mode: 'leaf' | 'full_plant';
  svgDataUri: string; // Real image URL / path (retained for backward compatibility)
  imageUrl: string; // Real field image path
  maskSvgDataUri?: string;
  badge?: string;
}

// Function to generate realistic maize leaf SVG data URIs (retained for compatibility)
export function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const SAMPLE_MAIZE_IMAGES: SampleLeaf[] = [
  {
    id: 'sample-rust',
    nameEn: 'Common Rust (Field Photo)',
    nameTa: 'பொதுவான துரு நோய் (களப் படம்)',
    diseaseId: 'common_rust',
    category: 'base_paper',
    descriptionEn: 'Authentic field photograph of maize leaf blade infected with dense Puccinia sorghi rust pustules.',
    descriptionTa: 'மக்காச்சோள இலையில் உள்ள பொதுவான துரு நோய் (பக்சீனியா சொர்கி) கொப்புளங்கள்.',
    mode: 'leaf',
    imageUrl: '/samples/sample_common_rust.jpg',
    svgDataUri: '/samples/sample_common_rust.jpg',
    badge: 'Real Photo',
  },
  {
    id: 'sample-blight',
    nameEn: 'Northern Leaf Blight (NLB)',
    nameTa: 'வடக்கு இலை கருகல் நோய் (NLB)',
    diseaseId: 'blight',
    category: 'base_paper',
    descriptionEn: 'Authentic field photograph of Exserohilum turcicum causing elongated cigar-shaped necrotic lesions.',
    descriptionTa: 'இலையில் நீளமான சுருட்டு வடிவ பழுப்பு கருகிய திட்டுகள்.',
    mode: 'leaf',
    imageUrl: '/samples/sample_blight.jpg',
    svgDataUri: '/samples/sample_blight.jpg',
    badge: 'Real Photo',
  },
  {
    id: 'sample-gls',
    nameEn: 'Gray Leaf Spot (GLS)',
    nameTa: 'சாம்பல் இலைப்புள்ளி நோய் (GLS)',
    diseaseId: 'gray_leaf_spot',
    category: 'base_paper',
    descriptionEn: 'Authentic field photograph displaying blocky rectangular lesions delimited by leaf veins (Cercospora zeae-maydis).',
    descriptionTa: 'இலை நரம்புகளுக்கு இடையில் செவ்வக வடிவிலான சாம்பல் நிற புள்ளிகள்.',
    mode: 'leaf',
    imageUrl: '/samples/sample_gls.png',
    svgDataUri: '/samples/sample_gls.png',
    badge: 'Real Photo',
  },
  {
    id: 'sample-healthy',
    nameEn: 'Healthy Maize Leaf',
    nameTa: 'ஆரோக்கியமான மக்காச்சோள இலை',
    diseaseId: 'healthy',
    category: 'base_paper',
    descriptionEn: 'Field photograph of a pristine, vibrant green maize leaf blade with healthy chlorophyll and intact venation.',
    descriptionTa: 'எந்தவித நோய்ப் புள்ளிகளும் இல்லாத பசுமையான ஆரோக்கியமான இலை.',
    mode: 'leaf',
    imageUrl: '/samples/sample_healthy.jpg',
    svgDataUri: '/samples/sample_healthy.jpg',
    badge: 'Real Photo',
  },
  {
    id: 'sample-downy',
    nameEn: 'Downy Mildew / Chlorosis',
    nameTa: 'அடிச்சாம்பல் நோய் (மஞ்சள் வரிகள்)',
    diseaseId: 'downy_mildew',
    category: 'extended',
    descriptionEn: 'Field specimen displaying distinct yellow chlorotic striping parallel to the midrib.',
    descriptionTa: 'இலையின் நடுநரம்பை ஒட்டிய நீண்ட வெளிர் மஞ்சள் நரம்பு வரிகள்.',
    mode: 'leaf',
    imageUrl: '/samples/sample_downy.jpg',
    svgDataUri: '/samples/sample_downy.jpg',
    badge: 'Real Photo',
  },
  {
    id: 'sample-full-plant',
    nameEn: 'Full Maize Canopy (Field View)',
    nameTa: 'முழு மக்காச்சோள செடி (வயல் பார்வை)',
    diseaseId: 'blight',
    category: 'base_paper',
    descriptionEn: 'Field photograph of standing maize plants with lower canopy foliar inspection scan.',
    descriptionTa: 'வயலில் நிற்கும் மக்காச்சோள பயிர்களின் முழு செடி கள ஆய்வு.',
    mode: 'full_plant',
    imageUrl: '/samples/sample_full_plant.jpg',
    svgDataUri: '/samples/sample_full_plant.jpg',
    badge: 'Field Photo',
  },
  {
    id: 'sample-stalk-rot',
    nameEn: 'Stalk Rot (Fusarium / Gibberella)',
    nameTa: 'தண்டு அழுகல் நோய் (ஃபியூசேரியம்)',
    diseaseId: 'stalk_rot',
    category: 'extended',
    descriptionEn: 'Maize stalk split lengthwise showing disintegrated pith, pink/salmon mycelium, and rotting lower nodes.',
    descriptionTa: 'தண்டின் அடிப்பகுதி கணுக்கள் மற்றும் உள்கூடு அழுகி, இளஞ்சிவப்பு நிறமாக மாறிய தண்டு அழுகல்.',
    mode: 'full_plant',
    imageUrl: '/samples/sample_stalk_rot.svg',
    svgDataUri: '/samples/sample_stalk_rot.svg',
    badge: 'Stalk Pathology',
  },
];

export function getSampleLeafByImageUrl(imageUrl: string): SampleLeaf | undefined {
  if (!imageUrl) return undefined;
  return SAMPLE_MAIZE_IMAGES.find(
    (s) =>
      s.imageUrl === imageUrl ||
      s.svgDataUri === imageUrl ||
      s.id === imageUrl ||
      imageUrl.includes(s.id) ||
      (s.imageUrl && imageUrl.includes(s.imageUrl))
  );
}

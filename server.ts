import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

// Fallback to reading .env.example or .env if process.env.GEMINI_API_KEY is not yet populated
function getGeminiApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    return process.env.GEMINI_API_KEY;
  }
  try {
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf-8');
      const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
      if (match && match[1] && match[1] !== 'MY_GEMINI_API_KEY') {
        return match[1].trim();
      }
    }
    if (fs.existsSync('.env.example')) {
      const envExContent = fs.readFileSync('.env.example', 'utf-8');
      const match = envExContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
      if (match && match[1] && match[1] !== 'MY_GEMINI_API_KEY') {
        return match[1].trim();
      }
    }
  } catch (err) {
    console.warn('Could not read fallback env file:', err);
  }
  return process.env.GEMINI_API_KEY || '';
}

const PORT = 3000;

async function startServer() {
  const app = express();

  // Enable CORS for all incoming requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Support base64 image uploads up to 25MB
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Status check endpoints
  const handleStatus = (req: express.Request, res: express.Response) => {
    const key = getGeminiApiKey();
    res.json({
      status: 'ok',
      hasKey: Boolean(key && key.length > 5),
      model: 'vision-ai-3.8',
    });
  };

  app.get('/api/vision/status', handleStatus);
  app.get('/api/gemini/status', handleStatus);

  // Multimodal Vision Leaf Analysis (WHAT & WHERE)
  const handleAnalyze = async (req: express.Request, res: express.Response) => {
    try {
      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        return res.status(400).json({
          error: 'AI Vision authentication key is not configured.',
        });
      }

      const { image, lang = 'en', suspectedDisease } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(400).json({ error: 'No valid image string provided' });
      }

      // Extract base64 and mime type safely
      let mimeType = 'image/jpeg';
      let base64Data = '';

      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      } else if (image.startsWith('/') || image.startsWith('samples/')) {
        // Local relative path (e.g. /samples/sample_blight.jpg)
        const cleanPath = image.replace(/^\/+/, '');
        const candidatePaths = [
          path.join(process.cwd(), 'public', cleanPath),
          path.join(process.cwd(), cleanPath),
          path.resolve('public', cleanPath),
          path.resolve(cleanPath),
        ];
        console.log('Resolving local image:', { image, cleanPath, cwd: process.cwd(), candidatePaths });
        for (const cand of candidatePaths) {
          const exists = fs.existsSync(cand);
          console.log('Checking path:', cand, 'exists:', exists);
          if (exists) {
            try {
              const fileBuf = fs.readFileSync(cand);
              base64Data = fileBuf.toString('base64');
              if (cand.endsWith('.png')) mimeType = 'image/png';
              else if (cand.endsWith('.webp')) mimeType = 'image/webp';
              else if (cand.endsWith('.jpg') || cand.endsWith('.jpeg')) mimeType = 'image/jpeg';
              console.log('Successfully read local image, base64 length:', base64Data.length);
              break;
            } catch (err) {
              console.warn('Could not read local file:', cand, err);
            }
          }
        }
      } else if (image.startsWith('http://') || image.startsWith('https://')) {
        // Check if URL is pointing to local server
        const isLocalHost = image.includes('localhost') || image.includes('127.0.0.1');
        if (isLocalHost) {
          try {
            const parsedUrl = new URL(image);
            const cleanPath = parsedUrl.pathname.replace(/^\/+/, '');
            const candidatePaths = [
              path.join(process.cwd(), 'public', cleanPath),
              path.join(process.cwd(), cleanPath),
            ];
            for (const cand of candidatePaths) {
              if (fs.existsSync(cand)) {
                const fileBuf = fs.readFileSync(cand);
                base64Data = fileBuf.toString('base64');
                if (cand.endsWith('.png')) mimeType = 'image/png';
                else if (cand.endsWith('.webp')) mimeType = 'image/webp';
                else if (cand.endsWith('.jpg') || cand.endsWith('.jpeg')) mimeType = 'image/jpeg';
                break;
              }
            }
          } catch (urlErr) {
            console.warn('URL parsing error:', urlErr);
          }
        }

        if (!base64Data) {
          try {
            const fetchRes = await fetch(image);
            const arrayBuffer = await fetchRes.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString('base64');
            const headerType = fetchRes.headers.get('content-type');
            if (headerType && headerType.includes('image')) {
              mimeType = headerType;
            }
          } catch (fetchErr) {
            console.warn('Failed to fetch remote image URL directly:', fetchErr);
          }
        }
      } else if (image.length > 50 && !image.includes(' ') && !image.includes('/') && !image.includes('\\')) {
        // Already a raw base64 string
        base64Data = image;
      }

      if (!base64Data || base64Data.length < 50) {
        return res.status(400).json({
          error: 'Could not extract valid base64 image data from request. Path: ' + image.substring(0, 50),
        });
      }

      // Initialize Google Gen AI client with required telemetry header
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are an authoritative Senior Plant Pathologist and Computer Vision Specialist specializing in cereal crops (Zea mays / Maize / Corn).
Your mission is to perform high-precision disease identification (WHAT) and 2D spatial lesion/rot localization (WHERE) on the provided maize plant image across all plant parts: leaf blades, stalks/stems, nodes, internal pith, ears/cobs, and whole plant canopy.

DIAGNOSTIC KEYS & ORGAN DIFFERENTIATION:

STEP 1: PLANT ORGAN IDENTIFICATION
Examine what part of the maize plant is shown in the image:
- "stalk" / "stem": Lower stalk, stem internodes, crown base, or sliced/split open stalk revealing internal pith.
- "leaf": Foliage, lamina, midrib, upper or lower leaf surface.
- "ear_cob": Corn cob, kernels, silks, ear husk.
- "whole_plant": Standing crop canopy in field.

STEP 2: PATHOGNOMONIC DISEASE CLASSIFICATION

1. "stalk_rot" (Maize Stalk Rot / Gibberella / Fusarium / Charcoal Rot / Pythium / Erwinia Bacterial Stalk Rot):
   - TARGET PLANT ORGAN: Maize Stalk / Stem / Lower Internodes / Crown / Split Internal Pith.
   - KEY VISUAL SIGNS:
     * Lower stalk internodes discolored (dark brown, olive, purplish, straw-bleached, or water-soaked).
     * Internal pith disintegration: when the stalk is cut or split lengthwise, the pith is shredded, hollowed out, or spongy, with characteristic salmon-pink, reddish, purplish, or dirty dark brown fungal staining (Fusarium verticillioides / Gibberella zeae).
     * Crushed, flattened, or softened lower stem nodes that collapse easily under thumb pressure.
     * In Charcoal Rot (Macrophomina phaseolina): shredded internal vascular fibers densely peppered with tiny grayish-black microsclerotia.
     * In Bacterial Stalk Rot (Erwinia chrysanthemi): slimy, foul-smelling, dark brown water-soaked soft rot of lower stalk internodes.
     * Whole plant premature lodging or sudden wilting while foliage turns dull grayish-green.
   - CRITICAL NEGATIVE & EXCLUSION RULE:
     * If the image depicts a maize STALK, STEM, LOWER NODE, or SPLIT PITH with rot, discoloration, or decay, classify strictly as "stalk_rot"!
     * NEVER confuse stalk rot with "common_rust"! Common rust occurs strictly as tiny raised powdery spore pustules on leaf blades. Common rust NEVER infects or decays stalk pith, and NEVER causes stem lodging or internal stalk shredding!

2. "downy_mildew" (Sorghum / Crazy Top / Brown Stripe Downy Mildew - Peronosclerospora sorghi, Peronosclerospora maydis, or Sclerophthora rayssiae):
   - KEY VISUAL SIGNS:
     * Prominent longitudinal chlorotic (vibrant yellow, pale yellow, or bleached white/cream) continuous bands or stripes running parallel along the leaf veins and midrib from the leaf base upward.
     * Interveinal chlorosis, leaf bleaching, narrow erect or shredded leaf blades.
     * Under humid conditions: fine velvety, whitish or grayish downy fungal fuzz (conidia/conidiophores) on the underside of the yellow stripes.
     * With progression: the chlorotic stripes may develop reddish-brown or necrotic streaks.
   - CRITICAL DIFFERENTIAL RULE: If you observe continuous, elongated yellow/chlorotic stripes or broad pale bands running parallel to the leaf veins, classify as "downy_mildew". NEVER confuse long yellow/chlorotic leaf striping with Gray Leaf Spot!

3. "gray_leaf_spot" (Gray Leaf Spot - Cercospora zeae-maydis):
   - KEY VISUAL SIGNS:
     * Strictly SMALL, DISCRETE, RECTANGULAR BLOCKY lesions (1.5–6 cm long, 2–4 mm wide).
     * Lesions have distinct, blunt, sharp 90-degree right-angle ends because fungal growth is strictly delimited between parallel secondary veins.
     * Color: Tan, buff, or grayish necrotic centers with faint narrow yellow halos.
   - CRITICAL NEGATIVE CONSTRAINT: Gray Leaf Spot NEVER produces continuous, leaf-length longitudinal yellow stripes or systemic chlorotic bands. If the yellowing runs along the length of the leaf as stripes, it is NOT Gray Leaf Spot.

4. "blight" (Northern Corn Leaf Blight - Exserohilum turcicum):
   - KEY VISUAL SIGNS:
     * Large, elongated elliptical, cigar-shaped or boat-shaped necrotic lesions (2.5–15 cm long, 1–3 cm wide).
     * Lesions have distinct tapered/pointed ends and cross leaf veins freely.
     * Color: Grayish-green initially, turning tan or light brown.

5. "common_rust" (Common Rust - Puccinia sorghi):
   - TARGET ORGAN: Strictly LEAF BLADES (foliage).
   - KEY VISUAL SIGNS:
     * Small, circular to elongate, elevated powdery cinnamon-brown to reddish-brown pustules (uredinia) that erupt through the leaf epidermis on both upper and lower surfaces.
     * Surrounded by small chlorotic halos on green leaf tissue.
   - NEGATIVE CONSTRAINT: Common rust NEVER occurs inside stems, stalks, or internal pith!

6. "leaf_spot" (Southern Corn Leaf Spot - Bipolaris maydis / Cochliobolus heterostrophus):
   - KEY VISUAL SIGNS:
     * Small, oval to circular lesions (0.5–2 cm long) with light brown/tan centers and darker reddish-brown margins on leaves.

7. "smut" (Common Corn Smut - Ustilago maydis):
   - TARGET ORGANS: Ears, tassels, nodes, or leaves.
   - KEY VISUAL SIGNS:
     * Prominent swollen, fleshy, silvery-white enclosed galls or tumors.
     * Galls enlarge and rupture to discharge powdery black sooty teliospores.

8. "ear_rot" (Maize Ear & Kernel Rot - Fusarium verticillioides / Gibberella zeae / Aspergillus):
   - TARGET ORGAN: Ears and cobs.
   - KEY VISUAL SIGNS:
     * White, pink, or reddish mold growing over and between kernels on the cob; starburst streaks on kernels; rotten, moldy cobs.

9. "healthy" (Healthy Maize Plant / Leaf / Stalk):
   - KEY VISUAL SIGNS:
     * Uniform vibrant green firm tissue without decay, discolored pith, pustules, or necrotic lesions.

2. WHERE (2D Spatial Lesion / Rot Localization):
   Identify and locate the diseased lesion regions, decayed stalk pith zones, or chlorotic stripes.
   For each region:
   - bbox: [ymin, xmin, ymax, xmax] normalized coordinates from 0.0 to 1.0.
   - centroid: [x, y] normalized coordinates representing center of region.
   - shapeType: 'stem_decay' | 'pith_discoloration' | 'rust_patch' | 'elongated' | 'circular' | 'irregular'.
   - locationDescEn: Precise anatomical location (e.g., "Lower stalk internode with pith disintegration", "Mid-stalk rot zone", "Longitudinal chlorotic stripe along midrib", "Central leaf blade margin").
   - locationDescTa: Precise location in Tamil (e.g., "தண்டின் கீழ்ப் பகுதி உள் அழுகல்", "இலையின் நரம்புகளை ஒட்டிய நீளமான மஞ்சள் வரி").
   - areaPercentage: Estimated percentage of visible organ surface affected (e.g. 15.5).
   - confidence: Confidence score between 85 and 99.

If the plant part is healthy:
   - regions array MUST be empty [].
   - affectedAreaPercentage MUST be 0.
   - severity MUST be "healthy".

Provide actionable, scientifically accurate organic and chemical fungicide/fertilizer prescriptions with exact commercial concentrations and application methods (e.g. root collar soil drenching for stalk rot, foliar spraying for blights) in both English and Tamil.`;

      let prompt = `Analyze this maize crop image thoroughly as an expert agricultural pathologist.
1. Determine the plant part shown: Stalk/Stem (including split open pith), Leaf blade, Ear/Cob, or Whole plant canopy.
2. If the image depicts a maize stalk, stem, lower node, or split internal pith with brown/pink/salmon discoloration or decay, classify strictly as "stalk_rot". DO NOT confuse stalk rot or decayed pith with "common_rust", which occurs strictly as powdery pustules on leaf blades.
3. Perform differential diagnosis across all classes: "stalk_rot", "common_rust", "downy_mildew", "gray_leaf_spot", "blight", "leaf_spot", "smut", "ear_rot", or "healthy".
4. Locate the diseased areas, lesions, or rot zones with normalized bounding boxes [ymin, xmin, ymax, xmax] and centroids [x, y], and provide comprehensive bilingual management recommendations.`;

      if (suspectedDisease) {
        prompt += ` User note: Suspected condition is "${suspectedDisease}". Verify whether symptoms match this or another condition.`;
      }

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          diseaseId: {
            type: Type.STRING,
            description:
              'One of: healthy, stalk_rot, common_rust, blight, gray_leaf_spot, downy_mildew, leaf_spot, smut, ear_rot',
          },
          diseaseNameEn: {
            type: Type.STRING,
            description: 'Official disease name in English',
          },
          diseaseNameTa: {
            type: Type.STRING,
            description: 'Official disease name in Tamil',
          },
          affectedOrgan: {
            type: Type.STRING,
            description: 'Primary plant organ affected: "stalk" | "leaf" | "ear_cob" | "whole_plant"',
          },
          confidence: {
            type: Type.INTEGER,
            description: 'Diagnostic confidence percentage (e.g. 96)',
          },
          severity: {
            type: Type.STRING,
            description: 'One of: healthy, mild, moderate, severe',
          },
          affectedAreaPercentage: {
            type: Type.NUMBER,
            description: 'Estimated total percentage of surface affected by lesions or rot (e.g. 12.5)',
          },
          explanationEn: {
            type: Type.STRING,
            description: 'Clear explanation of symptoms, pathogen biology, affected organ, and progression in English',
          },
          explanationTa: {
            type: Type.STRING,
            description: 'Clear explanation of symptoms, pathogen biology, affected organ, and progression in Tamil',
          },
          organicTreatmentEn: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Actionable organic/biological management steps in English',
          },
          organicTreatmentTa: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Actionable organic/biological management steps in Tamil',
          },
          chemicalTreatmentEn: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Targeted chemical treatments/fungicides with exact commercial dosages in English',
          },
          chemicalTreatmentTa: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Targeted chemical treatments/fungicides with exact commercial dosages in Tamil',
          },
          preventiveTipsEn: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Preventive farm practices and crop management in English',
          },
          preventiveTipsTa: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Preventive farm practices and crop management in Tamil',
          },
          regions: {
            type: Type.ARRAY,
            description: 'List of individual lesion spots, decayed zones, or pustules detected across the tissue',
            items: {
              type: Type.OBJECT,
              properties: {
                spotNumber: { type: Type.INTEGER },
                shapeType: {
                  type: Type.STRING,
                  description: 'One of: stem_decay, pith_discoloration, rust_patch, elongated, circular, irregular',
                },
                confidence: { type: Type.INTEGER },
                bbox: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                  description: '[ymin, xmin, ymax, xmax] normalized between 0.0 and 1.0',
                },
                centroid: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                  description: '[x, y] normalized center between 0.0 and 1.0',
                },
                locationDescEn: { type: Type.STRING },
                locationDescTa: { type: Type.STRING },
                areaPercentage: { type: Type.NUMBER },
              },
              required: ['spotNumber', 'shapeType', 'confidence', 'bbox', 'centroid', 'locationDescEn', 'locationDescTa', 'areaPercentage'],
            },
          },
        },
        required: [
          'diseaseId',
          'diseaseNameEn',
          'diseaseNameTa',
          'confidence',
          'severity',
          'affectedAreaPercentage',
          'explanationEn',
          'explanationTa',
          'organicTreatmentEn',
          'organicTreatmentTa',
          'chemicalTreatmentEn',
          'chemicalTreatmentTa',
          'preventiveTipsEn',
          'preventiveTipsTa',
          'regions',
        ],
      };

      let response: any = null;
      let usedModel = 'gemini-3.8-flash';

      const generateWithModel = async (modelName: string) => {
        return await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema,
          },
        });
      };

      try {
        response = await generateWithModel('gemini-3.8-flash');
      } catch (primaryErr: any) {
        console.warn('gemini-3.8-flash primary attempt warning:', primaryErr?.message);
        // Retry once after a brief delay if transient (e.g. 503 spike)
        try {
          await new Promise((r) => setTimeout(r, 600));
          response = await generateWithModel('gemini-3.8-flash');
        } catch (retryErr: any) {
          console.warn('gemini-3.8-flash retry failed, failing over to gemini-3.1-flash-lite:', retryErr?.message);
          usedModel = 'gemini-3.1-flash-lite';
          response = await generateWithModel('gemini-3.1-flash-lite');
        }
      }

      const responseText = response?.text || '{}';
      const parsedData = JSON.parse(responseText);

      // Intelligent symptom cross-validation & diagnostic key verification
      if (parsedData && parsedData.diseaseId) {
        const textToScan = `${parsedData.diseaseNameEn || ''} ${parsedData.explanationEn || ''} ${parsedData.diseaseNameTa || ''} ${parsedData.affectedOrgan || ''}`.toLowerCase();

        const hasStalkRotTerms =
          textToScan.includes('stalk') ||
          textToScan.includes('stem') ||
          textToScan.includes('internode') ||
          textToScan.includes('pith') ||
          textToScan.includes('lodging') ||
          textToScan.includes('gibberella') ||
          textToScan.includes('fusarium') ||
          textToScan.includes('charcoal rot') ||
          textToScan.includes('macrophomina') ||
          textToScan.includes('erwinia') ||
          textToScan.includes('தண்டு') ||
          textToScan.includes('கணு') ||
          textToScan.includes('தண்டு அழுகல்');

        // Prevent misclassification of stalk rot as common rust, leaf spot, or blight
        if ((parsedData.diseaseId === 'common_rust' || parsedData.diseaseId === 'leaf_spot' || parsedData.diseaseId === 'blight') && hasStalkRotTerms) {
          console.log(`Reclassifying ${parsedData.diseaseId} -> stalk_rot based on stalk/stem pathology analysis`);
          parsedData.diseaseId = 'stalk_rot';
          parsedData.diseaseNameEn = 'Maize Stalk Rot (Gibberella / Fusarium)';
          parsedData.diseaseNameTa = 'மக்காச்சோள தண்டு அழுகல் நோய்';
          parsedData.affectedOrgan = 'stalk';
        }

        const hasDownyTerms =
          textToScan.includes('downy mildew') ||
          textToScan.includes('peronosclerospora') ||
          textToScan.includes('sclerophthora') ||
          textToScan.includes('chlorotic strip') ||
          textToScan.includes('yellow strip') ||
          textToScan.includes('chlorotic band') ||
          textToScan.includes('interveinal chlorosis') ||
          textToScan.includes('crazy top') ||
          textToScan.includes('அடிச்சாம்பல்');

        const hasGLSTerms =
          textToScan.includes('gray leaf spot') ||
          textToScan.includes('cercospora') ||
          textToScan.includes('rectangular block') ||
          textToScan.includes('சாம்பல் நிற இலைப்புள்ளி');

        // If the model diagnosed GLS or Blight, but the detailed pathology explanation explicitly describes chlorotic yellow striping/downy mildew
        if ((parsedData.diseaseId === 'gray_leaf_spot' || parsedData.diseaseId === 'blight') && hasDownyTerms && !hasGLSTerms && !hasStalkRotTerms) {
          console.log(`Reclassifying ${parsedData.diseaseId} -> downy_mildew based on pathognomonic symptom analysis`);
          parsedData.diseaseId = 'downy_mildew';
          parsedData.diseaseNameEn = 'Maize Downy Mildew / Crazy Top';
          parsedData.diseaseNameTa = 'மக்காச்சோள அடிச்சாம்பல் நோய்';
        }
      }

      return res.json({
        success: true,
        source: usedModel,
        data: parsedData,
      });
    } catch (err: unknown) {
      console.error('AI Vision analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      return res.status(500).json({
        error: 'AI Vision inference failed: ' + errorMessage,
      });
    }
  };

  app.post('/api/vision/analyze', handleAnalyze);
  app.post('/api/gemini/analyze', handleAnalyze);

  // Static files in public directory (sample images, models, icons)
  app.use(
    express.static(path.join(process.cwd(), 'public'), {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      },
    })
  );

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Ensure sample images exist in public/samples
  const samplesDir = path.join(process.cwd(), 'public', 'samples');
  if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir, { recursive: true });
  }

  const sampleUrls: Record<string, string> = {
    'sample_common_rust.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Rust_on_corn.jpg',
    'sample_blight.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Northern_corn_leaf_blight.JPG',
    'sample_gls.png': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Gray_leaf_spot_Cercospora_zeae-maydis_5465607.png',
    'sample_healthy.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Fresh_corn_leaf.jpg',
    'sample_downy.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/K-deficient_maize_on_Cedara_2_2003-01-13.jpg',
    'sample_full_plant.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Maize_plant_stands.jpg',
  };

  for (const [filename, url] of Object.entries(sampleUrls)) {
    const targetPath = path.join(samplesDir, filename);
    if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size < 1000) {
      fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        .then(async (res) => {
          if (res.ok) {
            const buffer = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(targetPath, buffer);
            console.log(`Bootstrapped sample asset ${filename} (${buffer.length} bytes).`);
          }
        })
        .catch((err) => {
          console.warn(`Could not bootstrap sample asset ${filename}:`, err);
        });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

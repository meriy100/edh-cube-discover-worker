import { GenerativeModel } from '@google-cloud/vertexai';
import { generationConfig, MODEL_NAME, vertexAI } from './vertex';
import { adminDb } from './firebase';

interface Args {
  combos: {
    id: string
    description: string
    notablePrerequisites: string
    nameDictionary: { en: string, ja: string }[]
  }[]
}

export const translateCombo = async ({ combos }: Args) => {
  for (const { id, description, notablePrerequisites, nameDictionary } of combos) {
    try {
      console.log('Translating combo:', id);
      const descriptionJa = await translateComboDescription(description, nameDictionary);
      const notablePrerequisitesJa = await translateComboDescription(notablePrerequisites, nameDictionary);

      await adminDb().collection('combos').doc(id).update(
        { descriptionJa, notablePrerequisitesJa },
      );
    } catch (error) {
      console.error('Error translating combo:', id, error);
    }
  }
};


export const translateComboDescription = async (text: string, nameDictionary: { en: string, ja: string }[]): Promise<string>  =>{
  if (!text) {
    return '';
  }
  const dictionaryString = nameDictionary
    .map(pair => `- "${pair.en}" -> "${pair.ja}"`)
    .join('\n');

  const systemInstruction = `
You are an expert translator specializing in Magic: The Gathering (MTG).
Translate the provided combo descriptions into Japanese, strictly adhering to the following rules:

1. **Card Name Replacement (Dictionary-based)**:
   Check the dictionary below. If an English card name from the list appears in the text, replace it with the corresponding Japanese card name provided.
   If a card name or term is not in the list, translate it naturally based on MTG's official terminology context.
   <dictionary>
   ${dictionaryString}
   </dictionary>

2. **Preserve Symbols & No Decorations**:
   - Keep all symbols enclosed in curly braces (e.g., {T}, {C}, {0}, {Q}) exactly as they are. Do not translate or modify them.
   - **IMPORTANT: Do not enclose card names in brackets like " " or 『 』.** Use the Japanese card names from the dictionary as-is within the sentence.

3. **Output Format**:
   Output ONLY the translated steps. Do not include any introductory remarks, concluding explanations, or additional decorations.
`;

  return translateVertex(text, systemInstruction);
};


export const translateComboPrerequisites = async (text: string, nameDictionary: { en: string, ja: string }[]) => {
  if (!text) {
    return '';
  }
  const dictionaryString = nameDictionary
    .map(pair => `- "${pair.en}" -> "${pair.ja}"`)
    .join('\n');

  const systemInstruction = `
You are an expert translator specializing in Magic: The Gathering (MTG).
Translate the provided combo "Prerequisites" or "Requirements" into Japanese, strictly adhering to the following rules:

1. **Card Name Replacement (Dictionary-based)**:
   Check the dictionary below. If an English card name from the list appears in the text, replace it with the corresponding Japanese card name provided.
   If a card name or term is not in the list, translate it naturally using MTG's official terminology (e.g., "battlefield" as "戦場", "graveyard" as "墓地").
   <dictionary>
   ${dictionaryString}
   </dictionary>

2. **Preserve Symbols & No Decorations**:
   - Keep all symbols enclosed in curly braces (e.g., {T}, {C}, {0}, {Q}) exactly as they are. Do not translate or modify them.
   - **IMPORTANT: Do not enclose card names in brackets like " " or 『 』.** Use the Japanese card names from the dictionary as-is within the text.

3. **Output Format**:
   Output ONLY the translated prerequisites. Do not include any introductory remarks, concluding explanations, or additional decorations.
`;

  return translateVertex(text, systemInstruction);
};


const translateVertex = async (text: string, systemInstruction: string) => {
  const model: GenerativeModel = vertexAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemInstruction }],
    },
    generationConfig,
  });

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text }] }],
    });

    const translatedText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translatedText) {
      throw new Error(`No translation generated. results: ${JSON.stringify(result, null, 2)}`);
    }

    return translatedText;
  } catch (error) {
    console.error('Vertex AI API Error:', error);
    throw error;
  }
};

import { z } from 'zod';

interface SpellbookCardParam {
  card: string;
  quantity: number;
}

export const poolXComboSchema = z.object({
  id: z.string(),
  cardNames: z.array(z.string())
});


const featureProducedByVariantSchema  =z.object({
  id: z.number(),
  name: z.string(),
});

const comboSchema = z.object({
  id: z.string(),
  uses: z.array(
    z.object({
      card: z.object({ id: z.number(), name: z.string() }),
      quantity: z.number(),
      zoneLocations: z.array(z.string()),
    })),
  manaNeeded: z.string(),
  identity: z.string(),
  produces: z.array(z.object({ feature: featureProducedByVariantSchema })),
  easyPrerequisites: z.string(),
  notablePrerequisites: z.string(),
  description: z.string(),
  popularity: z.number()
});

export type Combo = z.infer<typeof comboSchema>;

const spellbookResponseSchema = z.object(
  {
    count: z.number(),
    previous: z.string().nullable(),
    next: z.string().nullable(),
    results: z.object({
      included: z.array(comboSchema),
    })
  }
);

export async function* findAllCombosGenerator(
  main: SpellbookCardParam[],
  limit = 20,
 ):  AsyncGenerator<Combo, void, unknown> {
  let nextUrl: string | null = `https://backend.commanderspellbook.com/find-my-combos?limit=${limit}&q=colors%3C4`;

  const body = {
    main: main,
    commanders: [],
  };

  while (nextUrl) {
    console.log('Fetching next page:', nextUrl);
    const response = await fetch(nextUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    const data = spellbookResponseSchema.parse(json);

    for (const combo of data.results.included) {
      yield combo;
    }

    nextUrl = data.next;
  }
}

// export const findMyCombos = async ({
//   main,
//   limit = 20,
// }: FindMyCombosOptions)  => {
//
//   try {
//     const combos = [];
//     for await (const combo of findAllCombosGenerator(main, limit)) {
//       combos.push(combo);
//       console.log(JSON.stringify(combo));
//     }
//
//     return combos;
//   } catch (error) {
//     console.error('Error fetching combos:', error);
//     throw error;
//   }
// };

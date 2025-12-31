import { fetchScryfall  } from './scryfall';

export const attachScryfall= async ({ names }: { names: string[] }): Promise<void> => {

  for (const name of names) {
    const data = await fetchScryfall(name);
    console.log('Scryfall', name, data);
  }
};

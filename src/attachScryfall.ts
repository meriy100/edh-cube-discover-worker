import { fetchScryfall  } from './scryfall';
import { adminDb } from './firebase';

interface Args {
  cards: {
    id: string
    name: string
  }[]
}

export const attachScryfall= async (args: Args): Promise<void> => {

  for (const card of args.cards) {
    const data = await fetchScryfall(card.name);
    console.log('Scryfall', card.name, data);
    await adminDb().collection('cards').doc(card.id).update({
      scryfall: data.en,
      scryfallJa: data.ja
    });
  }
};

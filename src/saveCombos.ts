import { adminDb } from './firebase';
import { findAllCombosGenerator } from './spellbook';

interface Args {
  poolId: string
  cards: {
    id: string
    name: string
  }[]
}

export const saveCombos= async (args: Args): Promise<void> => {
  for await (const combo of findAllCombosGenerator(args.cards.map(c => ({ card: c.name, quantity: 1 })), 1000)) {
    const cardNames = combo.uses.map(use => use.card.name);

    await adminDb().collection('combos').doc(combo.id).set({ ...combo, cardNames }, { merge: true });
    await adminDb().collection('pools').doc(args.poolId).collection('poolXCombos').doc(combo.id).set({
      id: combo.id,
      cardNames,
    }, { merge: true });

  }
  console.log('Completed combos!');
};

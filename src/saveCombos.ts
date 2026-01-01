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
    await adminDb().collection('combos').doc(combo.id).set(combo, { merge: true });
    await adminDb().collection('pools').doc(args.poolId).collection('poolXCombos').doc(combo.id).set({
      id: combo.id,
      cardNames: combo.uses.map(use => use.card.name),
    }, { merge: true });

  }
  console.log('Completed combos!');
};

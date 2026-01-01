import { findAllCombosGenerator } from '../spellbook';
import { sampleList1 } from './sampleList';
import { adminDb } from '../firebase';

const main = async () => {
  for await (const combo of findAllCombosGenerator(sampleList1, 1000)) {

    console.log(JSON.stringify(combo));

    await adminDb().collection('combos').doc(combo.id).set(combo, { merge: true });
    await adminDb().collection('pools').doc('01KDVZ18ZZXTF5XW6DMK1GZ75Z').collection('poolXCombos').doc(combo.id).set({
      id: combo.id,
      cardNames: combo.uses.map(use => use.card.name),
    }, { merge: true });

  }
  console.log('completed');
};

main().catch(console.error);

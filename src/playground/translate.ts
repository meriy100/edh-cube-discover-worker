import { translateComboDescription, translateComboPrerequisites } from '../translateCombo';

const main = async () => {
  const  res = await translateComboDescription(`
Activate Mishra's Bauble by tapping and sacrificing it, looking at the top card of a player's library and drawing a card at the beginning of the next turn's upkeep.
Activate Ashnod's Altar by sacrificing Myr Retriever, adding {C}{C}.
Myr Retriever triggers, returning Mishra's Bauble from your graveyard to your hand.
Cast Mishra's Bauble by paying {0}.
Teshar triggers, returning Myr Retriever from your graveyard to the battlefield.
Repeat.
  `, [
    { en: 'Mishra\'s Bauble', ja: 'ミシュラのガラクタ' },
    { en: 'Ashnod\'s Altar', ja: 'アシュノッドの供犠台' },
    { en: 'Myr Retriever', ja: 'マイヤの回収者' },
    { en: 'Teshar, Ancestor\'s Apostle', ja: '祖神の使徒、テシャール' }
  ]);
  console.log(res);

  const res2 = await translateComboPrerequisites('You control a nontoken artifact with mana value one or less that can be cast using only colorless mana.', []);
  console.log(res2);
};

main().catch(console.error);

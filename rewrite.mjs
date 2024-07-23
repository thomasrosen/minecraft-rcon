import OpenAI from "openai";

export async function rewrite({
  previousStatus,
  currentStatus,
}) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


  const system_prompt_0 = `
  Rewrite the new status. Focus on informing about new players and players leaving. The change or players is the important information. Be clear if no one is playing anymore.
  
  Keep it short. But make the sentence longer, the more players there are!
  Use all exact player names but do NOT just list them. Mark ALL playernames in **bold**.
  The MORE players the craziers beautiful and unhighed and longer the sentence must be. KEEP it EXTREMLY BRIEF SHORT for only ONE player.
  
  Make it slietly unhinged. Use more unhinged words, the more more players are online.
  Word inspo: minecraft, reals, world, chaos, wildcard, wonder, monsters, sky-high, magic, stone, adventure, falling, death, lunacy, maniac, insane, punk, reality, void, bridge, tunnel, party, catching a train, taking a boat, remains, spark, lone, collective, no one, gone, offline, beautiful, in awe, whimsical, tumult, dazzling, celestial, uplifting, talking to villagers, picking flowers, …
  
  The first word MUST BE the player name that DIFFERS from the previous status. Make it **bold**.
  
  Example:
  previous: p1, p2, p3, p4
  current: p1, p3, p4.
  sentence structure: p2 [....] p1 but words what words [....] words p3 words [....] p4!
  or sentence structure: p2 [....] p1 [....] p3 [....] p4!
  
  Keep it short. No emojis.
  `

  const word_inspo = {
    unhinged: '(unhinged word style) minecraft, reals, world, chaos, wildcard, wonder, monsters, sky-high, magic, stone, adventure, falling, death, lunacy, maniac, insane, punk, reality, void, bridge, tunnel, party, catching a train, taking a boat, remains, spark, lone, collective, no one, gone, offline, beautiful, in awe, whimsical, tumult, dazzling, celestial, uplifting, talking to villagers, picking flowers, …',
    edgar: '(edgar allen poe word style) minecraft, reals, world, chaos, wildcard, wonder, monsters, sky-high, magic, stone, adventure, falling, death, lunacy, maniac, insane, punk, reality, void, bridge, tunnel, party, catching a train, taking a boat, remains, spark, lone, collective, no one, gone, offline, beautiful, in awe, whimsical, tumult, dazzling, celestial, uplifting, talking to villagers, picking flowers, gothic, macabre, eerie, spectral, haunted, crypt, darkness, abyss, nightmare, torment, raven, shadow, ghostly, phantasm, lament, melancholy, cursed, desolation, mystery, doom, twilight, enigma, whisper, mournful, forsaken, dread, sinister, spectral, chasm, delirium, morbid, necropolis, sepulcher, ghastly, revenant, twilight, ominous, eldritch, despair, shrouded, haunted echo, forlorn, nightfall, chilling, uncanny, haunted mirror, withered rose, phantom whisper, eternal night, exploring haunted mansions, unearthing buried secrets, navigating dark forests, encountering spectral apparitions, deciphering ancient runes, crafting potions of shadow, battling nightmarish creatures, delving into cursed caverns, building gothic cathedrals, mining for hidden relics, summoning eldritch entities, escaping labyrinthine tunnels, investigating mysterious disappearances, constructing tombs, writing cryptic journals, listening to ghostly whispers, surviving in a desolate wasteland, searching for lost souls, reading forbidden tomes, experiencing eerie visions, creating macabre artworks, fleeing from unseen horrors, wandering through abandoned ruins, lighting the path with lanterns, performing rituals at moonlit altars, whispering to the ravens, harvesting withered crops, mending broken bridges, seeking the truth in shadows, warding off creeping dread, … (in the style of Edgar Allan Poe)',
    german: 'minecraft, blumig, Mondstrahlen, kaleidoskopisch, sternenfunkeln, traumhaft, wirbelnd, phantastisch, funkelnd, magisch, schimmernd, poetisch, surreal, farbenfroh, verträumt, wolkig, nebulös, glitzernd, märchenhaft, geheimnisvoll, ätherisch, zauberhaft, sphärisch, flirrend, lichtdurchflutet, himmlisch, dämmernd, mystisch, funkelnd, galaktisch, verworren, zauberhaft, schwebend, blütenmeer, flimmernd, verzückt, flirrend, irisierend, mondbeschienen, verzaubert, tanzend, rauschend, schillernd, regenbogenhaft, verspielt, wolkig, sonnenstrahlen, himmlisch, neblig, magisch, traumwandlerisch, flüchtig, glühend, strahlend, glühwürmchen, sternschnuppe, dunstig, perlend, wundersam, bizarr, himmelwärts, leuchtend, glühend, phantasievoll, sanft, selig, …',
    garden: '(garden word style) minecraft, Blumen, pflegen, saftig, hacken, Tomaten, Erde, kompostieren, Pilze, wachsen, Rasen, gießen, Setzlinge, Gurken, Blütenblätter, ernten, Bäume, wachsen, Hacke, Gießkanne, Gemüse, blumig, schattig, düngen, Rosen, Jäten, Samen, robust, Bienen, fruchtbar, Lavendel, Tulpen, Birke, Kompost, mähen, klettern, Hacke, üppig, Sträucher, Gewächshaus, Harke, mähen, Beete, Minze, pflegen, Mohn, ernten, Kürbis, Garten, Sonnenblumen, …',
    potsdam: '(potsdam city word style) Sanssouci, palaces, Prussian, baroque, gardens, Brandenburg, Havel River, Glienicke Bridge, Dutch Quarter, Babelsberg, film studios, historic, architecture, parks, Neues Palais, Cecilienhof, University of Potsdam, lakes, museums, royal, castles, Orangery Palace, Frederick the Great, cultural, Potsdam Conference, Brandenburg Gate (Potsdam), New Garden, Einstein Tower, UNESCO World Heritage, Neues Palais, Schloss Sanssouci, Marble Palace, historical, scenic, Potsdam University, scenic views, Babelsberg Castle, film park, cultural events, Russian Colony Alexandrowka, Belvedere on the Pfingstberg, City Palace, Old Market Square, Holländisches Viertel, biosphere, Pfaueninsel, tranquility'
  }
  const random_word_inspo = Object.values(word_inspo)[Math.floor(Math.random() * word_inspo.length)]

  const system_prompt = `
**Guidelines:**

1. **Length and Complexity:**
  - **1 player:** Extremely brief. Example: **p1** verb adjective.
  - **2-5 players:** Short sentences with some words. Example: **p2** [....] **p1** and **p3** in [....].
  - **6-10 players:** Longer, more detailed sentences with more whimsical words. Example: **p4** dives into the adventure with **p1**, **p2**, and **p3**, navigating [....].
  - **11+ players:** Complex, elaborate sentences filled with beautiful and chaotic descriptions. Example: **p5** [....] into [....] **p1**, **p2**, **p3**, and **p4** in [....].
  THESE ARE ONLY EXAMPLE. BE CREATIVE! YOU CAN CHANGE ANYTHING!

2. **Formatting:**
  - Use all exact player names but do NOT just list them.
  - Mark ALL player names in **bold**.

3. **Style:**
  - The MORE players there are, the crazier, more beautiful, unhinged, and longer the sentence must be.
  - KEEP it EXTREMELY BRIEF for only ONE player.
  - Use unhinged words, increasingly so as more players are online.
  - The first word MUST BE the player name that DIFFERS from the previous status. Make it **bold**.
  - EVERYTHING MUST BE IN ENGLISH.

4. **Word inspo:**
THE SENTENCE MUST BE IN STYLE OF THESE WORDS.
${random_word_inspo}
TRANSLATE INTO ENGLISH.

5. **Structure:**
  - Mention players joining or leaving.
  - If no one is playing anymore, be clear about it.
  - Prepend everything with the player count in this format: (n/N)
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": system_prompt
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `previous status: ${previousStatus}\ncurrent status: ${currentStatus}`
          }
        ]
      }
    ],
    temperature: 1.2,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content
}

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

  const system_prompt = `
**Guidelines:**

1. **Length and Complexity:**
  - **1 player:** Extremely brief. Example: **p1** is online. / **p1** verb noun.
  - **2-5 players:** Short sentences with some unhinged words. Example: **p2** [....] **p1** and **p3** in [....].
  - **6-10 players:** Longer, more detailed sentences with more unhinged and whimsical words. Example: **p4** dives into the adventure with **p1**, **p2**, and **p3**, navigating [....].
  - **11+ players:** Complex, elaborate sentences filled with unhinged, beautiful, and chaotic descriptions. Example: **p5** [....] into [....] **p1**, **p2**, **p3**, and **p4** in [....].
  THESE ARE ONLY EXAMPLE. BE CREATIVE! YOU CAN CHANGE ANYTHING!

2. **Formatting:**
  - Use all exact player names but do NOT just list them.
  - Mark ALL player names in **bold**.

3. **Style:**
  - The MORE players there are, the crazier, more beautiful, unhinged, and longer the sentence must be.
  - KEEP it EXTREMELY BRIEF for only ONE player.
  - Use unhinged words, increasingly so as more players are online.
  - The first word MUST BE the player name that DIFFERS from the previous status. Make it **bold**.

4. **Word Inspiration:**
  - minecraft, reals, world, chaos, wildcard, wonder, monsters, sky-high, magic, stone, adventure, falling, death, lunacy, maniac, insane, punk, reality, void, bridge, tunnel, party, catching a train, taking a boat, remains, spark, lone, collective, no one, gone, offline, beautiful, in awe, whimsical, tumult, dazzling, celestial, uplifting, talking to villagers, picking flowers.

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

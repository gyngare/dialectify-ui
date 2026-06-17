import { NextRequest, NextResponse } from "next/server";

type DialectConfig = {
  name: string;
  region: string;
  notes: string;
  examples_to_dialect: Array<{ indonesian: string; dialect: string }>;
  examples_to_indonesian: Array<{ dialect: string; indonesian: string }>;
};

const DIALECTS: Record<string, DialectConfig> = {
  manado: {
    name: "Manado Malay",
    region: "North Sulawesi",
    notes: `
Core vocabulary:
- "kita" = saya/aku (I/me) — NOT "we"
- "torang" = kita/kami (we/us)
- "ngana" = kamu (you singular)
- "dorang" = mereka (they)
- "jo" = lah (softening particle) e.g. "atur jo", "sini jo"
- "pe" = punya (possession) e.g. "dia pe rumah" = rumahnya
- "so" = sudah (already) e.g. "kita so makan" = saya sudah makan
- "mo" = mau (want to) e.g. "kita mo pi" = saya mau pergi
- "pi" = pergi (go)
- "tra" / "nda" = tidak / tidak ada e.g. "tra tau" = tidak tahu
- "deng" = dengan / dan (with/and)
- "ba" = emphatic marker e.g. "bagus ba" = bagus sekali
- "ada" = ada / sedang (there is / currently doing)
- "par" = untuk (for)
- "tara" = tidak bisa (cannot)
- "ngoni" = kalian (you plural)
- "mar" = tapi (but)
- "kalo" = kalau (if)
- "nintau" = tidak tahu (don't know)
- "paskali" = mungkin (maybe)
- "skali" = sekali / sangat (very)
    `,
    examples_to_dialect: [
      { indonesian: "Saya mau pergi ke pasar", dialect: "Kita mo pi pasar" },
      { indonesian: "Kamu mau makan apa?", dialect: "Ngana mo makan apa?" },
      { indonesian: "Saya tidak tahu", dialect: "Kita tra tau" },
      { indonesian: "Rumah saya di sana", dialect: "Kita pe rumah di sana" },
      { indonesian: "Kami sudah makan", dialect: "Torang so makan" },
      { indonesian: "Tapi saya tidak bisa", dialect: "Mar kita tra bisa" },
      { indonesian: "Bagus sekali!", dialect: "Bagus skali ba!" },
      { indonesian: "Atur saja bagaimana", dialect: "Atur jo mana-mana" },
      { indonesian: "Mungkin besok", dialect: "Paskali besok" },
      { indonesian: "Dia sedang tidur", dialect: "Dia ada tidur" },
    ],
    examples_to_indonesian: [
      { dialect: "Kita mo pi pasar jo", indonesian: "Saya mau pergi ke pasar" },
      { dialect: "Ngana so makan?", indonesian: "Kamu sudah makan?" },
      { dialect: "Torang tra tau", indonesian: "Kami tidak tahu" },
      {
        dialect: "Dia pe rumah bagus skali",
        indonesian: "Rumahnya bagus sekali",
      },
      {
        dialect: "Mar kita nda ada uang",
        indonesian: "Tapi saya tidak punya uang",
      },
    ],
  },
  javanese: {
    name: "Javanese (Ngoko)",
    region: "Central & East Java",
    notes: `
Core vocabulary (Ngoko - informal):
- "aku" = saya/aku (I)
- "kowe" = kamu (you)
- "dheweke" = dia (he/she)
- "awake dhewe" = kita (we)
- "ora" = tidak (not)
- "opo" = apa (what)
- "ngendi" = di mana (where)
- "piye" = bagaimana (how)
- "kapan" = kapan (when)
- "sopo" = siapa (who)
- "wis" = sudah (already)
- "arep" = mau/akan (want to/will)
- "durung" = belum (not yet)
- "isih" = masih (still)
- "mangan" = makan (eat)
- "ngombe" = minum (drink)
- "turu" = tidur (sleep)
- "mlaku" = jalan (walk)
- "omah" = rumah (house)
- "apik" = bagus (good)
- "elek" = jelek (bad)
- "gedhe" = besar (big)
- "cilik" = kecil (small)
- "akeh" = banyak (many)
- "sithik" = sedikit (few)
- "teko" = datang (come)
- "lungo" = pergi (go)
    `,
    examples_to_dialect: [
      {
        indonesian: "Saya mau pergi ke pasar",
        dialect: "Aku arep lungo pasar",
      },
      { indonesian: "Kamu sudah makan?", dialect: "Kowe wis mangan?" },
      { indonesian: "Saya tidak tahu", dialect: "Aku ora ngerti" },
      { indonesian: "Rumah saya besar", dialect: "Omahku gedhe" },
      { indonesian: "Bagaimana kabarmu?", dialect: "Piye kabarmu?" },
      { indonesian: "Saya belum tidur", dialect: "Aku durung turu" },
      { indonesian: "Dia masih di sini", dialect: "Dheweke isih neng kene" },
    ],
    examples_to_indonesian: [
      { dialect: "Aku arep mangan sik", indonesian: "Saya mau makan dulu" },
      {
        dialect: "Kowe arep lungo ngendi?",
        indonesian: "Kamu mau pergi ke mana?",
      },
      { dialect: "Omahku adoh", indonesian: "Rumah saya jauh" },
    ],
  },
  sundanese: {
    name: "Sundanese",
    region: "West Java",
    notes: `
Core vocabulary (informal/casual):
- "abdi" = saya (formal I)
- "aing" = aku (very informal I)
- "maneh" = kamu (informal you)
- "anjeun" = Anda (formal you)
- "manehna" = dia (he/she)
- "urang" = saya/kita (I/we)
- "teu" = tidak (not)
- "naon" = apa (what)
- "mana" = di mana (where)
- "kumaha" = bagaimana (how)
- "iraha" = kapan (when)
- "saha" = siapa (who)
- "geus" = sudah (already)
- "rek" = mau/akan (want to/will)
- "acan" = belum (not yet)
- "keneh" = masih (still)
- "dahar" = makan (eat)
- "nginum" = minum (drink)
- "sare" = tidur (sleep)
- "imah" = rumah (house)
- "alus" = bagus (good)
- "goreng" = jelek (bad)
- "gede" = besar (big)
- "leutik" = kecil (small)
- "loba" = banyak (many)
- "nuhun" = terima kasih (thank you)
- "punten" = permisi/maaf (excuse me)
- "sumuhun" = iya/betul (yes/correct)
    `,
    examples_to_dialect: [
      { indonesian: "Saya mau pergi ke pasar", dialect: "Abdi rek ka pasar" },
      { indonesian: "Kamu sudah makan?", dialect: "Maneh geus dahar?" },
      { indonesian: "Saya tidak tahu", dialect: "Abdi teu terang" },
      { indonesian: "Rumah saya besar", dialect: "Imah abdi gede" },
      { indonesian: "Bagaimana kabarmu?", dialect: "Kumaha damang?" },
      { indonesian: "Terima kasih", dialect: "Nuhun" },
      { indonesian: "Permisi", dialect: "Punten" },
    ],
    examples_to_indonesian: [
      { dialect: "Abdi rek dahar heula", indonesian: "Saya mau makan dulu" },
      { dialect: "Maneh rek ka mana?", indonesian: "Kamu mau ke mana?" },
      { dialect: "Kumaha damang?", indonesian: "Apa kabar?" },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { text, dialect, direction } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    if (!DIALECTS[dialect]) {
      return NextResponse.json({ error: "Invalid dialect." }, { status: 400 });
    }

    const d = DIALECTS[dialect];
    const isToDialect = direction === "to_dialect";
    const sourceLang = isToDialect ? "Bahasa Indonesia" : d.name;
    const targetLang = isToDialect ? d.name : "Bahasa Indonesia";

    // Build few-shot examples
    const examples = isToDialect
      ? d.examples_to_dialect
      : d.examples_to_indonesian;
    const exampleText = examples
      .map((ex) =>
        isToDialect
          ? `Indonesian: "${(ex as { indonesian: string; dialect: string }).indonesian}"\n${d.name}: "${(ex as { indonesian: string; dialect: string }).dialect}"`
          : `${d.name}: "${(ex as { dialect: string; indonesian: string }).dialect}"\nIndonesian: "${(ex as { dialect: string; indonesian: string }).indonesian}"`,
      )
      .join("\n\n");

    const prompt = `You are a native speaker of ${d.name} from ${d.region}, Indonesia. You translate naturally and casually, exactly how real people speak — not textbook translations.

VOCABULARY REFERENCE:
${d.notes}

EXAMPLES OF CORRECT TRANSLATIONS:
${exampleText}

Now translate this text from ${sourceLang} to ${targetLang}.
Rules:
- Output ONLY the translated text, nothing else
- No explanations, no notes, no alternatives
- Sound like a real native speaker, not a dictionary
- Keep the same casual or formal tone as the input

${sourceLang}: "${text.trim()}"
${targetLang}:`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are a native ${d.name} speaker and expert translator. You only output the translated text — never explanations, never alternatives, never notes. Just the translation.`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 512,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", JSON.stringify(data));
      throw new Error(data.error?.message || `Groq error: ${response.status}`);
    }

    let translation = data.choices?.[0]?.message?.content?.trim();

    if (!translation) {
      throw new Error("No translation returned");
    }

    // Strip any leading label the model might add e.g. "Manado Malay: " or "Indonesian: "
    translation = translation
      .replace(
        /^(Manado Malay|Javanese|Sundanese|Indonesian|Bahasa Indonesia)\s*:\s*/i,
        "",
      )
      .replace(/^["']|["']$/g, "") // strip surrounding quotes if any
      .trim();

    return NextResponse.json({
      translation,
      source_lang: sourceLang,
      target_lang: targetLang,
      dialect,
    });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 500 },
    );
  }
}

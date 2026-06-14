import React, { useState, useEffect } from "react";
import { getApiUrl } from "../utils/api";

// Cache for translational elements to minimize API calls and keep responses instant
const memoryCache: Record<string, string> = {};

// Dictionary of simple, high-frequency static UI terms to prevent hitting the AI model for navigation or simple words
const STATIC_DIC: Record<string, Record<string, string>> = {
  hi: {
    "Shrimad Bhagavad Gita": "श्रीमद्भगवद्गीता",
    "Gita Portal": "गीता पोर्टल",
    "The Divine Song of God": "ईश्वर का दिव्य गीत",
    "Begin the Journey": "यात्रा आरंभ करें",
    "Verse Of The Day": "आज का श्लोक",
    "Verse of the Day": "आज का श्लोक",
    "THE DIVINE AUTHORS": "दिव्य रचनाकार",
    "MAHARISHI VED VYASA": "महर्षि वेदव्यास",
    "THE COMPILER": "संकलनकर्ता",
    "LORD GANESHA": "भगवान श्री गणेश",
    "THE DIVINE SCRIBE": "दिव्य लेखक",
    "Tap to read full purport & commentary": "पूरा अर्थ और भाष्य पढ़ने के लिए स्पर्श करें",
    "Tap to read full purport & commentary ->": "पूरा अर्थ और भाष्य पढ़ने के लिए स्पर्श करें ->",
    "Chapters": "अध्याय",
    "Chapter": "अध्याय",
    "Verse": "श्लोक",
    "Verses": "श्लोक",
    "Sanskrit": "संस्कृत",
    "Translation": "अनुवाद",
    "Purport": "तात्पर्य",
    "Commentary": "भाष्य",
    "Introduction": "परिचय",
    "Authors": "रचनाकार",
    "Who is Gita For": "गीता किसके लिए है",
    "Gita Around the World": "विश्व भर में गीता",
    "Legends of Mahabharat": "महाभारत की कथाएँ",
    "Mahabharat Family Tree": "महाभारत वंशवृक्ष",
    "Essential Verses": "महत्वपूर्ण श्लोक",
    "Gita in Daily Life": "दैनिक जीवन में गीता",
    "Podcasts": "पॉडकास्ट",
    "Books": "पुस्तकें",
    "FAQ": "अक्सर पूछे जाने वाले प्रश्न",
    "Ask Lord Krishna...": "भगवान कृष्ण से पूछें...",
    "Ask": "पूछें",
    "Lord Krishna": "भगवान कृष्ण",
    "Divine Guidance Channel": "दिव्य मार्गदर्शन चैनल",
    "Type your worry, dilemma or question...": "अपनी चिंता, दुविधा या प्रश्न लिखें...",
    "Sending guidance...": "दिव्य संदेश आ रहा है...",
    "Begin Quest": "अन्वेषण शुरू करें",
    "Close": "बंद करें"
  },
  mr: {
    "Shrimad Bhagavad Gita": "श्रीमद्भगवद्गीता",
    "Gita Portal": "गीता पोर्टल",
    "The Divine Song of God": "ईश्वराचे दिव्य गीत",
    "Begin the Journey": "प्रवास सुरू करा",
    "Verse Of The Day": "आजचा श्लोक",
    "Verse of the Day": "आजचा श्लोक",
    "THE DIVINE AUTHORS": "दिव्य लेखक",
    "MAHARISHI VED VYASA": "महर्षि वेदव्यास",
    "THE COMPILER": "संकलनकर्ता",
    "LORD GANESHA": "भगवान श्री गणेश",
    "THE DIVINE SCRIBE": "दिव्य लेखक",
    "Tap to read full purport & commentary": "पूर्ण अर्थ आणि भाष्य वाचण्यासाठी दाबा",
    "Tap to read full purport & commentary ->": "पूर्ण अर्थ आणि भाष्य वाचण्यासाठी दाबा ->",
    "Chapters": "अध्याय",
    "Chapter": "अध्याय",
    "Verse": "श्लोक",
    "Verses": "श्लोक",
    "Sanskrit": "संस्कृत",
    "Translation": "भाषांतर",
    "Purport": "तात्पर्य",
    "Commentary": "भाष्य",
    "Introduction": "परिचय",
    "Authors": "लेखक",
    "Who is Gita For": "गीता कोणासाठी आहे",
    "Gita Around the World": "जगभरात गीता",
    "Legends of Mahabharat": "महाभारतातील दंतकथा",
    "Mahabharat Family Tree": "महाभारत वंशवृक्ष",
    "Essential Verses": "महत्त्वाचे श्लोक",
    "Gita in Daily Life": "दैनिक जीवनात गीता",
    "Podcasts": "पॉडकास्ट",
    "Books": "पुस्तके",
    "FAQ": "नेहमी विचारले जाणारे प्रश्न",
    "Ask Lord Krishna...": "भगवान श्रीकृष्णांना विचारा...",
    "Ask": "विचारा",
    "Lord Krishna": "भगवान श्रीकृष्ण",
    "Divine Guidance Channel": "दिव्य मार्गदर्शन चॅनेल",
    "Type your worry, dilemma or question...": "तुमची काळजी, समस्या किंवा प्रश्न टाईप करा...",
    "Sending guidance...": "देववाणी अवतरत आहे...",
    "Begin Quest": "शोध सुरू करा",
    "Close": "बंद करा"
  },
  sa: {
    "Shrimad Bhagavad Gita": "श्रीमद्भगवद्गीता",
    "Gita Portal": "गीताद्वारम्",
    "The Divine Song of God": "भगवतः दिव्यं गीतम्",
    "Begin the Journey": "यात्रां प्रारभत",
    "Verse Of The Day": "अद्यतनः श्लोकः",
    "Verse of the Day": "अद्यतनः श्लोकः",
    "THE DIVINE AUTHORS": "दिव्यग्रन्थकाराः",
    "MAHARISHI VED VYASA": "महर्षिः वेदव्यासः",
    "THE COMPILER": "सङ्कलनकर्ता",
    "LORD GANESHA": "भगवान् श्रीगणेशः",
    "THE DIVINE SCRIBE": "दिव्यलेखकः",
    "Tap to read full purport & commentary": "पूर्णार्थभाष्यपठनाय स्पृशन्तु",
    "Chapters": "अध्यायाः",
    "Chapter": "अध्यायः",
    "Verse": "श्लोकः",
    "Verses": "श्लोकाः",
    "Sanskrit": "संस्कृतम्",
    "Translation": "अनुवादः",
    "Purport": "भावार्थः",
    "Commentary": "भाष्यम्",
    "Introduction": "परिचयः",
    "FAQ": "प्रश्नोत्तरी"
  }
};

export interface TranslateProps {
  text: string;
  className?: string;
  as?: any;
  html?: boolean;
}

// Queues of texts to translate, keyed by language.
// Each text points to a list of resolve functions (to support multiple components displaying same text)
const batchQueues: Record<string, Record<string, ((val: string) => void)[]>> = {};
const debounceTimers: Record<string, any> = {};

export const enqueueTranslation = (text: string, activeLang: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!batchQueues[activeLang]) {
      batchQueues[activeLang] = {};
    }

    if (!batchQueues[activeLang][text]) {
      batchQueues[activeLang][text] = [];
    }
    batchQueues[activeLang][text].push(resolve);

    if (debounceTimers[activeLang]) {
      clearTimeout(debounceTimers[activeLang]);
    }

    debounceTimers[activeLang] = setTimeout(() => {
      const currentQueue = batchQueues[activeLang];
      batchQueues[activeLang] = {}; // Reset queue immediately
      
      const textsToTranslate = Object.keys(currentQueue);
      if (textsToTranslate.length === 0) return;

      fetch(getApiUrl("/api/translate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLang: activeLang
        })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Batch translation request failed");
          return res.json();
        })
        .then((data) => {
          if (data && data.translatedTexts && data.translatedTexts.length === textsToTranslate.length) {
            textsToTranslate.forEach((originalText, index) => {
              const translated = data.translatedTexts[index];
              const cacheKey = `gtrans_${activeLang}_${originalText.slice(0, 100)}`;
              memoryCache[cacheKey] = translated;
              try {
                localStorage.setItem(cacheKey, translated);
              } catch (e) {}

              // Resolve all components waiting for this text
              currentQueue[originalText].forEach((resFn) => resFn(translated));
            });
          } else {
            // Failure fallback: resolve with originals
            textsToTranslate.forEach((originalText) => {
              currentQueue[originalText].forEach((resFn) => resFn(originalText));
            });
          }
        })
        .catch((err) => {
          console.error("AI Batch Translation Error:", err);
          textsToTranslate.forEach((originalText) => {
            currentQueue[originalText].forEach((resFn) => resFn(originalText));
          });
        });
    }, 350);
  });
};

const inFlightTranslations = new Set<string>();

export function useTranslate() {
  const [activeLang, setActiveLang] = useState<string>(() => {
    return localStorage.getItem("gita_preferred_lang") || "en";
  });
  const [, setVersion] = useState<number>(0);

  useEffect(() => {
    const handleLangChange = () => {
      const currentLang = localStorage.getItem("gita_preferred_lang") || "en";
      setActiveLang(currentLang);
    };

    const handleTranslationLoaded = () => {
      setVersion((v) => v + 1);
    };

    window.addEventListener("gita-language-change", handleLangChange);
    window.addEventListener("gita-translation-loaded", handleTranslationLoaded);
    const timer = setInterval(handleLangChange, 800);

    return () => {
      window.removeEventListener("gita-language-change", handleLangChange);
      window.removeEventListener("gita-translation-loaded", handleTranslationLoaded);
      clearInterval(timer);
    };
  }, []);

  const translate = (text: string): string => {
    if (!text || text.trim() === "") {
      return "";
    }

    if (activeLang === "en") {
      return text;
    }

    const dict = STATIC_DIC[activeLang];
    const cleanText = text.trim();
    if (dict && dict[cleanText]) {
      return dict[cleanText];
    }

    const normalizedKey = cleanText.replace(/[🏹✨✨📖🎯🌍🌳🧘🎧📚❓💡🏛️📜📖]/g, "").trim();
    if (dict && dict[normalizedKey]) {
      const prefix = cleanText.match(/^[🏹✨✨📖🎯🌍🌳🧘🎧📚❓💡🏛️📜📖]+/)?.[0] || "";
      const suffix = cleanText.match(/[🏹✨✨📖🎯🌍🌳🧘🎧📚❓💡🏛️📜📖]+$/)?.[0] || "";
      return `${prefix} ${dict[normalizedKey]} ${suffix}`.trim();
    }

    const cacheKey = `gtrans_${activeLang}_${cleanText.slice(0, 100)}`;
    if (memoryCache[cacheKey]) {
      return memoryCache[cacheKey];
    }

    try {
      const cachedLocal = localStorage.getItem(cacheKey);
      if (cachedLocal) {
        memoryCache[cacheKey] = cachedLocal;
        return cachedLocal;
      }
    } catch (e) {}

    if (!inFlightTranslations.has(cacheKey)) {
      inFlightTranslations.add(cacheKey);
      enqueueTranslation(cleanText, activeLang)
        .then((translated) => {
          inFlightTranslations.delete(cacheKey);
          window.dispatchEvent(new CustomEvent("gita-translation-loaded"));
        })
        .catch(() => {
          inFlightTranslations.delete(cacheKey);
        });
    }

    return text;
  };

  return { translate };
}

export const Translate: React.FC<TranslateProps> = ({
  text,
  className = "",
  as: Component = "span",
  html = false
}) => {
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [activeLang, setActiveLang] = useState<string>(() => {
    return localStorage.getItem("gita_preferred_lang") || "en";
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Sync language selection on changes via storage or event dispatch
  useEffect(() => {
    const handleLangChange = () => {
      const currentLang = localStorage.getItem("gita_preferred_lang") || "en";
      setActiveLang(currentLang);
    };

    window.addEventListener("gita-language-change", handleLangChange);
    // Periodically poll local storage in case other tabs or operations modify it
    const timer = setInterval(handleLangChange, 800);

    return () => {
      window.removeEventListener("gita-language-change", handleLangChange);
      clearInterval(timer);
    };
  }, []);

  // Run translation loop
  useEffect(() => {
    if (!text || text.trim() === "") {
      setTranslatedText("");
      return;
    }

    if (activeLang === "en") {
      setTranslatedText(text);
      return;
    }

    // Step 1: Check static dictionary mappings first for rapid rendering of basic interface elements
    const dict = STATIC_DIC[activeLang];
    const cleanText = text.trim();
    if (dict && dict[cleanText]) {
      setTranslatedText(dict[cleanText]);
      return;
    }

    // Secondary static dictionary variations (stripping symbols)
    const normalizedKey = cleanText.replace(/[🏹✨✨📖🎯🌍🌳🧘🎧📚❓💡🏛️📜📖✨]/g, "").trim();
    if (dict && dict[normalizedKey]) {
      // Re-attach decorations as appropriate
      const prefix = cleanText.match(/^[🏹✨✨📖🎯🌍🌳🧘🎧📚❓💡🏛️📜📖]+/)?.[0] || "";
      const suffix = cleanText.match(/[🏹✨✨📖🎯🌍🌳🧘🎧📚❓💡🏛️📜📖]+$/)?.[0] || "";
      setTranslatedText(`${prefix} ${dict[normalizedKey]} ${suffix}`.trim());
      return;
    }

    // Step 2: Check Memory Cache and Local Storage
    const cacheKey = `gtrans_${activeLang}_${cleanText.slice(0, 100)}`;
    if (memoryCache[cacheKey]) {
      setTranslatedText(memoryCache[cacheKey]);
      return;
    }

    try {
      const cachedLocal = localStorage.getItem(cacheKey);
      if (cachedLocal) {
        memoryCache[cacheKey] = cachedLocal;
        setTranslatedText(cachedLocal);
        return;
      }
    } catch (e) {
      // Ignored if storage is blocked
    }

    // Step 3: Fetch dynamic server translation using Enqueued Batch system
    setTranslatedText(text);
    setLoading(true);

    let active = true;
    enqueueTranslation(cleanText, activeLang)
      .then((translated) => {
        if (active) {
          setTranslatedText(translated);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [text, activeLang]);

  if (html) {
    return (
      <Component 
        className={`${className} ${loading ? "opacity-90 transition-opacity" : ""}`}
        id={`translated-${activeLang}-${text.slice(0, 15).replace(/[^a-zA-Z0-9]/g, "-")}`}
        dangerouslySetInnerHTML={{ __html: translatedText }}
      />
    );
  }

  return (
    <Component 
      className={`${className} ${loading ? "opacity-90 transition-opacity" : ""}`}
      id={`translated-${activeLang}-${text.slice(0, 15).replace(/[^a-zA-Z0-9]/g, "-")}`}
    >
      {translatedText}
    </Component>
  );
};

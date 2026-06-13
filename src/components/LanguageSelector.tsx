import React, { useState, useEffect, useRef } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("en");
  const [isTranslateReady, setIsTranslateReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read saved language preference or default to English
  useEffect(() => {
    const saved = localStorage.getItem("gita_preferred_lang") || "en";
    setActiveLang(saved);
  }, []);

  // Poll for Google Translate selection element readiness
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectEl) {
        setIsTranslateReady(true);
        // If there is a saved language prefered, automatically apply it
        const saved = localStorage.getItem("gita_preferred_lang") || "en";
        if (saved !== "en") {
          applyLanguageChange(saved);
        }
        clearInterval(interval);
      } else if (attempts > 30) {
        // Stop polling after 15 seconds to save CPU cycle resources
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyLanguageChange = (langCode: string) => {
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
      
      // Update our reactive frontend state
      setActiveLang(langCode);
      localStorage.setItem("gita_preferred_lang", langCode);
    } else {
      console.warn("Google translation system is still loading. Please try again in an instant.");
    }
  };

  const handleSelect = (lang: Language) => {
    applyLanguageChange(lang.code);
    setIsOpen(false);
  };

  const currentLanguageObj = LANGUAGES.find((l) => l.code === activeLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id="custom-language-selector-wrapper">
      {/* Selector Trigger Button */}
      <button
        id="language-selector-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3.5 bg-stone-100 dark:bg-stone-900/60 hover:bg-stone-200 dark:hover:bg-stone-850 text-stone-800 dark:text-amber-200 border border-stone-200 dark:border-amber-700/30 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer shadow-inner font-sans font-medium text-xs select-none hover:border-amber-500/45"
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wide uppercase">{currentLanguageObj.nativeName}</span>
        </span>
        <ChevronDown className={`w-3 h-3 text-stone-400 dark:text-amber-500/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Elegant Languages Grid Drawer */}
      {isOpen && (
        <div 
          id="custom-languages-dropdown-drawer"
          className="absolute right-0 mt-2.5 w-[280px] sm:w-[320px] bg-white dark:bg-[#1a0f0a] border border-[#deb887]/40 dark:border-amber-700/60 rounded-2xl shadow-xl z-[99999] overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {/* Header */}
          <div className="p-3 bg-stone-50 dark:bg-[#25160e] border-b border-[#deb887]/20 flex items-center justify-between">
            <span className="font-serif font-bold text-[#8b4513] dark:text-amber-450 text-[11px] tracking-widest uppercase">TRANSLATE PORTAL</span>
            {!isTranslateReady && (
              <span className="text-[9px] text-[#8b4513]/70 dark:text-amber-500/60 italic animate-pulse">Initializing engines...</span>
            )}
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-2 gap-1 p-2 max-h-[320px] overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === activeLang;
              return (
                <button
                  key={lang.code}
                  id={`lang-option-${lang.code}`}
                  onClick={() => handleSelect(lang)}
                  className={`flex items-center justify-between w-full p-2 rounded-xl text-left transition-all cursor-pointer select-none border text-xs ${
                    isSelected
                      ? "bg-amber-100/70 border-amber-500/40 dark:bg-amber-950/40 dark:border-amber-500/50 text-[#8b4513] dark:text-[#ffd700] font-semibold"
                      : "bg-transparent border-transparent hover:bg-stone-50 hover:border-stone-200/50 dark:hover:bg-amber-950/10 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] opacity-60 font-sans tracking-wide">{lang.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer disclaimer */}
          <div className="p-2.5 bg-stone-50 dark:bg-[#25160e]/50 border-t border-[#deb887]/15 text-[9px] text-center text-stone-400 dark:text-stone-500 leading-normal">
            Translations powered dynamically via Google neural cloud system
          </div>
        </div>
      )}
    </div>
  );
};

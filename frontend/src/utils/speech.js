/**
 * Utility for discovered browser SpeechSynthesis voices and native text-to-speech rendering
 */

export const getAvailableVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
};

export const getAvailableLanguages = () => {
  return [
    { code: 'vi-VN', label: '🇻🇳 Tiếng Việt (Chuẩn Việt Nam)' },
    { code: 'en-US', label: '🇺🇸 English (United States)' },
    { code: 'en-GB', label: '🇬🇧 English (United Kingdom)' },
    { code: 'ja-JP', label: '🇯🇵 日本語 (Japanese)' },
    { code: 'zh-CN', label: '🇨🇳 中文 (Chinese Mandarin)' },
    { code: 'fr-FR', label: '🇫🇷 Français (French)' },
    { code: 'de-DE', label: '🇩🇪 Deutsch (German)' }
  ];
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (text, options = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("SpeechSynthesis API is not supported in this browser.");
    return null;
  }

  window.speechSynthesis.cancel(); // Cancel any ongoing speech

  if (!text || text.trim() === '') return null;

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLang = options.lang || 'vi-VN';
  const targetVoiceName = options.voiceName || '';

  utterance.lang = targetLang;
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;

  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    let chosenVoice = null;

    // 1. Match exact voice name if provided
    if (targetVoiceName) {
      chosenVoice = voices.find(v => v.name === targetVoiceName);
    }

    // 2. Match language code (e.g. vi-VN or vi_VN)
    if (!chosenVoice && targetLang) {
      const cleanLang = targetLang.toLowerCase().replace('_', '-');
      chosenVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang === cleanLang || vLang.startsWith(cleanLang);
      });
    }

    // 3. Match language prefix (e.g. 'vi')
    if (!chosenVoice && targetLang) {
      const prefix = targetLang.split('-')[0].toLowerCase();
      chosenVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
  }

  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
  return utterance;
};

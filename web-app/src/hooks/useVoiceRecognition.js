import { useState, useEffect, useCallback } from 'react';

const useVoiceRecognition = (initialLanguage = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(initialLanguage);
  const [confidence, setConfidence] = useState(0);

  // Initialize speech recognition
  const recognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in this browser.');
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 3;
    return recognition;
  }, []);

  const startListening = useCallback(() => {
    try {
      const recognitionInstance = recognition();
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current][0];
        const transcriptText = result.transcript;
        const confidence = result.confidence;
        setTranscript(transcriptText);
        setConfidence(confidence);
      };

      recognitionInstance.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.start();

      return recognitionInstance;
    } catch (err) {
      setError(err.message);
      setIsListening(false);
      return null;
    }
  }, [recognition]);

  const stopListening = useCallback((recognitionInstance) => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    setIsListening(false);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 100);
    }
  };

  return {
    isListening,
    transcript,
    error,
    confidence,
    language,
    startListening,
    stopListening,
    changeLanguage,
  };
};

export default useVoiceRecognition;

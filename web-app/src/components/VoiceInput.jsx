import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { Mic, MicOff, VolumeUp } from '@mui/icons-material';
import useVoiceRecognition from '../hooks/useVoiceRecognition';

const languages = [
  { code: 'en-US', label: 'English' },
  { code: 'sw-KE', label: 'Kiswahili' },
];

const VoiceInput = ({ onTranscriptChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].code);
  const {
    isListening,
    transcript,
    error,
    confidence,
    startListening,
    stopListening,
    changeLanguage,
  } = useVoiceRecognition(selectedLanguage);

  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (transcript) {
      onTranscriptChange?.(transcript);
      // Add a small delay to allow for complete sentences
      timeoutId = setTimeout(() => {
        processVoiceInput(transcript);
      }, 1000); // 1 second delay
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [transcript]);

  const processVoiceInput = async (text) => {
    if (!text) return;

    setIsLoading(true);
    try {
      console.log('Sending request with text:', text); // Debug log
      const response = await fetch('http://localhost:8000/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: selectedLanguage,
          confidence,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response:', data); // Debug log

      if (data.message) {
        setResponse(data.message);

        // Text-to-speech in the detected language
        const utterance = new SpeechSynthesisUtterance(data.message);
        utterance.lang = data.detected_language === 'sw' ? 'sw-KE' : 'en-US';
        utterance.rate = 0.9; // Slightly slower speech rate
        utterance.pitch = 1.0;
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
      } else {
        setResponse('Sorry, I did not understand that. Could you please rephrase?');
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      setResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
      if (isListening) {
        stopListening(); // Stop listening after processing
      }
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <FormControl sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel>Language</InputLabel>
        <Select value={selectedLanguage} onChange={handleLanguageChange} label="Language">
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: isListening ? '#e8f5e9' : 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            color={isListening ? 'error' : 'primary'}
            onClick={toggleListening}
            sx={{ mr: 2 }}
          >
            {isListening ? <MicOff /> : <Mic />}
          </IconButton>
          <Typography>
            {isListening ? 'Listening...' : 'Click the microphone to start speaking'}
          </Typography>
        </Box>

        {transcript && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            You said: {transcript}
          </Typography>
        )}

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}
      </Paper>

      {response && (
        <Paper elevation={3} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <VolumeUp sx={{ mr: 1 }} color="primary" />
            <Typography variant="subtitle1">Response:</Typography>
          </Box>
          <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
            {response}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VoiceInput;

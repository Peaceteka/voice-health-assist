import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import VoiceInput from '../components/VoiceInput';

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Voice Health Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your personal health assistant powered by voice recognition.
          Speak in English or Kiswahili to get health information and guidance.
        </Typography>
      </Box>

      <VoiceInput
        onTranscriptChange={(transcript) => {
          console.log('New transcript:', transcript);
        }}
      />
    </Container>
  );
};

export default HomePage;

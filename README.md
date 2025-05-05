# Voice Health Assistant

A multilingual voice-enabled health assistant that provides health information and guidance in both English and Kiswahili.

## Features

- Voice recognition in English and Kiswahili
- Real-time health information and guidance
- Emergency assistance
- ANC/PNC visit reminders
- Health consultation history
- Text-to-speech responses

## Tech Stack

### Frontend
- React with Vite
- Material-UI for components
- Web Speech API for voice recognition
- React Router for navigation

### Backend
- FastAPI
- spaCy for language processing
- Python 3.12+

## Setup

### Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
cd src/api
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Install dependencies
cd web-app
npm install

# Start development server
npm run dev
```

## Usage

1. Open the application in your browser
2. Select your preferred language (English or Kiswahili)
3. Click the microphone icon and speak your health-related question
4. Listen to or read the response

## Contributing

[Contribution guidelines will be added]
=======
# voice-health-assist
 Develop a voice-activated health information system that allows individuals to get health advice, emergency responses, and healthcare information in their native language, using just their voice.
>>>>>>> 73f657416c9a06e0d2cf44f95ab8250e533f8010

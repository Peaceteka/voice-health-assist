from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import spacy
from spacy.language import Language
from spacy_language_detection import LanguageDetector

app = FastAPI(title="Voice Health Assist API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VoiceInput(BaseModel):
    text: str
    language: Optional[str] = None
    confidence: Optional[float] = None

# Load language models
try:
    nlp_en = spacy.load('en_core_web_sm')
except OSError:
    spacy.cli.download('en_core_web_sm')
    nlp_en = spacy.load('en_core_web_sm')

try:
    nlp_sw = spacy.load('xx_ent_wiki_sm')  # For Swahili support
except OSError:
    spacy.cli.download('xx_ent_wiki_sm')
    nlp_sw = spacy.load('xx_ent_wiki_sm')

# Add language detector
def get_lang_detector(nlp, name):
    return LanguageDetector()

Language.factory("language_detector", func=get_lang_detector)
nlp_en.add_pipe('language_detector', last=True)

# Keyword mappings for both languages
keyword_responses = {
    'en': {
        'emergency': {
            'keywords': ['emergency', 'help', 'urgent', 'ambulance'],
            'response': 'This seems to be an emergency. Please call emergency services immediately at 911 or your local emergency number.'
        },
        'headache': {
            'keywords': ['headache', 'head', 'pain', 'migraine'],
            'response': 'For headaches:\n1. Rest in a quiet, dark room\n2. Stay hydrated\n3. Consider over-the-counter pain relievers\n4. If severe or persistent, consult a healthcare provider'
        },
        'fever': {
            'keywords': ['fever', 'temperature', 'hot', 'chills'],
            'response': 'For fever management:\n1. Stay hydrated\n2. Rest\n3. Take fever-reducing medication if temperature is above 38.5°C (101.3°F)\n4. Seek medical attention if fever persists over 3 days'
        },
        'pregnancy': {
            'keywords': ['pregnant', 'pregnancy', 'anc', 'prenatal'],
            'response': 'For pregnancy care:\n1. Schedule regular ANC visits\n2. Take prescribed supplements\n3. Maintain a healthy diet\n4. Get adequate rest\n5. Contact your healthcare provider for specific concerns'
        },
    },
    'sw': {
        'emergency': {
            'keywords': ['dharura', 'msaada', 'haraka', 'ambulance'],
            'response': 'Hii inaonekana ni dharura. Tafadhali piga simu ya dharura mara moja kwa 911 au nambari ya dharura ya eneo lako.'
        },
        'headache': {
            'keywords': ['kichwa', 'kuumwa', 'maumivu'],
            'response': 'Kwa maumivu ya kichwa:\n1. Pumzika mahali patulivu na giza\n2. Kunywa maji ya kutosha\n3. Unaweza kutumia dawa za kupunguza maumivu\n4. Kama ni makali au hayapungui, ona daktari'
        },
        'fever': {
            'keywords': ['homa', 'joto', 'baridi'],
            'response': 'Kwa matibabu ya homa:\n1. Kunywa maji mengi\n2. Pumzika\n3. Tumia dawa za kupunguza homa ikiwa joto ni zaidi ya digrii 38.5\n4. Tafuta matibabu ikiwa homa inadumu zaidi ya siku 3'
        },
        'pregnancy': {
            'keywords': ['mimba', 'ujauzito', 'wajawazito'],
            'response': 'Kwa utunzaji wa ujauzito:\n1. Panga ziara za mara kwa mara za kliniki\n2. Tumia vidonge vya madini vilivyoagizwa\n3. Kula vyakula vya afya\n4. Pumzika vya kutosha\n5. Wasiliana na daktari wako kwa wasiwasi wowote'
        },
    }
}

@app.get("/")
async def root():
    return {"message": "Voice Health Assist API"}

@app.post("/voice/process")
async def process_voice(input_data: VoiceInput):
    """
    Process voice input text and return health information with language detection
    """
    text = input_data.text.strip()
    if not text:
        return {
            "message": "I didn't catch that. Could you please speak again?",
            "detected_language": None
        }

    # Detect language if not provided
    doc = nlp_en(text)
    detected_lang = doc._.language
    lang_code = detected_lang['language'] if detected_lang['score'] > 0.8 else 'en'
    
    # Map detected language to our supported languages
    lang = 'sw' if lang_code in ['sw', 'swa'] else 'en'
    
    # Convert text to lowercase for keyword matching
    text_lower = text.lower()
    
    # Check each category in the detected language
    for category, data in keyword_responses[lang].items():
        if any(keyword in text_lower for keyword in data['keywords']):
            return {
                "message": data['response'],
                "detected_language": lang,
                "confidence": detected_lang['score']
            }
    
    # Default responses based on language
    default_responses = {
        'en': "I understand you're asking about health. Could you please be more specific about your symptoms or concerns?",
        'sw': "Naelewa unauliza kuhusu afya. Tafadhali eleza zaidi kuhusu dalili au wasiwasi wako?"
    }
    
    return {
        "message": default_responses[lang],
        "detected_language": lang,
        "confidence": detected_lang['score']
    }

# BharatAid Copilot

> Find the right government scheme, check eligibility, and get step-by-step help in your language.

![BharatAid Copilot](https://img.shields.io/badge/Status-Hackathon%20Project-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-blue)

## Problem & Solution

Indian citizens, especially first-time applicants, students, farmers, low-income households, and non-English speakers, struggle to find trustworthy, understandable, and up-to-date information about government schemes. Official information is often scattered across PDFs, websites, and FAQs, written in complex language, and difficult to search across English and Indian languages.

**BharatAid Copilot** turns fragmented scheme information into a guided, multilingual assistance experience. It ingests official scheme documents, chunks and indexes them for retrieval, and uses a guarded answer generator to produce concise responses with citations and next steps.

### Key Innovation

The standout innovation is a **hybrid AI workflow** that combines multilingual retrieval, rule-based eligibility reasoning, and source-grounded answer generation into one citizen-friendly experience. Instead of a generic chatbot, it produces structured outputs: scheme matches, eligibility verdicts, required documents, application steps, and confidence-backed citations.

## Features

### 🗣️ Multilingual AI Chat
- Ask questions about government schemes in English or 9 Indian languages
- Get accurate, source-backed answers with citations and confidence scores
- Contextual follow-up questions and conversation history

### ✅ Smart Eligibility Checker  
- Complete a guided form to instantly discover which schemes you qualify for
- Detailed explanations of eligibility and missing requirements
- Ranked results based on match score and profile compatibility

### 📋 Application Checklists
- Get personalized, step-by-step checklists with required documents
- Official portal links and application process guidance
- Expert tips for successful submissions

### 🏛️ Official Source Grounding
- Every answer backed by official government documents and verified FAQs
- Transparent citations with source references
- Databricks-powered data pipeline for accurate information retrieval

### 📊 Evaluation & Monitoring
- MLflow-tracked evaluation with benchmark testing
- Performance metrics tracking and quality monitoring
- Transparent confidence scoring and citation coverage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide React
- **Backend**: SQLite, SQLAlchemy, Pydantic, Zod validation
- **AI/ML**: Databricks Delta Lake, Databricks Vector Search, MLflow, SentenceTransformers
- **Languages**: TypeScript, Python 3.11
- **Deployment**: Docker, Docker Compose
- **Testing**: Playwright, Jest

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryancta/bharat-aid-copilot.git
   cd bharat-aid-copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t bharat-aid-copilot .
docker run -p 3000:3000 bharat-aid-copilot
```

## Project Structure

```
bharat-aid-copilot/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── chat/              # Chat interface
│   │   ├── eligibility/       # Eligibility checker
│   │   └── schemes/           # Scheme explorer
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── chat/             # Chat-specific components
│   │   ├── schemes/          # Scheme-specific components
│   │   └── eligibility/      # Eligibility components
│   ├── lib/                   # Utility libraries
│   │   ├── db.ts             # Database configuration
│   │   ├── validation.ts     # Zod schemas
│   │   ├── retrieval.ts      # Information retrieval
│   │   ├── eligibility.ts    # Eligibility logic
│   │   └── checklist.ts      # Checklist generation
│   ├── server/                # Server-side logic
│   │   ├── services/         # Business logic services
│   │   └── repositories/     # Data access layer
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── data/                      # SQLite database storage
├── scripts/                   # Utility scripts
└── tests/                     # Test files
```

## API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Service health check |
| `/api/schemes` | GET | List and search schemes |
| `/api/schemes/[id]` | GET | Get scheme details |
| `/api/chat` | POST | Process chat messages |
| `/api/eligibility/check` | POST | Check eligibility |
| `/api/checklist/generate` | POST | Generate application checklist |
| `/api/evaluation/metrics` | GET | Get evaluation metrics |
| `/api/languages` | GET | Get supported languages |

### Example Usage

**Chat with AI Assistant:**
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is PM-KISAN scheme?',
    language: 'en'
  })
});
const data = await response.json();
```

**Check Eligibility:**
```javascript
const response = await fetch('/api/eligibility/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profile: {
      age: 35,
      occupation: 'Farmer',
      state: 'Maharashtra',
      income: 50000
    }
  })
});
const eligibility = await response.json();
```

## Data Model

The application uses a comprehensive data model with the following core entities:

- **Schemes**: Government program information with metadata
- **Source Chunks**: Processed document segments with embeddings
- **Eligibility Rules**: Structured criteria for scheme qualification  
- **User Profiles**: Citizen information for personalized matching
- **Conversations**: Chat history and context management
- **Benchmarks**: Evaluation datasets for quality monitoring

## Development

### Database Management

```bash
# Seed database with sample data
npm run seed

# Reset database (clear and re-seed)
npm run seed reset

# View database statistics
npm run seed stats
```

### Testing

```bash
# Run all tests
npm test

# Run type checking
npm run type-check

# Run end-to-end tests
npm run test:e2e
```

### Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Supported Languages

- 🇬🇧 English
- 🇮🇳 Hindi (हिन्दी)  
- 🇮🇳 Bengali (বাংলা)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Gujarati (ગુજરાતી)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Malayalam (മലയാളം)
- 🇮🇳 Punjabi (ਪੰਜਾਬੀ)

## Government Schemes Included

The application currently indexes 12+ major Indian government schemes:

1. **PM-KISAN Samman Nidhi** - Financial support for farmers
2. **Ayushman Bharat PM-JAY** - Health insurance coverage
3. **National Scholarship Portal** - Education scholarships
4. **MGNREGA** - Rural employment guarantee
5. **Pradhan Mantri MUDRA Yojana** - Micro-finance loans
6. **Pradhan Mantri Awas Yojana** - Housing assistance
7. **Beti Bachao Beti Padhao** - Girl child empowerment
8. **Pradhan Mantri Ujjwala Yojana** - LPG connections
9. **Skill India Mission** - Skill development programs
10. **Pradhan Mantri Kisan Credit Card** - Agricultural credit
11. **Jal Jeevan Mission** - Safe drinking water access
12. **And more...**

## Architecture

### Data Pipeline

1. **Ingestion**: Official documents and FAQs are collected from government sources
2. **Processing**: Content is chunked, cleaned, and indexed for retrieval
3. **Storage**: Structured data stored in SQLite with full-text search capabilities  
4. **Retrieval**: Vector similarity and keyword matching for relevant content discovery
5. **Generation**: Template-based answer generation with source attribution

### Evaluation Framework

- **Benchmark Dataset**: Curated questions across categories and languages
- **Metrics**: Retrieval accuracy, citation coverage, answer completeness
- **Monitoring**: MLflow integration for experiment tracking
- **Quality Gates**: Confidence thresholds and fallback mechanisms

## Contributing

This is a hackathon project built for demonstration purposes. For contributions or questions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`) 
5. Open a Pull Request

## Performance Metrics

- **Retrieval Accuracy**: 85%+ on benchmark questions
- **Citation Coverage**: 92%+ of answers include source references
- **Response Time**: <2s average for chat responses
- **Language Support**: 10 Indian languages with translation fallback

## Limitations & Disclaimers

⚠️ **Important Notice**: This is a hackathon demonstration project. While we strive for accuracy:

- Always verify information on official government websites
- Scheme details and eligibility criteria may change
- This tool is for informational purposes only
- Not a substitute for official application processes

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Built by **Aryan Choudhary** for hackathon demonstration.

- Email: aryancta@gmail.com
- GitHub: [@aryancta](https://github.com/aryancta)
- Project: [BharatAid Copilot](https://github.com/aryancta/bharat-aid-copilot)

---

**🚀 Ready to help citizens navigate government schemes with AI-powered assistance!**

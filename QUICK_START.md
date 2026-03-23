# Quick Start Guide

## AI-Powered UI Component Generator

**Author:** M.H. Nishan Sathsara  
**Project:** Final Year Project  
**Timeline:** January 2025 - November 2025  
**Supervisor:** Dr. Rasika Ranaweera

## 🚀 Quick Start (5 minutes)

### Option 1: Using the Start Script (Windows)

1. Double-click `start.bat` in the project root
2. Wait for the server to start
3. Browser will open automatically at `http://localhost:5173`

### Option 2: Manual Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at http://localhost:5173
```

## 🎯 Try These Example Prompts

### Buttons

- "Create a blue button with hover effects"
- "Make a large red button with rounded corners"
- "Build a small green submit button"

### Cards

- "Design a card component with title and shadow"
- "Create a product card with image placeholder"
- "Make a simple white card with border"

### Forms

- "Build a login form with email and password"
- "Create an input field with label and validation"
- "Design a contact form with multiple fields"

### Advanced

- "Create a responsive navigation bar"
- "Make a modal dialog with close button"
- "Build a pricing table with features"

## 🎮 How to Use

1. **Enter Description**: Type what component you want in natural language
2. **Generate**: Click "Generate Component" button
3. **Review**: Check the generated code and preview
4. **Copy**: Click "Copy Code" to copy to clipboard
5. **Use**: Paste into your React project

## 🔧 Configuration

### Mock API Mode (Default)

- No API keys needed
- Perfect for testing and development
- Realistic AI simulation with delays

### Live AI API Mode

1. Get API key from [xAI](https://x.ai/api) or [OpenAI](https://platform.openai.com/)
2. Copy `.env.example` to `.env`
3. Add your API key: `VITE_XAI_API_KEY=your_key_here`
4. Toggle to "Live AI API" mode in the app

## 📁 Project Structure

```
ui_comp_gen/
├── src/
│   ├── components/
│   │   └── UIComponentGenerator.jsx  # Main component
│   ├── App.jsx                       # Root app
│   └── index.css                     # Tailwind styles
├── public/                           # Static assets
├── .env.example                      # Environment template
├── start.bat                         # Windows launcher
└── README.md                         # Full documentation
```

## ⚡ Features

- **AI-Powered**: Uses xAI Grok or OpenAI GPT-4
- **Tailwind CSS**: All components use modern CSS framework
- **Real-time Preview**: See components as you generate them
- **Copy to Clipboard**: One-click code copying
- **Mock API**: Development mode with realistic simulation
- **Responsive**: Works on all devices
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **AI APIs**: xAI Grok + OpenAI GPT-4
- **HTTP Client**: Axios
- **Development**: Hot reload, ESLint

## 📞 Support

For issues or questions about this academic project:

- Check the full documentation in `README.md`
- Review component details in `COMPONENT_DOCS.md`
- Contact through academic supervisor

## 🎓 Academic Context

This project is part of a Final Year Project evaluating:

- AI's role in software development
- Natural language to code generation
- Modern web development practices
- Human-computer interaction in AI tools

---

**Status**: Development Phase (Month 1 Complete)  
**Next**: Testing and refinement (Month 2)  
**Final**: Documentation and dissertation integration (Month 3)

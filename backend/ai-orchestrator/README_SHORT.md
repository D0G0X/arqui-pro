# AI Orchestrator - Pilar 3: MCP Chatbot Multimodal

🤖 Sistema de IA conversacional con MCP Tools para ArquiPro.

## Inicio Rápido

Ver [QUICK_START.md](QUICK_START.md) para instalación en 5 minutos.

## Documentación Completa

- [README.md](README.md) - Documentación técnica completa
- [docs/PILAR3_MCP_CHATBOT.md](../../docs/PILAR3_MCP_CHATBOT.md) - Documentación académica

## Stack

- Python 3.11 + FastAPI
- Gemini / OpenAI APIs
- Tesseract OCR
- WebSocket real-time
- Patrón Strategy

## Componentes

- **AI Orchestrator**: Cerebro del sistema
- **LLM Adapters**: Patrón Strategy (Gemini/OpenAI)
- **MCP Server**: 5 tools (2 consulta + 2 acción + 1 reporte)
- **Multimodal**: Texto, imagen (OCR), PDF

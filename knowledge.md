# MUFC Booking V2 Knowledge

## Project Overview
A Node.js application for managing football match events with three main interfaces:
- **CLI**: For super administrators to manage organizations, users, and events
- **WebUI**: For organization admins to manage their events and users  
- **EmbedUI**: For participants to join/unjoin events via iframe

## Architecture
- **Backend**: Express.js server with MongoDB/Mongoose
- **Frontend**: Vanilla JavaScript with modern CSS design system
- **Authentication**: JWT tokens for WebUI, public endpoints for EmbedUI

## Key Components
- `src/cli.js` - Main CLI interface
- `interfaces/webui/` - Admin web interface
- `utils/` - Shared utilities (database, config, schemas)
- `docs/` - Architecture and specification docs

## Development Notes
- Uses design tokens in CSS for consistent styling
- Modular architecture with single responsibility principle
- Progressive enhancement (CLI first, WebUI optional)
- Multi-language support in EmbedUI (French, English, Spanish, Portuguese)

## Database Models
- Organization: Customer organizations
- WebUIUser: Admin users for WebUI
- User: End-users who join events
- MatchEvent: Recurring or single match events
- PassedMatchEvent: Historical event data

## Workflows
1. Super admins use CLI to manage organizations and create WebUI users
2. Organization admins use WebUI to manage events and participants
3. Participants use EmbedUI (iframe) to join/unjoin events

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- Vanilla JavaScript (no frameworks)
- Modern CSS with design tokens
- JWT authentication

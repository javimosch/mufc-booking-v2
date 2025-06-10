# MUFC Booking v2

This project is a booking system for Manchester United Football Club fans. It provides a CLI for super admins to manage the system, a WebUI for organization admins to manage their events and users, and an embeddable UI for users to join and un-join events.

## Features

- **CLI**: A command-line interface for super admins to manage organizations, users, and the system configuration.
- **WebUI**: A web interface for organization admins to manage their match events and users.
- **EmbedUI**: An embeddable UI that can be integrated into any website to allow users to join and un-join events.

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB (optional)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/mufc-booking-v2.git
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   JWT_SECRET=your-jwt-secret
   MONGO_URI=your-mongo-uri
   ```

### Usage

- To run the CLI:
  ```sh
  node src/cli.js
  ```
- To launch the WebUI:
  ```sh
  node src/cli.js --ui
  ```

## Documentation

- [Architecture](docs/architecture.md)
- [Specification](spec.md)
- [Progress](progress.md)

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick processing with minimal delays
- **🐢 Normal**: Balanced performance (default)
- **🌱 Gentle**: System-friendly with longer delays

## Customization

### Adding New Features

1. **CLI Features**: Extend the `GenericCLI` class in `src/cli.js`
2. **Web API**: Add routes to `interfaces/webui/src/server.js`
3. **Web UI**: Update `interfaces/webui/public/` files
4. **Utilities**: Add modules to `utils/` directory

### Example: Adding a New Menu Option

```javascript
// In src/cli.js, add to displayMenu()
console.log('  7️⃣  New Feature     - Description of new feature');

// Add to the switch statement in run()
case '7':
  await this.newFeature();
  break;

// Implement the method
async newFeature() {
  console.log('🆕 New Feature');
  console.log('═'.repeat(15));
  // Implementation here
  await this.question('Press Enter to continue...');
}
```

### Styling Customization

The web UI uses a modular CSS design system with design tokens:

```css
/* Customize colors in styles.css */
:root {
  --color-primary: #your-color;
  --gradient-primary: linear-gradient(135deg, #start, #end);
}
```

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration

### Operations
- `POST /api/process` - Run main process (streaming response)
- `GET /api/stats` - Get system statistics
- `GET /api/health` - Health check

## Development

### Running in Development Mode
```bash
# CLI with auto-restart
npm run dev

# Web UI with auto-restart
cd interfaces/webui
npm run dev
```

### Project Structure Guidelines

- Keep files under 500 lines
- Use descriptive, self-documenting names
- Separate concerns into different modules
- Follow the established patterns for consistency

### Adding Dependencies

```bash
# For CLI
npm install package-name

# For Web UI
cd interfaces/webui
npm install package-name
```

## Best Practices

### CLI Development
- Always validate user input
- Provide clear error messages with solutions
- Use progress indicators for long operations
- Implement graceful shutdown handling
- Save configuration persistently

### Web UI Development
- Use the modular CSS design system
- Implement proper loading states
- Provide real-time feedback
- Handle errors gracefully
- Ensure responsive design

### Code Organization
- One class per file
- Group related functionality
- Use consistent naming conventions
- Document complex logic
- Write self-explanatory code

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill any running processes
pkill -f "node.*server.js"
```

**Configuration not saving**
- Check file permissions in the project directory
- Ensure the application has write access

**Web UI not loading**
- Verify Node.js and npm are installed
- Check that dependencies are installed: `npm install`
- Ensure port 3000 is available

## License

MIT License - feel free to use this boilerplate for any project.

## Contributing

This boilerplate is designed to be a starting point. Customize it for your specific needs:

1. Replace generic functionality with your domain logic
2. Update branding and styling
3. Add project-specific features
4. Extend the API as needed

---

Built following the principles in `cli-rules.md` and `ui-rules.md` for maximum modularity and maintainability.

See `docs/architecture.md` and `spec.md` for more details.

## Architecture

This boilerplate follows the principles outlined in `cli-rules.md` and `ui-rules.md`:

### File Structure
```
cliui-boilerplate/
├── src/
│   └── cli.js              # Main CLI application
├── utils/
│   ├── config-manager.js   # Configuration persistence
│   └── file-operations.js  # File system utilities
├── interfaces/
│   └── webui/              # Web interface
│       ├── src/
│       │   └── server.js   # Express server
│       └── public/
│           ├── index.html  # Web UI
│           ├── styles.css  # Modular CSS design system
│           └── app.js      # Frontend JavaScript
└── docs/                   # Documentation
```

### Design Principles

- **Modular Architecture**: Small, focused files under 500 lines
- **Single Responsibility**: Each class/module handles one concern
- **Progressive Enhancement**: CLI-first with optional web interface
- **User Experience**: Clear feedback, progress tracking, error handling
- **Performance**: Configurable speed settings and batch processing

## Quick Start

### Installation
```bash
# Clone or copy the boilerplate
cd cliui-boilerplate
npm install
```

### CLI Usage
```bash
# Run interactive CLI
npm start

# Show help
npm start -- --help

# Launch web UI directly
npm start -- --ui
# or
npm run ui
```

### Web UI
```bash
# Start web interface (runs on http://localhost:3000)
npm run web
```

## Configuration

The application saves configuration to `.cliui-config.json`:

```json
{
  "setting": "your-setting-value",
  "speedPreset": "normal",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Speed Presets

- **🚀 Turbo**: Fastest processing, no delays
- **⚡ Fast**: Quick

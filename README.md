# Angular JSON Forms with Standalone Components

A dynamic form generator using JSON Schemas with Angular 15+ standalone components, JSONForms.io, and Tailwind CSS.

## Features

- 🚀 Standalone components architecture
- 📝 Dynamic forms from JSON schemas
- 🎨 Custom renderers with Tailwind CSS
- ✅ Real-time validation
- 📱 Responsive design
- ✨ Angular Material integration

## Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- Angular CLI 15+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/angular-json-forms.git
cd angular-json-forms

npm install

npx tailwindcss init

ng serve

src/
├── app/
│   ├── components/          # Custom components
│   ├── models/              # Form schemas and interfaces
│   ├── app.config.ts        # Application configuration
│   ├── app.component.ts     # Root component
│   └── main.ts              # Application bootstrap
├── styles.scss              # Global styles
└── index.html               # Main HTML template

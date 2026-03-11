# Web Components Skills

AI agent skills for the **@diniz/webcomponents** library.

## Overview

This skill provides comprehensive guidance for developers and AI agents working with the web components library. It includes:

- **Component API reference** — All 25+ components with properties, events, examples
- **Form validation patterns** — Native validation, custom validators, error handling  
- **Data table configuration** — Sorting, pagination, server-side operations, child rows
- **Styling guide** — Beautiful UI patterns, theme system, CSS customization
- **HTTP client** — Lightweight fetch wrapper with interceptors and error handling
- **State management** — Built-in store and signals for state handling
- **Routing patterns** — SPA navigation with lazy loading and guards
- **TypeScript support** — Full type definitions and examples
- **Responsive design patterns** — Mobile-first layouts and responsive components
- **Best practices** — Accessibility, performance, common patterns

## Installation

```bash
npm install @diniz/webcomponents
```

## Quick Start

```html
<head>
  <link rel="stylesheet" href="node_modules/@diniz/webcomponents/dist/style.css" />
</head>
<body>
  <ui-card shadow elevation="md">
    <ui-input label="Email" type="email" required></ui-input>
    <ui-button variant="primary">Submit</ui-button>
  </ui-card>

  <script type="module">
    import '@diniz/webcomponents';
  </script>
</body>
```

## Using This Skill with AI Agents

### VS Code Copilot

The skill is automatically available when this workspace is open. Ask questions about:

```
"How do I create a table that loads data from an API?"
"Show me form validation examples"
"How do I customize the sidebar theme?"
"What's the best way to handle errors?"
"How do I use the HTTP client?"
```

### Integration with Other AI Agents

The skill YAML frontmatter includes:

```yaml
---
name: webcomponents
description: Comprehensive skill for working with @diniz/webcomponents library
keywords: [web-components, ui-library, components, validation, theming, styling, frontend]
---
```

This allows AI agents to discover and utilize the skill through metadata.

## Skill Content Structure

The main [SKILL.md](./SKILL.md) file is organized into sections:

1. **Quick Links** — References to detailed documentation
2. **Installation** — Setup and import methods
3. **Available Components** — Organized by category:
   - Form Components (button, input, checkbox, etc.)
   - Layout Components (card, accordion, tabs, modal, sidebar, etc.)
   - Data Components (table, treeview, pagination, etc.)
   - Feedback Components (toast, spinner, tooltip, stepper)
   - Utility Components (date-picker, upload, link, dropdown)
4. **Styling & Theming** — Theme system and customization
5. **Advanced Usage** — HTTP client, validation, state management, routing
6. **Common Patterns** — Real-world examples
7. **Best Practices** — Design patterns and optimization
8. **Resources** — Links to detailed documentation

## Learning Paths

### For New Users

1. Start with **Quick Start** section
2. Explore **Form Components** for basic UI
3. Try **Common Patterns** for real-world examples
4. Reference component docs for details

### For Advanced Users

1. Review **Advanced Usage** section
2. Study **Best Practices**
3. Check individual component documentation files
4. Examine test suite for implementation patterns

### For AI Agent Integration

1. Use skill frontmatter for capability discovery
2. Reference **Available Components** for API reference
3. Use **Common Patterns** for code generation
4. Apply **Best Practices** for quality control

## Documentation Files

### Main References

- **[SKILL.md](./SKILL.md)** — This skill (AI-focused guide)
- **[README.md](./README.md)** — Skills overview (this file)

### Component Documentation

Detailed guides for components:

- **[TABLE.md](../docs/TABLE.md)** — Data tables with examples
- **[SIDEBAR.md](../docs/SIDEBAR.md)** — Navigation and theming
- **[TREEVIEW.md](../docs/TREEVIEW.md)** — Hierarchical data
- **[DATE_PICKER.md](../docs/DATE_PICKER.md)** — Calendar selection
- **[TOAST.md](../docs/TOAST.md)** — Notifications
- **[HTTP_CLIENT.md](../docs/HTTP_CLIENT.md)** — API client
- **[STYLING_GUIDE.md](../docs/STYLING_GUIDE.md)** — Design patterns

## Example Usage Scenarios

### Scenario 1: Build a Data Management Dashboard

```
User query: "I need a dashboard with a data table, sidebar navigation, 
and ability to edit/delete items from an API"

Skill provides:
✅ Table configuration example
✅ Sidebar setup code
✅ API integration pattern
✅ Row action handling
✅ Form validation
✅ Error handling
```

### Scenario 2: Create a Multi-Form Wizard

```
User query: "How do I create a multi-step form with validation?"

Skill provides:
✅ Form component examples
✅ Input validation patterns
✅ Stepper component usage
✅ Form state management
✅ Submit handling
✅ Error display
```

### Scenario 3: Implement Custom Theme

```
User query: "I need to customize the component theme colors"

Skill provides:
✅ Theme system explanation
✅ CSS custom properties reference
✅ Component-specific theming
✅ Complete theme examples
✅ Sidebar/card customization
```

## Extending the Skill

To add new content or improve the skill:

1. Update **[SKILL.md](./SKILL.md)** for component/pattern additions
2. Update **[README.md](./README.md)** for meta information
3. Maintain YAML frontmatter with keywords
4. Ensure examples are copy-paste ready
5. Include TypeScript types when relevant
6. Add cross-references to related documentation

## Available Components Summary

### Form Controls
- ui-button — Button with variants and icons
- ui-input — Text input with validation
- ui-checkbox — Custom checkboxes
- ui-radio — Radio buttons
- ui-toggle-switch — On/off toggles
- ui-select — Dropdown selection
- ui-date-picker — Calendar picker
- ui-upload — File uploads

### Layout
- ui-card — Container with elevation
- ui-accordion — Collapsible sections
- ui-tabs — Tab navigation
- ui-modal — Dialogs/modals
- ui-sidebar — Navigation sidebar
- ui-top-bar — Header bar

### Data Display
- ui-table — Data table with sorting
- ui-treeview — Hierarchical tree
- ui-pagination — Page navigation
- ui-picklist — Dual-list selection

### Feedback
- ui-toast — Notifications
- ui-spinner — Loading indicators
- ui-tooltip — Help text
- ui-stepper — Multi-step indicator

## Performance Notes

The skill is designed to be:
- **Lightweight** — Pure content with no external dependencies
- **Searchable** — Well-organized with clear sections
- **Referenceable** — Comprehensive with cross-links
- **Copy-Paste Ready** — All examples are production-ready
- **AI-Friendly** — Organized for easy parsing and understanding

## Support & Resources

- **Storybook** — Interactive components: https://rodiniz.github.io/webcomponents/
- **GitHub** — Source and issues: https://github.com/rodiniz/webcomponents
- **Issues** — Report problems or suggest improvements
- **Documentation** — Check individual `.md` files in `docs/` folder

## License

MIT — Use this skill freely in your projects and tools.
- **ui-checkbox** - Checkbox with label support
- **ui-select** - Select dropdown with options
- **ui-modal** - Modal dialog with open/close API
- **ui-tabs** - Tab navigation
- **ui-stepper** - Step indicator
- **ui-upload** - File upload component
- **ui-layout** - Layout system with header, footer, sidebar, content

## Key Documentation

- [SKILL.md](./SKILL.md) - Component API reference and validation patterns
- [../docs/STYLING_GUIDE.md](../docs/STYLING_GUIDE.md) - **Complete styling guide for creating beautiful UIs**
- [../docs/CARD.md](../docs/CARD.md) - Detailed card component documentation
- **Theme System** - 7 built-in themes + custom theme support via CSS variables
- **Router** - Built-in SPA router with lazy loading, guards, and path helpers

## Styling

For beautiful UI patterns, design best practices, and complete styling guidance, see [STYLING_GUIDE.md](../docs/STYLING_GUIDE.md).

Key styling approaches:
1. Use component properties for visual customization
2. Container CSS for layout and spacing
3. Shadow DOM scoping for style encapsulation

## When the Skill is Used

The AI agent will apply this skill when:

- Creating or modifying components from this library
- Styling components beautifully with design intent
- Setting up forms with validation
- Building data tables and pagination
- Creating responsive layouts
- Adding TypeScript support

## Design Philosophy for AI Agents

When styling components, remember:

- **Bold > Timid**: Commit to a clear aesthetic direction
- **Intentional**: Every choice should have purpose
- **Component-First**: Use built-in properties before custom CSS
- **Cohesive**: Limit colors and use consistent spacing

See [STYLING_GUIDE.md](../docs/STYLING_GUIDE.md) for complete patterns and examples.

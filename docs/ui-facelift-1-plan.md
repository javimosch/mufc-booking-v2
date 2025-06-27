# MUFC Booking V2 UI Facelift Plan

## Objective

Transform the existing MUFC Booking V2 UI from pure CSS to Tailwind CSS with DaisyUI components, using CDNs for both. Maintain the current layout, functionality, and visual aesthetic while improving maintainability and responsiveness.

## Approach

### Replace CSS with Tailwind/DaisyUI:

- Remove the styles.css file and its reference in the HTML.
- Add Tailwind CSS and DaisyUI via CDNs.
- Map existing CSS classes to Tailwind utility classes and DaisyUI components.
- Preserve the design tokens (colors, spacing, typography) by using Tailwind's utility classes or DaisyUI's theme customization.

### Maintain Visual Consistency:

- Retain the gradient background, glassmorphism effect, and card-based layout.
- Use DaisyUI's card, button, modal, and form components for a polished look.
- Ensure animations (e.g., fadeInUp, modalSlideIn) are replicated using Tailwind's animation utilities or CSS keyframes.

### Responsive Design:

- Leverage Tailwind's responsive prefixes (e.g., md:, lg:) to handle breakpoints.
- Adjust the grid layout for different screen sizes, matching the original media queries.

### Key Components to Update:

- Header: Use DaisyUI's navbar or hero for the header with a glassmorphism effect.
- Cards: Replace .card with DaisyUI's card component, styled with Tailwind utilities.
- Buttons: Use DaisyUI's btn component with Tailwind modifiers for primary/secondary styles.
- Forms: Implement DaisyUI's input and label components for the login form.
- Modal: Use DaisyUI's modal component with Tailwind for styling and animations.
- Log Section: Style with DaisyUI's card and Tailwind's scroll utilities.
- Grid Layout: Use Tailwind's grid utilities for the dashboard sections.

### Customizations:

- Define a custom Tailwind theme in the HTML to replicate the original design tokens (e.g., colors, spacing).
- Use DaisyUI's theme attributes (data-theme) for consistent styling.
- Add minimal custom CSS for animations and glassmorphism effects not covered by Tailwind/DaisyUI.

### Testing:

- Ensure the UI remains functional with the existing JavaScript (app.js and CLIWebUI).
- Test responsiveness across mobile, tablet, and desktop.
- Verify animations and interactions (e.g., modal, buttons) work as expected.

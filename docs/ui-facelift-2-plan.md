# MUFC Booking V2 UI Facelift - Phase 2 Plan

## Objective

Evolve the UI by introducing a more sophisticated layout for large screens and implementing a new, modern color scheme. This phase aims to improve user experience on desktops and enhance visual aesthetics.

## Approach

### 1. Two-Column Layout for Large Screens

- **Problem**: The current single-column layout does not make optimal use of horizontal space on widescreen monitors.
- **Solution**: Implement a responsive two-column layout that activates on large screens (`lg` breakpoint and up).
    - **Left Column (Main Content)**: This area will contain the primary management panels: `Manage Match Events`, `Manage Users`, and `Manage Organizations`. It will occupy the majority of the screen width (e.g., two-thirds).
    - **Right Column (Sidebar)**: This area will contain secondary information: `Public Event Links` and the `Activity Log`. This will create a persistent sidebar for useful links and logs.
- **Implementation**: 
    - Restructure the `index.html` body to use a `lg:grid` with `lg:grid-cols-3`.
    - The main content will be wrapped in a `div` spanning two columns (`lg:col-span-2`).
    - The sidebar content will be wrapped in a `div` spanning one column (`lg:col-span-1`).

### 2. New Color Scheme: Dark Theme

- **Problem**: The current light-themed purple gradient is functional but could be modernized.
- **Solution**: Switch to a dark theme to reduce eye strain and provide a more contemporary look. We will use DaisyUI's built-in `night` theme.
- **Implementation**:
    - Change the `data-theme` attribute on the `<html>` tag in `index.html` from `light` to `night`.
    - Update the custom CSS for the `background-image` to a darker, more subtle gradient that complements the `night` theme (e.g., a dark charcoal or navy gradient).

### 3. Testing

- Verify that the two-column layout appears correctly on screens wider than the `lg` breakpoint (1024px).
- Ensure the layout gracefully collapses back to a single column on smaller screens (tablets and mobile).
- Confirm that the new `night` theme is applied consistently across all DaisyUI components.
- Check that the new background gradient is rendered correctly.

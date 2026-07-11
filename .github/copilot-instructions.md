# Frontend Development Rules
- **Stack:** React 19, TypeScript, Vite.
- **Design System:** Strictly adhere to the design tokens, colors, and layouts defined in the root `DESIGN.md` file.
- **Component Structure:** - All new components must be functional components in `.tsx` files.
  - Every component must have an explicit TypeScript `interface Props` definition.
  - Put presentational elements in `src/components/` and page-level layouts in `src/pages/`.
- **State Management:** Use standard React hooks (`useState`, `useContext`) unless explicitly told otherwise.
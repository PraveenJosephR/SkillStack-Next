# SkillStack-Next Design & UI Guidelines

This document serves as the source of truth for the design patterns, color palettes, and component structures used in the **SkillStack-Next** frontend. 

When creating new pages or components, **strictly adhere** to these guidelines to ensure a cohesive and modern user experience.

---

## 1. Core Architecture

- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`). Container queries are heavily utilized for responsive design (`@container`).
- **Component Library**: `shadcn/ui` configured with the **"new-york"** style and **"zinc"** base color.
- **Icons**: Mix of `lucide-react` (default for shadcn) and `@tabler/icons-react` (used in specific cards and UI elements).
- **Fonts**: Geist Sans (`var(--font-geist-sans)`) and Geist Mono (`var(--font-geist-mono)`).

---

## 2. Color Palette (globals.css)

The application supports both Light and Dark modes using CSS variables defined in `src/app/globals.css`.

### Primary Colors
- **Primary (Brand)**: `hsl(0 72.2% 50.6%)` - A vibrant red/orange. Used for active states, primary buttons, and focus rings.
- **Primary Foreground**: `hsl(0 85.7% 97.3%)` - Off-white text used on primary backgrounds.
- **Ring**: Matches the primary color for focus outlines (`hsl(0 72.2% 50.6%)`).

### Backgrounds & Text
- **Background**: Pure white `hsl(0 0% 100%)` in light mode, very dark grey `hsl(0 0% 3.9%)` in dark mode.
- **Foreground (Text)**: Almost black `hsl(0 0% 3.9%)` in light mode, near white `hsl(0 0% 98%)` in dark mode.
- **Muted**: Used for subtle backgrounds. `hsl(0 0% 96.1%)` (Light) / `hsl(0 0% 14.9%)` (Dark).
- **Muted Foreground**: Used for secondary text, helper text, and descriptions.

### Status Colors
- **Destructive**: `hsl(0 84.2% 60.2%)` (Light) / `hsl(0 62.8% 30.6%)` (Dark). Used for delete actions and errors.

### Component-Specific Colors
- **Sidebar**: Uses its own set of variables (e.g., `--sidebar`, `--sidebar-foreground`) to maintain contrast regardless of the main theme.
- **Charts**: 5 distinct chart colors defined (`--chart-1` to `--chart-5`) to ensure consistent data visualization.

---

## 3. Layout Patterns

### Page Structure
New authenticated pages should be wrapped in the standard layout structure to integrate with the sidebar.
```tsx
export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Page Content Goes Here */}
        </div>
      </div>
    </div>
  )
}
```

### Spacing and Padding
- Use `gap-4` (desktop `md:gap-6`) for vertical spacing between major sections.
- Use `px-4 lg:px-6` for horizontal padding on inner layout containers to ensure content doesn't touch the screen edges.

---

## 4. Component Patterns & Styling

### Cards
Cards are heavily customized in this project and use data slots (`data-slot="card"`) for targeted styling.
- **Visuals**: Cards often feature a subtle gradient background: 
  `*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs`
- **Structure**: 
  - `<Card>` is the container.
  - `<CardHeader>` uses a grid layout internally.
  - `<CardTitle>` should be styled with `text-2xl font-semibold` and `tabular-nums` if displaying numbers.
  - `<CardAction>` is a custom slot used for placing badges or small buttons in the top-right corner of the header.

**Example Card Usage:**
```tsx
<Card className="@container/card">
  <CardHeader>
    <CardDescription>Metric Name</CardDescription>
    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
      1,234
    </CardTitle>
    <CardAction>
      <Badge variant="outline">
        <IconTrendingUp /> +10%
      </Badge>
    </CardAction>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="text-muted-foreground">Footer description text</div>
  </CardFooter>
</Card>
```

### Typography Utilities
- Always use `tabular-nums` for metrics, dates, and currency to prevent text shifting.
- Use `line-clamp-1` or `line-clamp-2` to truncate long descriptions gracefully.
- Secondary text should always use `text-muted-foreground` and `text-sm`.

### Responsive Grids
Use container queries over standard viewport breakpoints where possible for better component modularity:
```tsx
<div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
```

---

## Summary for AI / Agents
If you are generating a new page for this project:
1. Always import components from `@/components/ui/`.
2. Follow the `Page Structure` wrapper.
3. Use the defined CSS variables or standard Tailwind classes.
4. Implement the custom Card structure with `<CardAction>` for top-right badges.
5. Use `text-muted-foreground` for secondary text and `tabular-nums` for numbers.
6. Check `src/components/ui` for existing components before building custom ones.

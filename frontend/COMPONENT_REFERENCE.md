# Landing Page Component Reference

## Quick Overview

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Navigation** | Header navigation | Sticky, responsive mobile menu, logo, sign in/up CTAs |
| **HeroSection** | First impression | Headline, subheadline, dual CTAs, stats, SVG illustration |
| **ProblemSection** | Problem/solution | Before/after comparison for students & companies |
| **HowItWorksSection** | 4-step process | Interactive step cards, expanded details, icon gradients |
| **StudentBenefitsSection** | Student value prop | 6 benefit cards with icons + stats highlight |
| **CompanyBenefitsSection** | Company value prop | 4 benefits + comparison table, professional layout |
| **SkillScoreSection** | Unique feature | Interactive metrics, score card UI, 4 skill categories |
| **VisionSection** | Brand vision | Inspirational message, stats, vision breakdown |
| **FinalCTASection** | Last conversion push | Dual CTAs with role selection, animated toggle |
| **FooterSection** | Site footer | Links, social, copyright, company info, bottom banner |

## Component Import Template

```jsx
import ComponentName from '../components/landing/ComponentName';

// In your render:
<ComponentName />
```

## Customization Quick Tips

### Change Gradient Colors
Look for `from-purple-600 to-pink-600` in any component and replace with your colors:
- `from-blue-600 to-cyan-600`
- `from-green-600 to-emerald-600`
- `from-orange-600 to-red-600`

### Change Text
Directly edit the text strings in each component JSX

### Change Icon Colors
Modify the `text-*-400` or `from-*/to-*` classes on icon elements

### Change Button Styles
Update padding (`px-*/py-*`) and colors in button elements

### Change Spacing
Modify `gap-*`, `py-*/px-*`, `mb-*` Tailwind classes

## Section Details

### 1. Navigation
```jsx
// Sticky header with backdrop blur
// Responsive: hamburger menu on mobile
// Links: For Students, For Companies, Pricing, Blog
// CTAs: Sign In, Sign Up
// Features: Auto-hide mobile menu on scroll, smooth transitions
```

### 2. Hero Section
```jsx
// Eye-catching headline + subheadline
// Animated gradient background blurs
// Primary CTA: Start Building Experience (purple gradient)
// Secondary CTA: Hire Verified Talent (border style)
// Stats: 500+ tasks, 2000+ students, 50+ companies
// SVG illustration placeholder (customize with images)
```

### 3. Problem Section
```jsx
// Two-column layout for students & companies
// Problems (red) vs Solutions (green)
// Icons from lucide-react (X for problems, Check for solutions)
// Fully responsive for mobile
// Color-coded boxes for easy reading
```

### 4. How It Works
```jsx
// 4 interactive step cards
// Click to expand and see details
// Numbered badges (1, 2, 3, 4)
// Expanded view shows description + action buttons
// Connected flow design with arrows
// Gradient icons for each step
```

### 5. Student Benefits
```jsx
// 6 feature cards in 3x2 grid
// Each card has: icon, title, description, accent bar
// Benefit highlights: 50K+ earnings, 92% job success, 3.2x faster path
// Hover effects with scale animation
// Mobile responsive (1 column, then 2, then 3)
```

### 6. Company Benefits
```jsx
// 4 benefit cards with detailed descriptions
// Comparison table: Traditional vs SkillBridge
// Stats for each benefit (40% faster, 65% cost savings)
// Professional SaaS layout
// Final CTA button
```

### 7. Skill Score
```jsx
// Interactive metric selection buttons (4 types)
// Sample score card showing:
//   - Overall score (87/100)
//   - 4 sub-scores with progress bars
//   - Trends and levels
// Detailed metrics explanation on right
// Why it matters section
```

### 8. Vision
```jsx
// Centered inspirational message
// Gradient text effect
// Large "Before/After" stats
// Vision breakdown cards
// Call to action
// Minimal design, strong typography
```

### 9. Final CTA
```jsx
// Toggle between Student and Company view
// Role-specific messaging
// Quick start steps
// Animated transitions between roles
// Social proof section
// Color varies by role (purple = student, blue = company)
```

### 10. Footer
```jsx
// 4-column footer layout
// First column: Logo + social links
// Columns 2-4: Product, Company, Support links
// Bottom section: Copyright, legal links, company stats
// Banner with trust indicators
// Fully responsive
```

## Tailwind Classes Used

Most common in landing page:
- `bg-gradient-to-r from-{color} to-{color}` - Gradients
- `text-{size}` - Text sizes (5xl, 4xl, 3xl, etc.)
- `font-*` - Font weights (bold, semibold, etc.)
- `grid grid-cols-*` - Responsive grids
- `flex` - Flexbox layouts
- `rounded-*` - Border radius
- `shadow-*` - Shadow effects
- `transition` - Smooth animations
- `hover:*` - Hover states
- `border border-*` - Borders
- `opacity-*` - Transparency

## Icon Usage

All icons from `lucide-react`:
```jsx
import { IconName } from 'lucide-react';

// Usage
<IconName className="w-6 h-6" />
```

Common icons in this landing page:
- `ArrowRight` - CTAs and navigation
- `Sparkles` - Highlight/premium feel
- `BookOpen`, `CheckCircle2`, `Award`, `Briefcase` - How it works
- `TrendingUp`, `Shield`, `Zap`, `Target`, `Users` - Student benefits
- `CheckShield`, `DollarSign` - Company benefits
- `Star`, `Menu`, `X` - Various elements

## Color Palette Reference

### Backgrounds
- `bg-gray-900` - Main dark background
- `bg-gray-800` - Secondary dark
- `bg-gray-800/50` - Slightly transparent
- `bg-gray-950` - Darkest

### Text
- `text-white` - Primary text
- `text-gray-300` - Secondary text  
- `text-gray-400` - Tertiary text
- `text-gray-500` - Low visibility

### Gradients
- Purple/Pink: `from-purple-500 to-pink-500` (main brand)
- Blue/Cyan: `from-blue-500 to-cyan-500`
- Orange/Red: `from-orange-500 to-red-500`
- Green/Emerald: `from-green-500 to-emerald-500`

### Accents
- `border-purple-500` - Primary accent
- `text-purple-400` - Highlight text
- `bg-purple-600` - CTA buttons

## Animation Classes

- `animate-pulse` - Pulsing effect
- `transition` - Smooth change (0.3s)
- `group-hover:*` - Group hover effects
- `scale-110` - Zoom on hover
- `translate-x-1` - Horizontal movement
- `opacity-*` - Fade effects

CSS animations also defined internally:
- `fadeInUp` - Fade in from bottom
- `animation-delay-{n}` - Staggered animations

## Responsive Breakpoints

- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+), `md:` (768px+)
- Desktop: `lg:` (1024px+)

Example usage:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## Best Practices for Customization

1. **Colors**: Change all at once in `tailwind.config.js`
2. **Text**: Edit JSX directly, keep messaging concise
3. **Images**: Replace SVG placeholders with `<img>` tags
4. **Links**: Update href attributes in buttons and navigation
5. **Spacing**: Adjust `gap-`, `py-`, `px-` values uniformly
6. **Fonts**: Default is Inter (from Google Fonts)
7. **Icons**: Swap lucide-react icons for different ones
8. **Animations**: Modify `transition` duration and `@keyframes`

## Performance Considerations

- No heavy libraries beyond lucide-react
- CSS-based animations (performant)
- Image placeholders (SVG) - optimize later
- Minimal re-renders (static content)
- Fast load time (~50KB with Tailwind)

## Accessibility Checklist

- ✅ Semantic HTML
- ✅ Good color contrast
- ✅ Keyboard navigation
- ✅ Icon + text labels
- ✅ Button focus states
- ✅ Readable font sizes
- ⚠️ Add alt text to images
- ⚠️ Add ARIA labels if needed

---

**Last Updated**: March 3, 2026
**Created For**: SkillBridge Landing Page v1.0

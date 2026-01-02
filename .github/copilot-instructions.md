# ShopGenius - Copilot Instructions

## Project Overview

ShopGenius is a modern, AI-powered e-commerce storefront builder featuring:
- **AI Merchant Assistant**: Generates product listings using Gemini AI
- **Customer-Facing AI Shopping Concierge**: Provides personalized shopping assistance
- **Dual-Mode Interface**: Storefront view for customers and merchant dashboard for sellers

## Technology Stack

- **Frontend Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **UI Components**: Custom components with Lucide React icons
- **AI Integration**: Google Gemini AI (@google/genai v1.34.0)
- **Styling**: Tailwind CSS (utility classes)
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: LocalStorage (mock API layer)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (configured to run on port 3000 in vite.config.ts)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env.local` file in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: The Vite config maps this to both `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for flexibility.

## Project Structure

```
/
├── components/          # React components
│   ├── AIChat.tsx      # AI shopping assistant chat interface
│   ├── AboutPage.tsx   # About page component
│   ├── AuthPage.tsx    # Authentication page
│   ├── CartDrawer.tsx  # Shopping cart drawer
│   ├── Hero.tsx        # Hero section
│   ├── MerchantDashboard.tsx  # Merchant product management
│   ├── Navbar.tsx      # Navigation bar
│   ├── ProductCard.tsx # Product display card
│   └── ShopPage.tsx    # Shop page with product grid
├── services/           # API and business logic
│   ├── api.ts         # Mock API layer with localStorage
│   └── commerce.ts    # Commerce/AI generation logic
├── types.ts           # TypeScript type definitions
├── constants.ts       # App configuration and initial data
├── App.tsx           # Main application component
├── index.tsx         # Application entry point
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration

```

## Code Style and Conventions

### TypeScript
- Use TypeScript for all files
- Define interfaces for all data structures in `types.ts`
- Use explicit type annotations for function parameters and return types
- Prefer interfaces over types for object shapes

### React Components
- Use functional components with React.FC type
- Define prop interfaces above each component
- Use destructuring for props
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks when appropriate

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard`, `AIChat`)
- **Files**: Match component names (e.g., `ProductCard.tsx`)
- **Functions/Variables**: camelCase (e.g., `addToCart`, `currentPage`)
- **Interfaces/Types**: PascalCase (e.g., `Product`, `CartItem`)
- **Constants**: UPPER_SNAKE_CASE for configuration (e.g., `SYSTEM_CONFIG`)

### Styling
- Use Tailwind CSS utility classes
- Support dark mode with `dark:` variants
- Follow existing color scheme:
  - Primary: `shopify-green` (custom color)
  - Text: `gray-900` / `white` (dark mode)
  - Background: `white` / `gray-800` (dark mode)
- Add smooth transitions for interactive elements
- Use `group` and `group-hover` for nested hover effects

### State Management
- Use `useState` for component-level state
- Use `useEffect` for side effects and data fetching
- Pass state down through props (prop drilling is acceptable for this app size)
- Keep state as close to where it's used as possible

### API Layer
- All API calls go through `services/api.ts`
- Mock network latency with `transport()` function
- Use localStorage for data persistence
- Return Promises from all API functions
- Handle errors gracefully with try/catch

### AI Integration
- AI models configured in `constants.ts` under `SYSTEM_CONFIG.MODELS`
- Use `gemini-3-flash-preview` for both generation and chat
- Keep AI prompts clear and specific
- Handle AI responses asynchronously

## Key Features to Maintain

### Product Management
- Products have: title, description, price, imageUrl, category, tags, stock, rating, reviews
- Support for optional SEO fields (seoTitle, seoDescription)
- Stock tracking with low stock warnings (< 10 items)
- Out of stock handling with disabled add-to-cart

### Shopping Cart
- Cart items extend Product with quantity field
- Persistent across page navigation (in-memory during session)
- Drawer-style cart interface
- Currency conversion support (USD, EUR, GBP, JPY)

### Multi-Currency Support
- Currency rates defined in `constants.ts`
- Display prices in selected currency with proper symbols
- Convert prices using `CURRENCY_RATES` object

### Theme Support
- Light and dark mode toggle
- Apply theme class to `document.documentElement`
- All components support dark mode variants

### User Features
- User authentication (mock)
- Wishlist functionality
- Order history
- Product reviews

## Common Patterns

### Adding a New Component
1. Create file in `/components` with PascalCase name
2. Define props interface above component
3. Use `React.FC<PropsInterface>` type
4. Support dark mode in styling
5. Import and use in parent component

### Adding a New API Endpoint
1. Add function to `services/api.ts`
2. Use `transport()` for mock latency
3. Access localStorage with keys from `STORAGE_KEYS`
4. Return typed Promise
5. Handle errors appropriately

### Adding a New Type
1. Add interface to `types.ts`
2. Export the interface
3. Use in components and services
4. Keep types colocated in single file

## Testing Considerations
- No formal test suite currently implemented
- Manual testing via `npm run dev`
- Test all currency conversions
- Test dark mode toggle
- Test AI chat and product generation
- Verify localStorage persistence

## Performance Best Practices
- Use React.memo() for expensive components if needed
- Optimize images (currently using placeholder images)
- Lazy load components if bundle size grows
- Keep localStorage payloads small

## Accessibility
- Use semantic HTML elements
- Include alt text for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Use ARIA labels where appropriate

## Security Notes
- Never commit API keys to the repository
- Use environment variables for sensitive data
- Sanitize user inputs before AI prompts
- Validate data from localStorage

## AI Generation Guidelines
- Product generation uses Gemini AI
- Provide clear, structured prompts
- Parse AI responses carefully
- Handle generation failures gracefully
- Store generated products via API layer

## Future Considerations
- Add proper backend API
- Implement real authentication
- Add payment processing
- Set up automated testing
- Add analytics
- Optimize for production deployment
- Add server-side rendering (SSR) if needed

## Getting Help
- Check existing components for patterns
- Review `types.ts` for data structures
- Look at `constants.ts` for configuration
- Examine `services/api.ts` for data operations
- AI Studio link: https://ai.studio/apps/drive/1PPtIvKFR4hlsxjg-qDFvfMza4j_Nho8Q

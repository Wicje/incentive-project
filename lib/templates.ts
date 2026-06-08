export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  clientType: string;
  defaultStages: { id: string; label: string }[];
  defaultTasks: { title: string; stageId: string }[];
  canvasTemplate: string;
}

export const MOODBOARD_TEMPLATES = [
  {
    id: 'agency-onboarding',
    title: 'Agency Client Onboarding',
    description: 'Template inspired by the Agency Portal image (Brand Strategy, Creative Direction, etc.)',
    layoutRef: 'Image 1: grid with onboarding video, project assets, brand strategy docs.',
    content: `
      <h2>Client Portal Onboarding</h2>
      <p>Welcome to your portal. Here you will find all strategy documents, assets, and invoices.</p>
      <ul>
        <li>Brand Strategy</li>
        <li>Creative Direction</li>
        <li>Onboarding Resources</li>
      </ul>
    `
  },
  {
    id: 'personal-dashboard',
    title: 'Personal Dashboard / Second Brain',
    description: 'Template inspired by the Personal Dashboard image with music, habits, and tasks.',
    layoutRef: 'Image 2 & 3: Sidebar with domains, finance, goals. Main view with habit tracker and active tasks.',
    content: `
      <h2>Second Brain Dashboard</h2>
      <div class="domains">
        <h3>Domains</h3>
        <p>Finance, Projects, Content, Learning</p>
      </div>
      <div class="habits">
        <h3>Habit Tracker</h3>
        <ul>
          <li>Read 30 mins</li>
          <li>Workout</li>
        </ul>
      </div>
    `
  },
  {
    id: 'freelancer-workspace',
    title: 'Freelancer Workspace',
    description: 'Template inspired by the Freelancer Workspace image with active clients and invoice tracking.',
    layoutRef: 'Image 4: Active clients gallery, quick draft, revenue tracker.',
    content: `
      <h2>Freelancer Workspace</h2>
      <p>Active Clients and Pipeline</p>
      <ul>
        <li>Q3 Strategy Planning</li>
        <li>Website Redesign</li>
      </ul>
    `
  },
  {
    id: 'literature-tracker',
    title: 'Literature / Reading Tracker',
    description: 'Template inspired by the Literature view with book waitlists and thumbnail galleries.',
    layoutRef: 'Image 5: Gallery of books, status (waitlist, reading).',
    content: `
      <h2>Literature Hub</h2>
      <p>Books to read, currently reading, and finished.</p>
      <ul>
        <li>Sapiens (Reading)</li>
        <li>Atomic Habits (Waitlist)</li>
      </ul>
    `
  }
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'logo-architecture',
    name: '15-Step Logo Architecture',
    description: '15-step logo architecture template.',
    clientType: 'Any',
    defaultStages: [
      { id: 'research', label: 'Research & Strategy' },
      { id: 'concepts', label: 'Concepts & Sketching' },
      { id: 'refinement', label: 'Design & Refinement' },
      { id: 'delivery', label: 'Presentation & Delivery' }
    ],
    defaultTasks: [
      { title: 'Client Intake & Brief', stageId: 'research' },
      { title: 'Competitor Research', stageId: 'research' },
      { title: 'Target Audience Profile', stageId: 'research' },
      { title: 'Brand Positioning Scales', stageId: 'research' },
      { title: 'Style Direction — Mood Boards', stageId: 'concepts' },
      { title: 'Client Direction Lockup', stageId: 'concepts' },
      { title: 'Word Mapping & Brainstorm', stageId: 'concepts' },
      { title: 'Thumbnail Sketching', stageId: 'concepts' },
      { title: 'Vectorize Concepts', stageId: 'refinement' },
      { title: 'Typography Pairings Study', stageId: 'refinement' },
      { title: 'Color Palette System', stageId: 'refinement' },
      { title: 'Logo Matrix Variations', stageId: 'refinement' },
      { title: 'Clear Space Spacing Rules', stageId: 'refinement' },
      { title: 'Concept Deck Presentation', stageId: 'delivery' },
      { title: 'Final File Delivery Package', stageId: 'delivery' }
    ],
    canvasTemplate: `
      <h2>1. Client Intake & Brief</h2>
      <p><br></p>
      <h2>2. Competitor Research</h2>
      <p><br></p>
      <h2>3. Target Audience Profile</h2>
      <p><br></p>
      <h2>4. Brand Positioning Scales</h2>
      <p><br></p>
      <h2>5. Style Direction — Mood Boards</h2>
      <p><br></p>
      <h2>6. Client Direction Lockup</h2>
      <p><br></p>
      <h2>7. Word Mapping & Brainstorm</h2>
      <p><br></p>
      <h2>8. Thumbnail Sketching</h2>
      <p><br></p>
      <h2>9. Vectorize Concepts</h2>
      <p><br></p>
      <h2>10. Typography Pairings Study</h2>
      <p><br></p>
      <h2>11. Color Palette System</h2>
      <p><br></p>
      <h2>12. Logo Matrix Variations</h2>
      <p><br></p>
      <h2>13. Clear Space Spacing Rules</h2>
      <p><br></p>
      <h2>14. Concept Deck Presentation</h2>
      <p><br></p>
      <h2>15. Final File Delivery Package</h2>
      <p><br></p>
    `
  },
  {
    id: 'full-branding',
    name: '22-Step Full Branding',
    description: 'Complete 22-step brand strategy and identity architecture.',
    clientType: 'Any',
    defaultStages: [
      { id: 'research', label: 'Research & Strategy' },
      { id: 'concepts', label: 'Concepts & Sketching' },
      { id: 'refinement', label: 'Design & Refinement' },
      { id: 'expansion', label: 'System Expansion' },
      { id: 'delivery', label: 'Presentation & Delivery' }
    ],
    defaultTasks: [
      { title: 'Client Intake & Brief', stageId: 'research' },
      { title: 'Competitor Research', stageId: 'research' },
      { title: 'Target Audience Profile', stageId: 'research' },
      { title: 'Brand Positioning Scales', stageId: 'research' },
      { title: 'Style Direction — Mood Boards', stageId: 'concepts' },
      { title: 'Client Direction Lockup', stageId: 'concepts' },
      { title: 'Word Mapping & Brainstorm', stageId: 'concepts' },
      { title: 'Thumbnail Sketching', stageId: 'concepts' },
      { title: 'Vectorize Concepts', stageId: 'refinement' },
      { title: 'Typography Pairings Study', stageId: 'refinement' },
      { title: 'Color Palette System', stageId: 'refinement' },
      { title: 'Logo Matrix Variations', stageId: 'refinement' },
      { title: 'Clear Space Spacing Rules', stageId: 'refinement' },
      { title: 'Brand Language & Voice', stageId: 'expansion' },
      { title: 'Photo Style Rules', stageId: 'expansion' },
      { title: 'Supporting Brand Assets', stageId: 'expansion' },
      { title: 'Concept Deck Presentation', stageId: 'delivery' },
      { title: 'Full Identity Presentation', stageId: 'delivery' },
      { title: 'Branding Guidelines Manual', stageId: 'delivery' },
      { title: 'Collateral Applications', stageId: 'delivery' },
      { title: 'Final System Delivery', stageId: 'delivery' }
    ],
    canvasTemplate: `
      <h2>1. Client Intake & Brief</h2>
      <p><br></p>
      <h2>2. Competitor Research</h2>
      <p><br></p>
      <h2>3. Target Audience Profile</h2>
      <p><br></p>
      <h2>4. Brand Positioning Scales</h2>
      <p><br></p>
      <h2>5. Style Direction — Mood Boards</h2>
      <p><br></p>
      <h2>6. Client Direction Lockup</h2>
      <p><br></p>
      <h2>7. Word Mapping & Brainstorm</h2>
      <p><br></p>
      <h2>8. Thumbnail Sketching</h2>
      <p><br></p>
      <h2>9. Vectorize Concepts</h2>
      <p><br></p>
      <h2>10. Typography Pairings Study</h2>
      <p><br></p>
      <h2>11. Color Palette System</h2>
      <p><br></p>
      <h2>12. Logo Matrix Variations</h2>
      <p><br></p>
      <h2>13. Clear Space Spacing Rules</h2>
      <p><br></p>
      <h2>14. Concept Deck Presentation</h2>
      <p><br></p>
      <h2>15. Final File Delivery Package</h2>
      <p><br></p>
      <h2>16. Brand Language & Voice</h2>
      <p><br></p>
      <h2>17. Photo Style Rules</h2>
      <p><br></p>
      <h2>18. Supporting Brand Assets</h2>
      <p><br></p>
      <h2>19. Full Identity Presentation</h2>
      <p><br></p>
      <h2>20. Branding Guidelines Manual</h2>
      <p><br></p>
      <h2>21. Collateral Applications</h2>
      <p><br></p>
      <h2>22. Final System Delivery</h2>
      <p><br></p>
    `
  },
  {
    id: 'branding-package',
    name: 'Brand Strategy & Identity (Original)',
    description: 'Full brand strategy, visual identity, and guidelines.',
    clientType: 'Startup / SMB',
    defaultStages: [
      { id: 'discovery', label: 'Discovery & Strategy' },
      { id: 'concepts', label: 'Visual Concepts' },
      { id: 'refinement', label: 'Refinement' },
      { id: 'delivery', label: 'Guidelines & Delivery' }
    ],
    defaultTasks: [
      { title: 'Brand Questionnaire', stageId: 'discovery' },
      { title: 'Competitor Analysis', stageId: 'discovery' },
      { title: 'Moodboard Concepts', stageId: 'concepts' },
      { title: 'Logo Drafting', stageId: 'concepts' },
      { title: 'Color & Typography Selection', stageId: 'refinement' },
      { title: 'Final Brand Guidelines PDF', stageId: 'delivery' },
    ],
    canvasTemplate: MOODBOARD_TEMPLATES.find(t => t.id === 'agency-onboarding')?.content || ''
  }
];

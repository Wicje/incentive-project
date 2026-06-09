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
      <h1>Logo Architecture</h1>
      <p>A standardized 15-step process for focused logo design and delivery.</p>
      <hr>

      <h2>Logo Concepting</h2>

      <h3>Word Mapping</h3>
      <p><em>Brainstorm key concepts, synonyms, and visual metaphors associated with the brand core identity.</em></p>
      <ul>
        <li>Trust</li>
        <li>Speed</li>
        <li>Innovation</li>
        <li>Growth</li>
        <li>Security</li>
      </ul>
      <p><br></p>

      <h3>Mood Boards & Style Direction</h3>
      <p><em>Compile references to establish the visual language before sketching.</em></p>
      <p>[Insert Image References Here]</p>
      <p><br></p>

      <h2>Execution Guidelines</h2>

      <h3>Typography Setup</h3>
      <p><em>Primary and secondary font families for logotype and descriptor.</em></p>
      <p><strong>Primary Serif:</strong> Playfair Display</p>
      <p><strong>Secondary Sans:</strong> Inter</p>
      <p><br></p>

      <h3>Clear Space</h3>
      <p><em>Define the minimum breathing room around the logo mark.</em></p>
      <p>Minimum 1x height of the logomark symbol on all sides.</p>
      <p><br></p>

      <h2>The 15-Step Process Checklist</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false">1. Client Intake & Brief</li>
        <li data-type="taskItem" data-checked="false">2. Competitor Research</li>
        <li data-type="taskItem" data-checked="false">3. Target Audience Profile</li>
        <li data-type="taskItem" data-checked="false">4. Brand Positioning Scales</li>
        <li data-type="taskItem" data-checked="false">5. Style Direction — Mood Boards</li>
        <li data-type="taskItem" data-checked="false">6. Client Direction Lockup</li>
        <li data-type="taskItem" data-checked="false">7. Word Mapping & Brainstorm</li>
        <li data-type="taskItem" data-checked="false">8. Thumbnail Sketching</li>
        <li data-type="taskItem" data-checked="false">9. Vectorize Concepts</li>
        <li data-type="taskItem" data-checked="false">10. Typography Pairings Study</li>
        <li data-type="taskItem" data-checked="false">11. Color Palette System</li>
        <li data-type="taskItem" data-checked="false">12. Logo Matrix Variations</li>
        <li data-type="taskItem" data-checked="false">13. Clear Space Spacing Rules</li>
        <li data-type="taskItem" data-checked="false">14. Concept Deck Presentation</li>
        <li data-type="taskItem" data-checked="false">15. Final File Delivery Package</li>
      </ul>
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
      <h1>Full Branding Architecture</h1>
      <p>A standardized 22-step process for complete brand identity systems.</p>
      <hr>
      <h2>Brand Strategy</h2>
      <h3>1. Vision Statement</h3>
      <p><em>Your vision is your why and the long-term vision for your work. A vision statement is all about where you want to go.</em></p>
      <p><strong>Write your vision statement:</strong></p>
      <blockquote>Example — To be a leading freelance graphic designer recognized for my innovative designs that inspire and engage audiences...</blockquote>
      <p><br></p>
      <h3>2. Mission Statement</h3>
      <p><em>Your mission is what you do and how you're going to do it. Focused on the present.</em></p>
      <p><strong>Write your mission statement:</strong></p>
      <blockquote>Example — I am committed to delivering high-quality design solutions that help my clients achieve their goals.</blockquote>
      <p><br></p>
      <h3>3. Brand Personality</h3>
      <p><em>Brand personality is like the personality of a person, but for a brand.</em></p>
      <p><strong>Write your brand values:</strong></p>
      <ul>
        <li>Innovative</li>
        <li>Authentic</li>
        <li>Creative</li>
      </ul>
      <p><br></p>
      <h2>Visual Guide</h2>
      <h3>Color Palette</h3>
      <ul>
        <li><strong>Primary 1:</strong> #EAD3D0</li>
        <li><strong>Primary 2:</strong> #EBE2DC</li>
        <li><strong>Secondary:</strong> #D6C0A6</li>
      </ul>
      <p><br></p>
      <h2>The 22-Step Process Checklist</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="false">1. Client Intake & Brief</li>
        <li data-type="taskItem" data-checked="false">2. Competitor Research</li>
        <li data-type="taskItem" data-checked="false">3. Target Audience Profile</li>
        <li data-type="taskItem" data-checked="false">4. Brand Positioning Scales</li>
        <li data-type="taskItem" data-checked="false">5. Style Direction — Mood Boards</li>
        <li data-type="taskItem" data-checked="false">6. Client Direction Lockup</li>
        <li data-type="taskItem" data-checked="false">7. Word Mapping & Brainstorm</li>
        <li data-type="taskItem" data-checked="false">8. Thumbnail Sketching</li>
        <li data-type="taskItem" data-checked="false">9. Vectorize Concepts</li>
        <li data-type="taskItem" data-checked="false">10. Typography Pairings Study</li>
        <li data-type="taskItem" data-checked="false">11. Color Palette System</li>
        <li data-type="taskItem" data-checked="false">12. Logo Matrix Variations</li>
        <li data-type="taskItem" data-checked="false">13. Clear Space Spacing Rules</li>
        <li data-type="taskItem" data-checked="false">14. Concept Deck Presentation</li>
        <li data-type="taskItem" data-checked="false">15. Final File Delivery Package</li>
        <li data-type="taskItem" data-checked="false">16. Brand Language & Voice</li>
        <li data-type="taskItem" data-checked="false">17. Photo Style Rules</li>
        <li data-type="taskItem" data-checked="false">18. Supporting Brand Assets</li>
        <li data-type="taskItem" data-checked="false">19. Full Identity Presentation</li>
        <li data-type="taskItem" data-checked="false">20. Branding Guidelines Manual</li>
        <li data-type="taskItem" data-checked="false">21. Collateral Applications</li>
        <li data-type="taskItem" data-checked="false">22. Final System Delivery</li>
      </ul>
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

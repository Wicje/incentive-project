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
    id: 'branding-package',
    name: 'Brand Strategy & Identity',
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

export const END_POINT = "https://serene-dusk-06867.herokuapp.com";
export const USER_ID = "1234";

export const DASHBOARD_LABELS_LIST = [
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATIN"
]

export const RATINGS_LABELS = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platin"
}

export const RATINGS_RATE = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
}

export const RATINGS = [{
    id: 1,
    rate: RATINGS_RATE.BRONZE,
    icon: "1",
    label: RATINGS_LABELS.BRONZE,
  },
  {
    id: 2,
    rate: RATINGS_RATE.SILVER,
    icon: "2",
    label: RATINGS_LABELS.SILVER,
  },
  {
    id: 3,
    rate: RATINGS_RATE.GOLD,
    icon: "3",
    label: RATINGS_LABELS.GOLD,
  },
  {
    id: 4,
    rate: RATINGS_RATE.PLATINUM,
    icon: "4",
    label: RATINGS_LABELS.PLATINUM,
  },
];

export const SECTIONS = [{
    id: 6,
    order: 6,
    key: "happiness",
    title: "Happiness",
  },
  {
    id: 1,
    order: 1,
    key: "skills",
    title: "Skills",
  },
  {
    id: 2,
    order: 2,
    key: "quality",
    title: "Quality",
  },
  {
    id: 4,
    order: 4,
    key: "productivity",
    title: "Productivity",
  },
  {
    id: 5,
    order: 5,
    key: "communication",
    title: "Communication",
  },
  {
    id: 7,
    order: 7,
    key: "engagement",
    title: "Engagement",
  }
];

export const PROJECTS = [{
    id: '1',
    name: "Project 1"
  },
  {
    id: '2',
    name: "Project 2"
  },
  {
    id: '3',
    name: "Project 3"
  },
  {
    id: '4',
    name: "Project 4"
  },
];

export const QUESTIONS = {
  skills: [{
      id: 1,
      order: 1,
      text: "Your evaluation about coding skill of Vietnam team ?",
    },
    {
      id: 2,
      order: 2,
      text: "Your evaluation about technical knowledge of Vietnam team ?",
    },
  ],
  quality: [{
      id: 3,
      order: 1,
      text: "Your evalutaion about estimation capability of Vietnam team ?",
    },
    {
      id: 4,
      order: 2,
      text: "Your evalutaion about quality of deliverables from Vietnam team ?",
    },
  ],
  understanding: [{
    id: 5,
    order: 1,
    text: "How satisfied are you with team's understand about business ?",
  }, ],
  productivity: [{
    id: 7,
    order: 1,
    text: "Your evalutaion about performance of Vietnam team ?",
  }, ],
  communication: [{
    id: 8,
    order: 1,
    text: "Your evalutaion about communication efficiency of Vietnam team ?",
  }, ],
  happiness: [{
    id: 9,
    order: 1,
    text: "Your overall satisfaction about Vietnam team ?",
  }, ],
  engagement: [{
      id: 10,
      order: 1,
      text: "Your evalutaion about commitment of Vietnam team ?",
    },
    {
      id: 11,
      order: 1,
      text: "Your evalutaion about integration capability of Vietnam team ?",
    },
  ]
};

export const DASHBOARD_SECTION_ID = {
  OVERVIEW: 'dashboard-section-overview',
  COMPARISON: 'dashboard-section-comparison',
  HISTORY: 'dashboard-section-history',
}

export const DASHBOARD_SECTIONS = [{
    id: DASHBOARD_SECTION_ID.OVERVIEW,
    label: 'dashboard.section.overview'
  },
  {
    id: DASHBOARD_SECTION_ID.COMPARISON,
    label: 'dashboard.section.comparison'
  },
  {
    id: DASHBOARD_SECTION_ID.HISTORY,
    label: 'dashboard.section.history'
  }
]

export const FEEDBACK_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED"
}

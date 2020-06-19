export const END_POINT = "https://serene-dusk-06867.herokuapp.com";
export const USER_ID = "1234";

export const DASHBOARD_LABELS_LIST = ["BRONZE", "SILVER", "GOLD", "PLATIN"];

export const DASHBOARD_PIE_COLORS = [
  "#cd7f32 ",
  "#aaa9ad",
  "#faf369",
  "#e5e4e2"
];

export const RATINGS_LABELS = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platin"
};

export const RATINGS_RATE = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4
};

export const RATINGS = [
  {
    id: 1,
    rate: RATINGS_RATE.BRONZE,
    icon: "1",
    label: RATINGS_LABELS.BRONZE
  },
  {
    id: 2,
    rate: RATINGS_RATE.SILVER,
    icon: "2",
    label: RATINGS_LABELS.SILVER
  },
  {
    id: 3,
    rate: RATINGS_RATE.GOLD,
    icon: "3",
    label: RATINGS_LABELS.GOLD
  },
  {
    id: 4,
    rate: RATINGS_RATE.PLATINUM,
    icon: "4",
    label: RATINGS_LABELS.PLATINUM
  }
];

export const DASHBOARD_SECTION_ID = {
  OVERVIEW: "dashboard-section-overview",
  COMPARISON: "dashboard-section-comparison",
  HISTORY: "dashboard-section-history"
};

export const DASHBOARD_SECTIONS = [
  {
    id: DASHBOARD_SECTION_ID.OVERVIEW,
    label: "dashboard.section.overview"
  },
  {
    id: DASHBOARD_SECTION_ID.COMPARISON,
    label: "dashboard.section.comparison"
  },
  {
    id: DASHBOARD_SECTION_ID.HISTORY,
    label: "dashboard.section.history"
  }
];

export const FEEDBACK_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED"
};

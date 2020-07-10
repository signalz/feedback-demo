// export const END_POINT = "https://serene-dusk-06867.herokuapp.com";
export const END_POINT = "https://ngocsonzz-feedback-demo.herokuapp.com";
// export const END_POINT = "http://localhost:3000"

export const ROLE_ADMIN = "ADMIN";

export const SCREEN_BREAK_POINTS_DEFINITION = {
  xxs: "xxs",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl"
};

export const SCREEN_BREAK_POINTS_VALUE = {
  xxs: 360,
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: Infinity
};

export const DASHBOARD_LABELS_LIST = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

export const DASHBOARD_PIE_COLORS = [
  "#cd7f32 ",
  "#aaa9ad",
  "#faf369",
  "#76bbe8"
];

export const RATINGS_LABELS = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum"
};

export const RATINGS_RATE = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4
};

export const RATINGS = [
  {
    rating: RATINGS_RATE.BRONZE,
    label: RATINGS_LABELS.BRONZE
  },
  {
    rating: RATINGS_RATE.SILVER,
    label: RATINGS_LABELS.SILVER
  },
  {
    rating: RATINGS_RATE.GOLD,
    label: RATINGS_LABELS.GOLD
  },
  {
    rating: RATINGS_RATE.PLATINUM,
    label: RATINGS_LABELS.PLATINUM
  }
];

export const FEEDBACK_STATE = {
  NO_FEEDBACK: "no-feedback",
  LAST_FEEDBACK: "last-feedback",
  NEW_FEEDBACK: "new-feedback"
};

export const DEFAULT = "default";

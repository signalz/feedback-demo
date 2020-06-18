import { RATINGS_LABELS } from '../config'

export function getIconImgSrc(type) {
  switch (type) {
    case RATINGS_LABELS.BRONZE:
      return require("../assets/bronze.png");
    case RATINGS_LABELS.SILVER:
      return require("../assets/silver.png");
    case RATINGS_LABELS.GOLD:
      return require("../assets/gold.png");
    case RATINGS_LABELS.PLATINUM:
      return require("../assets/platinum.png");
  }
}

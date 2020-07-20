import { message } from 'ant-design-vue'

import { RATINGS_LABELS, UNAUTHORIZED_CODE } from "../config";

export function getIconImgSrc(type, selected) {
  switch (type) {
    case RATINGS_LABELS.BRONZE:
      if (selected) {
        return require("../assets/bronze-selected.png");
      }
      return require("../assets/bronze.png");
    case RATINGS_LABELS.SILVER:
      if (selected) {
        return require("../assets/silver-selected.png");
      }
      return require("../assets/silver.png");
    case RATINGS_LABELS.GOLD:
      if (selected) {
        return require("../assets/gold-selected.png");
      }
      return require("../assets/gold.png");
    case RATINGS_LABELS.PLATINUM:
      if (selected) {
        return require("../assets/platinum-selected.png");
      }
      return require("../assets/platinum.png");
  }
}

export function handleError(err, router, errorMessage) {
  // "Your session is expired. Please login again!"
  if (err.response && err.response.status === UNAUTHORIZED_CODE) {
    router.push("/login");
    message.error(errorMessage);
  } else {
    message.error(err.message)
  }
}

export function getIconImgSrc(type, selected) {
  switch (type) {
    case "1":
      if (selected) {
        return require("../assets/icons/bronze-medal-selected.png");
      } else {
        return require("../assets/icons/bronze-medal.png");
      }
    case "2":
      if (selected) {
        return require("../assets/icons/silver-medal-selected.png");
      } else {
        return require("../assets/icons/silver-medal.png");
      }
    case "3":
      if (selected) {
        return require("../assets/icons/gold-medal-selected.png");
      } else {
        return require("../assets/icons/gold-medal.png");
      }
    case "4":
      if (selected) {
        return require("../assets/icons/trophy-selected.png");
      } else {
        return require("../assets/icons/trophy.png");
      }
  }
}

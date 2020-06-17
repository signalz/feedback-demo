export function getIconImgSrc(type) {
  switch (type) {
    case "1":
      return require("../assets/bronze.png");
    case "2":
      return require("../assets/silver.png");
    case "3":
      return require("../assets/gold.png");
    case "4":
      return require("../assets/platinum.png");
  }
}

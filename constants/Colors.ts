const tintColorLight = "#ec4c60";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    contrastText: "#f0f0f0",
    back1: "#fff", // 纯白
    back2: "#f5f5f5", //灰一点的白
    border1: "#d5d5d5",
    mainColor: "rgb(236, 76, 96)",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#f0f0f0",
    contrastText: "#000",
    back1: "#222",
    back2: "#111",
    border1: "#333",
    mainColor: "rgb(236, 76, 96)",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

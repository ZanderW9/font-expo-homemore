const tintColorLight = "#ec4c60";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    textReverse: "#f0f0f0",
    textSub1: "#666",
    textSub1Reverse: "#999",
    back1: "#fff", // 纯白
    back2: "#f5f5f5", //灰一点的白
    border1: "rgba(0,0,0,0.1)", // 灰色边框
    mainColor: "rgb(236, 76, 96)",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#f0f0f0",
    textReverse: "#000",
    textSub1: "#999",
    textSub1Reverse: "#666",
    back1: "#222",
    back2: "#111",
    border1: "rgba(255,255,255,0.1)",
    mainColor: "rgb(236, 76, 96)",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

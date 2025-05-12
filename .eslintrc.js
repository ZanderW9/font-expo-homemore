module.exports = {
  root: true,
  extends: ["universe/native", "prettier"],
  rules: {
    "linebreak-style": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-undef": "error",
  },
};

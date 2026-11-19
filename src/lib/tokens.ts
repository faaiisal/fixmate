import designTokens from "@/styles/design-tokens.json";

export const tokens = designTokens;

export const brand = {
  primary: "#F26A36",
  hover: "#E05824",
  active: "#C94B1B",
  container: "#FFF1EC",
  onPrimary: "#FFFFFF",
};

export const surface = {
  default: "#FCF9F8",
  dim: "#DCD9D9",
  card: "#FFFFFF",
  low: "#F6F3F2",
  base: "#EFECEB",
  high: "#E8E4E3",
  highest: "#DED9D8",
  border: "#E5E0DF",
  borderStrong: "#C4C0C0",
};

export const text = {
  primary: "#14121B",
  secondary: "#55595F",
  tertiary: "#8C9098",
};

export const semantic = {
  success: "#10B981",
  successContainer: "#ECFDF5",
  info: "#00C4D6",
  infoContainer: "#E6FCFD",
  warning: "#F59E0B",
  warningContainer: "#FFFBEB",
  error: "#EF4444",
  errorContainer: "#FEF2F2",
  purple: "#8B5CF6",
  purpleContainer: "#F5F3FF",
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

export const radii = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
};

export const elevation = {
  low: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
  card: "0 2px 8px -2px rgba(20, 18, 27, 0.05), 0 1px 3px -1px rgba(20, 18, 27, 0.03)",
  modal: "0 20px 40px -15px rgba(20, 18, 27, 0.12), 0 0 0 1px rgba(20, 18, 27, 0.05)",
  glow: "0 8px 24px -4px rgba(242, 106, 54, 0.25)",
};

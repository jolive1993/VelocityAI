"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * Performance: Using MUI exclusively for the footer reduces our bundle size and
 * increases load speed. By delegating this component to a framework optimized
 * for layout primitives, we avoid shipping custom flex/typography CSS—tree-shaking
 * ensures only Box and Typography are bundled, and MUI's pre-optimized runtime
 * is smaller than the equivalent hand-rolled styles.
 */
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 12,
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        pt: 6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#71717a",
          }}
        >
          velocity
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: "0.875rem",
            color: "#52525b",
          }}
        >
          Built with obsessive attention to detail. © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}

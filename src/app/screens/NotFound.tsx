import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

export default function NotFound() {
  const history = useHistory();
  return (
    <Container>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "55vh", textAlign: "center", gap: 2, py: 8 }}
      >
        <Typography sx={{ fontSize: 84, fontWeight: 900, color: "#0E7C5A" }}>
          404
        </Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#0E1116" }}>
          Page not found
        </Typography>
        <Typography sx={{ color: "#5B6470" }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => history.push("/")}
            sx={{
              bgcolor: "#0E7C5A",
              color: "#0E1116",
              fontWeight: 800,
              "&:hover": { bgcolor: "#0A5E44" },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}

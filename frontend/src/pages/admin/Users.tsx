import { Container, Typography, Paper, Box } from '@mui/material';

export default function Users() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users Management
        </Typography>
        <Box>
          {/* User list will be added here */}
          <Typography>User list coming soon...</Typography>
        </Box>
      </Paper>
    </Container>
  );
} 
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cleaning Service
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user.role === UserRole.Admin ? (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/users')}>
                Users
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/services')}>
                Services
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/orders')}>
                Orders
              </Button>
              <Button color="inherit" onClick={() => navigate('/admin/reviews')}>
                Reviews
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/services')}>
                Services
              </Button>
              <Button color="inherit" onClick={() => navigate('/orders')}>
                My Orders
              </Button>
              <Button color="inherit" onClick={() => navigate('/reviews')}>
                Reviews
              </Button>
            </>
          )}
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 
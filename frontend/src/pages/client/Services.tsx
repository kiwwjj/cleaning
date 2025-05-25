import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  TextField,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesService } from '../../services/services.service';
import { ordersService } from '../../services/orders.service';
import type { CreateOrderInput } from '../../types';

export default function Services() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [squares, setSquares] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderInput) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setOpenDialog(false);
      setSelectedService(null);
      setSquares('');
    },
  });

  const handleCreateOrder = (serviceId: number) => {
    setSelectedService(serviceId);
    setOpenDialog(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService) return;

    const data: CreateOrderInput = {
      service_id: selectedService,
      order_date: new Date().toISOString(),
      status: 'pending',
      ...(squares && { squares: Number(squares) }),
    };

    createOrderMutation.mutate(data);
  };

  const selectedServiceData = services?.find(s => s.id === selectedService);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading services</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Services
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {services?.map((service) => (
          <Card key={service.id}>
            <CardContent>
              <Typography variant="h6" component="h2">
                {service.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Base Price: ${service.price}
              </Typography>
              {service.price_per_square_meter > 0 && (
                <Typography color="text.secondary" gutterBottom>
                  Price per m²: ${service.price_per_square_meter}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {service.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary"
                onClick={() => handleCreateOrder(service.id)}
              >
                Order Now
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create Order</DialogTitle>
          <DialogContent>
            {createOrderMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to create order
              </Alert>
            )}
            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              {selectedServiceData?.price_per_square_meter && selectedServiceData.price_per_square_meter > 0 
                ? 'Enter the area in square meters to calculate the total price'
                : 'Are you sure you want to order this service?'}
            </Typography>
            {selectedServiceData?.price_per_square_meter && selectedServiceData.price_per_square_meter > 0 && (
              <TextField
                autoFocus
                margin="dense"
                label="Square Meters"
                type="number"
                fullWidth
                value={squares}
                onChange={(e) => setSquares(e.target.value)}
                inputProps={{ min: 1, step: 0.1 }}
              />
            )}
            {squares && selectedServiceData?.price_per_square_meter && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Estimated total: ${((selectedServiceData?.price_per_square_meter || 0) * Number(squares)).toFixed(2)}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={createOrderMutation.isPending || (selectedServiceData?.price_per_square_meter > 0 && !squares)}
            >
              Confirm Order
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
} 
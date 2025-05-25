import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../../services/orders.service';
import { servicesService } from '../../services/services.service';
import type { Order, CreateOrderInput, UpdateOrderInput, Service } from '../../types';

const ORDER_STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  });

  const { data: services = [], isLoading: isServicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ordersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsCreateDialogOpen(false);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderInput }) =>
      ordersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsEditDialogOpen(false);
      setSelectedOrder(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ordersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleCreate = (data: CreateOrderInput) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: UpdateOrderInput) => {
    if (selectedOrder) {
      updateMutation.mutate({ id: selectedOrder.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedOrder) {
      deleteMutation.mutate(selectedOrder.id);
    }
  };

  if (isOrdersLoading || isServicesLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Orders Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Add Order
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.User ? `${order.User.name} (${order.User.id})` : 'N/A'}</TableCell>
                  <TableCell>{order.Service?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogContent>
            <OrderForm
              services={services}
              onSubmit={handleCreate}
              isEdit={false}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogContent>
            <OrderForm
              services={services}
              initialData={selectedOrder}
              onSubmit={handleUpdate}
              isEdit={true}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this order? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

interface OrderFormProps {
  services: Service[];
  initialData?: Order | null;
  onSubmit: (data: CreateOrderInput | UpdateOrderInput) => void;
  isEdit?: boolean;
}

function OrderForm({ services, initialData, onSubmit, isEdit = false }: OrderFormProps) {
  const [formData, setFormData] = useState<CreateOrderInput>({
    service_id: initialData?.service_id || 0,
    order_date: initialData?.order_date ? new Date(initialData.order_date).toISOString().split('T')[0] : '',
    status: initialData?.status || 'Pending',
    squares: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      // For updates, only send changed fields
      const updateData: UpdateOrderInput = {};
      if (formData.service_id !== initialData?.service_id) updateData.service_id = formData.service_id;
      if (formData.order_date !== initialData?.order_date) updateData.order_date = formData.order_date;
      if (formData.status !== initialData?.status) updateData.status = formData.status;
      if (formData.squares !== 0) updateData.squares = formData.squares;
      onSubmit(updateData);
    } else {
      // For create, send all fields
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        select
        fullWidth
        label="Service"
        value={formData.service_id}
        onChange={(e) => setFormData({ ...formData, service_id: Number(e.target.value) })}
        required
      >
        {services.map((service) => (
          <MenuItem key={service.id} value={service.id}>
            {service.name} - ${service.price}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        label="Order Date"
        type="date"
        value={formData.order_date}
        onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
        required
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        select
        fullWidth
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        required
      >
        {ORDER_STATUSES.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      {!isEdit && (
        <TextField
          fullWidth
          label="Square Meters"
          type="number"
          value={formData.squares}
          onChange={(e) => setFormData({ ...formData, squares: Number(e.target.value) })}
          InputProps={{
            endAdornment: 'm²',
          }}
        />
      )}
      <DialogActions>
        <Button onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Box>
  );
} 
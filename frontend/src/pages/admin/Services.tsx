import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { servicesService } from '../../services/services.service';
import type { Service, CreateServiceInput, UpdateServiceInput } from '../../types';

export default function Services() {
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: servicesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsCreateDialogOpen(false);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceInput }) =>
      servicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsEditDialogOpen(false);
      setSelectedService(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: servicesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleCreate = (data: CreateServiceInput | UpdateServiceInput) => {
    if ('name' in data && 'price' in data && 'price_per_square_meter' in data && 'additional_options' in data) {
      createMutation.mutate(data as CreateServiceInput);
    }
  };

  const handleUpdate = (data: CreateServiceInput | UpdateServiceInput) => {
    if (selectedService) {
      updateMutation.mutate({ id: selectedService.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService.id);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Services Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Add Service
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
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Price per m²</TableCell>
                <TableCell>Additional Options</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>${service.price_per_square_meter}/m²</TableCell>
                  <TableCell>{service.additional_options}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedService(service);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedService(service);
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
          <DialogTitle>Add New Service</DialogTitle>
          <DialogContent>
            <ServiceForm onSubmit={handleCreate} isEdit={false} />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogContent>
            <ServiceForm
              initialData={selectedService}
              onSubmit={handleUpdate}
              isEdit={true}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this service? This action cannot be undone.
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

interface ServiceFormProps {
  initialData?: Service | null;
  onSubmit: (data: CreateServiceInput | UpdateServiceInput) => void;
  isEdit?: boolean;
}

function ServiceForm({ initialData, onSubmit, isEdit = false }: ServiceFormProps) {
  const [formData, setFormData] = useState<CreateServiceInput>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    price_per_square_meter: initialData?.price_per_square_meter || 0,
    additional_options: initialData?.additional_options || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      // For updates, only send changed fields
      const updateData: UpdateServiceInput = {};
      if (formData.name !== initialData?.name) updateData.name = formData.name;
      if (formData.description !== initialData?.description) updateData.description = formData.description;
      if (formData.price !== initialData?.price) updateData.price = formData.price;
      if (formData.price_per_square_meter !== initialData?.price_per_square_meter) {
        updateData.price_per_square_meter = formData.price_per_square_meter;
      }
      if (formData.additional_options !== initialData?.additional_options) {
        updateData.additional_options = formData.additional_options;
      }
      onSubmit(updateData);
    } else {
      // For create, send all fields
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        multiline
        rows={3}
      />
      <TextField
        fullWidth
        label="Price"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
        required
        InputProps={{
          startAdornment: '$',
        }}
      />
      <TextField
        fullWidth
        label="Price per Square Meter"
        type="number"
        value={formData.price_per_square_meter}
        onChange={(e) =>
          setFormData({ ...formData, price_per_square_meter: Number(e.target.value) })
        }
        required
        InputProps={{
          startAdornment: '$',
          endAdornment: '/m²',
        }}
      />
      <TextField
        fullWidth
        label="Additional Options"
        value={formData.additional_options}
        onChange={(e) =>
          setFormData({ ...formData, additional_options: e.target.value })
        }
        required
        multiline
        rows={3}
      />
      <DialogActions>
        <Button onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Box>
  );
} 
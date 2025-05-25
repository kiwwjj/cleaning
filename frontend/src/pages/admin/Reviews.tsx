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
  Rating,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '../../services/reviews.service';
import { servicesService } from '../../services/services.service';
import type { Review, CreateReviewInput, UpdateReviewInput, Service } from '../../types';

export default function Reviews() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: reviewsService.getAll,
  });

  const { data: services = [], isLoading: isServicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: reviewsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsCreateDialogOpen(false);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReviewInput }) =>
      reviewsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsEditDialogOpen(false);
      setSelectedReview(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: reviewsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsDeleteDialogOpen(false);
      setSelectedReview(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleCreate = (data: CreateReviewInput | UpdateReviewInput) => {
    if ('service_id' in data && 'rating' in data && 'comment' in data) {
      createMutation.mutate(data as CreateReviewInput);
    }
  };

  const handleUpdate = (data: CreateReviewInput | UpdateReviewInput) => {
    if (selectedReview) {
      updateMutation.mutate({ id: selectedReview.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedReview) {
      deleteMutation.mutate(selectedReview.id);
    }
  };

  if (isReviewsLoading || isServicesLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Reviews Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Add Review
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
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.User ? `${review.User.name} (${review.User.id})` : 'N/A'}</TableCell>
                  <TableCell>{review.Service?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly />
                  </TableCell>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedReview(review);
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
          <DialogTitle>Add New Review</DialogTitle>
          <DialogContent>
            <ReviewForm services={services} onSubmit={handleCreate} isEdit={false} />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent>
            <ReviewForm
              services={services}
              initialData={selectedReview}
              onSubmit={handleUpdate}
              isEdit={true}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>Delete Review</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this review? This action cannot be undone.
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

interface ReviewFormProps {
  services: Service[];
  initialData?: Review | null;
  onSubmit: (data: CreateReviewInput | UpdateReviewInput) => void;
  isEdit?: boolean;
}

function ReviewForm({ services, initialData, onSubmit, isEdit = false }: ReviewFormProps) {
  const [formData, setFormData] = useState<CreateReviewInput>({
    service_id: initialData?.service_id || 0,
    rating: initialData?.rating || 0,
    comment: initialData?.comment || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      // For updates, only send changed fields
      const updateData: UpdateReviewInput = {};
      if (formData.service_id !== initialData?.service_id) updateData.service_id = formData.service_id;
      if (formData.rating !== initialData?.rating) updateData.rating = formData.rating;
      if (formData.comment !== initialData?.comment) updateData.comment = formData.comment;
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
            {service.name}
          </MenuItem>
        ))}
      </TextField>
      <Box>
        <Typography component="legend">Rating</Typography>
        <Rating
          value={formData.rating}
          onChange={(_, value) => setFormData({ ...formData, rating: value || 0 })}
        />
      </Box>
      <TextField
        fullWidth
        label="Comment"
        value={formData.comment}
        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
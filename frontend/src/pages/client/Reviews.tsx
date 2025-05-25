import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Rating,
  TextField,
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsService } from '../../services/reviews.service';
import { servicesService } from '../../services/services.service';
import type { CreateReviewInput } from '../../types';

export default function Reviews() {
  const [openDialog, setOpenDialog] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['reviews'],
    queryFn: reviewsService.getAll,
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesService.getAll,
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setOpenDialog(false);
      setRating(null);
      setComment('');
      setSelectedService(null);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService || !rating) return;

    const data: CreateReviewInput = {
      service_id: selectedService,
      rating,
      comment,
    };

    createReviewMutation.mutate(data);
  };

  if (reviewsLoading || servicesLoading) return <Typography>Loading...</Typography>;
  if (reviewsError) return <Typography color="error">Error loading reviews</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Reviews
        </Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Write a Review
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.Service?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly />
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.User?.name || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogContent>
            {createReviewMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to create review
              </Alert>
            )}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                label="Service"
                value={selectedService || ''}
                onChange={(e) => setSelectedService(Number(e.target.value))}
                required
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select a service</option>
                {services?.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </TextField>

              <Box>
                <Typography component="legend">Rating</Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                />
              </Box>

              <TextField
                label="Comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={createReviewMutation.isPending || !selectedService || !rating || !comment}
            >
              Submit Review
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
} 
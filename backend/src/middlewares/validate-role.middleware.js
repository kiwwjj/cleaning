export const validateRole = (role = 'Admin') => {
  return (request, response, next) => {
    const user = request.user;

    const userRole = user.role;

    if (role === userRole) {
      next();
      return;
    }

    return response.status(403).json({ message: 'Forbidden' })
  }
}
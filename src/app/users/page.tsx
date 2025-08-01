'use client';

import React from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { api } from '~/trpc/react';

export default function ViewUsersPage() {
    const { data: users, isLoading, error } = api.users.getAll.useQuery();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    React.useEffect(() => {
        if (error) setSnackbarOpen(true);
    }, [error]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
                User List
            </Typography>

            {isLoading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Skills</TableCell>
                                <TableCell>Experience</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.skills}</TableCell>
                                        <TableCell>{user.experience}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" variant="filled">
                    Failed to load users.
                </Alert>
            </Snackbar>
        </Container>
    );
}

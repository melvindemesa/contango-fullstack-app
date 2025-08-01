'use client';

import React, { useRef, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Stack,
    Paper,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { api } from '~/trpc/react';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function HomePage() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        skills: '',
        experience: '',
    });

    const [pdfPath, setPdfPath] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
        open: false,
        message: '',
        severity: 'info',
    });

    const createUser = api.users.create.useMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'cvFile' && files && files[0]) {
            uploadCV(files[0]);

            e.target.value = '';
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const uploadCV = async (file: File) => {
        setUploadStatus('uploading');
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fullName', form.fullName);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('skills', form.skills);
            formData.append('experience', form.experience);

            const res = await fetch('/api/upload-cv', {
                method: 'POST',
                body: formData,
            });

            const json = await res.json();
            if (!res.ok || !json.pdfPath) {
                throw new Error(json.message || 'Upload failed');
            }

            setPdfPath(json.pdfPath);
            setUploadStatus('success');
            setSnackbar({ open: true, message: 'CV uploaded successfully!', severity: 'success' });
        } catch (err: any) {
            setUploadStatus('error');
            setUploadError(err.message || 'Failed to upload CV');
            setSnackbar({ open: true, message: err.message || 'CV upload failed', severity: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('submitting');
        setSubmitError(null);

        if (!pdfPath) {
            setSubmitStatus('error');
            setSnackbar({ open: true, message: 'Please upload your CV first.', severity: 'error' });
            return;
        }

        try {
            await createUser.mutateAsync({
                ...form,
                pdfPath,
            });

            setSubmitStatus('success');
            setSnackbar({ open: true, message: 'Form submitted successfully!', severity: 'success' });
        } catch (err: any) {
            setSubmitStatus('error');
            setSubmitError(err.message || 'Submission failed');
            setSnackbar({ open: true, message: err.message || 'Form submission failed', severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: 2, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ p: 3, maxWidth: 640, width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Typography variant="h4" textAlign="center">Upload Your CV</Typography>

                        <TextField name="fullName" label="Full Name" value={form.fullName} onChange={handleChange} required />
                        <TextField name="email" label="Email" value={form.email} onChange={handleChange} required />
                        <TextField name="phone" label="Phone" value={form.phone} onChange={handleChange} required />
                        <TextField name="skills" label="Skills" value={form.skills} onChange={handleChange} required />
                        <TextField
                            name="experience"
                            label="Experience"
                            value={form.experience}
                            onChange={handleChange}
                            required
                            multiline
                            rows={3}
                        />

                        <input
                            ref={fileInputRef}
                            type="file"
                            name="cvFile"
                            accept="application/pdf"
                            hidden
                            onChange={handleChange}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadStatus === 'uploading'}
                            startIcon={<UploadFileIcon />}
                        >
                            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload CV (PDF)'}
                        </Button>
                    </Stack>
                    <Button fullWidth type="submit" variant="contained" disabled={uploadStatus !== 'success'} sx={{ mt: 5 }}>
                        Submit
                    </Button>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

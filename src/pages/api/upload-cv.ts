import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = formidable({ multiples: false, uploadDir: '/tmp', keepExtensions: true });

    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { fullName, email, phone, skills, experience } = fields;

    const uuid = uuidv4();
    const filename = `${uuid}-${file.originalFilename}`;
    const destFolder = path.join(process.cwd(), 'public', 'uploads');
    const destPath = path.join(destFolder, filename);

    await fs.mkdir(destFolder, { recursive: true });
    await fs.copyFile(file.filepath, destPath);

    //AI validation mocking for now since no available ai key
    const validated = true;

    if (!validated) {
        return res.status(400).json({
            success: false,
            message: 'Mock validation failed (should never happen in dev)',
        });
    }

    return res.status(200).json({
        success: true,
        pdfPath: `/uploads/${filename}`,
        formData: {
            fullName,
            email,
            phone,
            skills,
            experience,
        },
    });
}

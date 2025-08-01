import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import postgresdb from "../postgres";

export const userRouter = createTRPCRouter({

    create: publicProcedure
        .input(z.object({
            fullName: z.string().min(1),
            email: z.string().email(),
            phone: z.string().min(1),
            skills: z.string(),
            experience: z.string(),
            pdfPath: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { fullName, email, phone, skills, experience, pdfPath } = input;

            const result = await postgresdb.query(
                `INSERT INTO users (full_name, email, phone, skills, experience, pdf_path)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
                [fullName, email, phone, skills, experience, pdfPath]
            );

            return result.rows[0];
        }),

    getAll: publicProcedure.query(async () => {
        const result = await postgresdb.query(`SELECT * FROM users ORDER BY created_at DESC`);
        return result.rows;
    }),

    getLatest: publicProcedure.query(async () => {
        const result = await postgresdb.query(`SELECT * FROM users ORDER BY created_at DESC LIMIT 1`);
        return result.rows[0] ?? null;
    }),
});

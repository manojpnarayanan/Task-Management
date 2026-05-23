import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodIssue, ZodObject, ZodRawShape } from "zod";
import { HttpStatus } from '../constants/http-status';


export const validate = (schema: ZodObject<ZodRawShape>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message:error.issues[0].message,
                    errors: error.issues.map((issue: ZodIssue) => ({
                        path: issue.path.map(p => p.toString()).join('.'),
                        message: issue.message
                    }))
                });
            }
            next(error);
        }
    };

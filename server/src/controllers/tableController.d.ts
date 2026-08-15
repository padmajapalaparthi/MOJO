import { Request, Response } from 'express';
export declare const getTables: (req: Request, res: Response) => Promise<void>;
export declare const createTable: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTable: (req: Request, res: Response) => Promise<void>;
export declare const getAvailableTables: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=tableController.d.ts.map
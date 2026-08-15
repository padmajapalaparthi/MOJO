import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const addOrderItems: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getOrderById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyOrders: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getOrders: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createReservation: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMyReservations: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getReservations: (req: Request, res: Response) => Promise<void>;
export declare const updateReservationStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=reservationController.d.ts.map
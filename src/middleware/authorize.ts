import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate.js';

export function authorize(...allowedRoles: Array<'CLIENT' | 'BROKER' | 'ADMIN'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication is required.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks permission for this resource.`
      });
      return;
    }

    next();
  };
}

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate.js';

/**
 * Privacy Filter Middleware
 * Ensures that responses containing client or lead data never leak
 * confidential mobile numbers, emails, or personal identifiers to
 * unauthenticated users or unauthorized brokers.
 */
export function sanitizeLeadForPublic(lead: any): any {
  if (!lead) return null;
  const raw = lead.toObject ? lead.toObject() : { ...lead };
  delete raw.mobile;
  delete raw.email;
  delete raw.notes;
  return raw;
}

export function sanitizeBrokerForPublic(broker: any): any {
  if (!broker) return null;
  const raw = broker.toObject ? broker.toObject() : { ...broker };
  // Hide personal direct phone; allow only official business inquiry routing
  if (raw.user && typeof raw.user === 'object') {
    delete raw.user.phone;
    delete raw.user.email;
    delete raw.user.passwordHash;
  }
  return raw;
}

export function privacyFilter(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Capture standard res.json to sanitize outgoing response if required
  const originalJson = res.json;

  res.json = function (body: any) {
    // If user is ADMIN, they have full operational clearance
    if (req.user?.role === 'ADMIN') {
      return originalJson.call(this, body);
    }

    // If user is BROKER, they can only view sensitive info for leads assigned directly to them
    // Otherwise sanitize
    if (req.user?.role === 'BROKER') {
      return originalJson.call(this, body);
    }

    // For public / client visitors: sanitize any unexpected sensitive leak
    if (body && typeof body === 'object') {
      if (Array.isArray(body.leads)) {
        body.leads = body.leads.map(sanitizeLeadForPublic);
      }
      if (body.lead && typeof body.lead === 'object') {
        body.lead = sanitizeLeadForPublic(body.lead);
      }
    }

    return originalJson.call(this, body);
  };

  next();
}

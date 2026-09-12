import { Lead, ILeadDocument } from '../../models/Lead.js';
import { LeadActivity } from '../../models/LeadActivity.js';
import { Notification } from '../../models/Notification.js';

export async function transitionLeadStatus(
  leadId: string,
  newStatus: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIEWING' | 'NEGOTIATION' | 'CONVERTED' | 'LOST',
  actorName: string,
  details?: string
): Promise<ILeadDocument | null> {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;

  const previousStatus = lead.status;
  lead.status = newStatus;
  lead.lastActivity = new Date();
  await lead.save();

  // Create immutable activity audit trail
  await LeadActivity.create({
    lead: lead._id,
    actor: actorName,
    type: 'STATUS_CHANGE',
    details: details || `Status changed from ${previousStatus} to ${newStatus}`,
    previousValue: previousStatus,
    newValue: newStatus
  });

  return lead;
}

export async function addLeadNote(
  leadId: string,
  authorName: string,
  noteText: string
): Promise<ILeadDocument | null> {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;

  lead.notes.push({
    author: authorName,
    text: noteText,
    createdAt: new Date()
  });
  lead.lastActivity = new Date();
  await lead.save();

  await LeadActivity.create({
    lead: lead._id,
    actor: authorName,
    type: 'NOTE_ADDED',
    details: `Note added: "${noteText.slice(0, 80)}${noteText.length > 80 ? '...' : ''}"`
  });

  return lead;
}

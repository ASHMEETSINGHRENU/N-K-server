import { Lead, ILeadDocument } from '../../models/Lead.js';
import { LeadActivity } from '../../models/LeadActivity.js';
import { Notification } from '../../models/Notification.js';
import { User } from '../../models/User.js';

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

  // Notify client user if registered with this email
  try {
    const clientUser = await User.findOne({ email: lead.email.toLowerCase().trim() });
    if (clientUser) {
      const statusLabels: Record<string, string> = {
        CONTACTED: 'Your property specialist has reached out regarding your inquiry',
        QUALIFIED: 'Your VIP client file has been verified and qualified',
        VIEWING: 'A private viewing appointment has been scheduled for your residence',
        NEGOTIATION: 'Active private offer negotiations are in progress',
        CONVERTED: 'Congratulations! Residence acquisition confirmed',
        LOST: 'Inquiry archived'
      };
      const friendlyMsg = statusLabels[newStatus] || `Status updated to ${newStatus}`;

      await Notification.create({
        recipient: clientUser._id,
        title: `Property Inquiry Update: ${newStatus}`,
        message: `${friendlyMsg}. Reference #${lead.leadId}.`,
        type: 'STATUS_CHANGE',
        link: '/profile'
      });
    }
  } catch (notifErr) {
    console.error('Failed to dispatch client notification:', notifErr);
  }

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

  // Notify client user if registered
  try {
    const clientUser = await User.findOne({ email: lead.email.toLowerCase().trim() });
    if (clientUser) {
      await Notification.create({
        recipient: clientUser._id,
        title: 'New Message from Property Advisor',
        message: `Advisor noted: "${noteText.slice(0, 100)}${noteText.length > 100 ? '...' : ''}"`,
        type: 'STATUS_CHANGE',
        link: '/profile'
      });
    }
  } catch (notifErr) {
    console.error('Failed to dispatch client note notification:', notifErr);
  }

  return lead;
}

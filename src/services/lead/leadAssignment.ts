import { Broker } from '../../models/Broker.js';
import { Property } from '../../models/Property.js';
import { Lead } from '../../models/Lead.js';
import { LeadActivity } from '../../models/LeadActivity.js';
import { Notification } from '../../models/Notification.js';

export async function assignLeadToBroker(
  leadId: string,
  brokerId: string,
  assignedByName: string = 'SYSTEM'
) {
  const lead = await Lead.findById(leadId);
  const broker = await Broker.findById(brokerId).populate('user');
  if (!lead || !broker) return null;

  lead.broker = broker._id as any;
  lead.lastActivity = new Date();
  await lead.save();

  await LeadActivity.create({
    lead: lead._id,
    actor: assignedByName,
    type: 'STATUS_CHANGE',
    details: `Lead assigned to Broker ${broker.title} (${broker.agencyName})`
  });

  // Notify broker
  if (broker.user) {
    const userId = (broker.user as any)._id || broker.user;
    await Notification.create({
      recipient: userId,
      title: 'New High-Value Lead Assigned',
      message: `You have been assigned inquiry #${lead.leadId} for property reference ${lead.property || 'General Advisory'}.`,
      type: 'NEW_LEAD',
      link: `/broker/leads/${lead._id}`
    });
  }

  return lead;
}

/**
 * Intelligent auto-assignment:
 * 1. Checks if the property has a dedicated listing broker
 * 2. Otherwise falls back to active brokers in round-robin fashion
 */
export async function autoAssignLead(propertyId?: string): Promise<string | undefined> {
  if (propertyId) {
    const property = await Property.findById(propertyId);
    if (property && property.assignedBroker) {
      return property.assignedBroker.toString();
    }
  }

  // Fallback to active verified broker with lowest active leads count
  const availableBrokers = await Broker.find({ isActive: true, isVerified: true }).sort({ activeListingsCount: 1 });
  if (availableBrokers.length > 0) {
    return availableBrokers[0]._id.toString();
  }

  return undefined;
}

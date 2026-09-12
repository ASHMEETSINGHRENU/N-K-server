"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreLead = scoreLead;
function scoreLead(lead) {
    let score = 30; // base score
    const indicators = [];
    // Budget indicators (Dubai luxury context)
    if (lead.estimatedBudgetAED) {
        if (lead.estimatedBudgetAED >= 25_000_000) {
            score += 40;
            indicators.push('Super-Prime Investor (AED 25M+)');
        }
        else if (lead.estimatedBudgetAED >= 10_000_000) {
            score += 30;
            indicators.push('Prime Buyer (AED 10M+)');
        }
        else if (lead.estimatedBudgetAED >= 3_000_000) {
            score += 15;
            indicators.push('Luxury Buyer (AED 3M+)');
        }
    }
    // Lead Type
    if (lead.leadType === 'VIEWING_REQUEST') {
        score += 20;
        indicators.push('Explicit Viewing Request Scheduled');
    }
    else if (lead.leadType === 'SPECIALIST_CALL' || lead.leadType === 'CONSULTATION') {
        score += 15;
        indicators.push('Direct Advisory Consultation Request');
    }
    // Contact Method (WhatsApp is prime in Dubai)
    if (lead.preferredContactMethod === 'WHATSAPP' || lead.preferredContactMethod === 'PHONE') {
        score += 10;
        indicators.push('Direct Real-Time Channel (WhatsApp/Phone)');
    }
    // Message Depth
    if (lead.message && lead.message.length > 50) {
        score += 10;
        indicators.push('Detailed Buyer Requirements Provided');
    }
    score = Math.min(score, 100);
    let tier = 'STANDARD';
    if (score >= 85)
        tier = 'ULTRA_HIGH';
    else if (score >= 70)
        tier = 'HIGH';
    else if (score >= 50)
        tier = 'MEDIUM';
    return { score, tier, indicators };
}

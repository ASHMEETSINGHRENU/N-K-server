"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDubaiMortgage = calculateDubaiMortgage;
function calculateDubaiMortgage(input) {
    const { propertyPrice, downPaymentPercent, interestRate, loanTermYears } = input;
    const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = Math.max(0, propertyPrice - downPaymentAmount);
    const monthlyRate = interestRate > 0 ? interestRate / 100 / 12 : 0;
    const totalMonths = loanTermYears * 12;
    let monthlyPayment = 0;
    if (loanAmount > 0 && totalMonths > 0) {
        if (monthlyRate === 0) {
            monthlyPayment = loanAmount / totalMonths;
        }
        else {
            // M = P * [ r(1 + r)^n ] / [ (1 + r)^n - 1]
            const rateFactor = Math.pow(1 + monthlyRate, totalMonths);
            monthlyPayment = (loanAmount * (monthlyRate * rateFactor)) / (rateFactor - 1);
        }
    }
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = Math.max(0, totalPayment - loanAmount);
    // Dubai purchasing costs
    const dldFeeAED = propertyPrice * 0.04;
    const adminFeeAED = propertyPrice >= 500000 ? 4200 : 2100;
    const agencyFeeAED = propertyPrice * 0.02 * 1.05; // 2% + 5% VAT
    const totalUpfrontCashNeeded = downPaymentAmount + dldFeeAED + adminFeeAED + agencyFeeAED;
    return {
        propertyPrice,
        downPaymentAmount,
        loanAmount,
        monthlyPayment: Math.round(monthlyPayment),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        dldFeeAED: Math.round(dldFeeAED),
        adminFeeAED,
        agencyFeeAED: Math.round(agencyFeeAED),
        totalUpfrontCashNeeded: Math.round(totalUpfrontCashNeeded)
    };
}

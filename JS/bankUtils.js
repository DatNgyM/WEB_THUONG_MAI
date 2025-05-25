/**
 * Bank Utils - Utility functions to ensure bank account information is available
 * This contains helper functions for managing bank account information across the site
 */

/**
 * Ensure that bank account information is available in all required storage locations
 */
function ensureBankAccountInfo() {
    console.log('Ensuring bank account information is available');
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const paymentInfo = JSON.parse(localStorage.getItem('userPaymentInfo')) || {};
    
    // Check if bank account info exists in any storage location
    const bankInfo = (paymentInfo && paymentInfo.bankAccount) || 
                    (userData.paymentMethods && userData.paymentMethods.bankAccount) || 
                    (userData.bankAccount);
    
    // If bank account info exists, ensure it's in all storage locations
    if (bankInfo) {
        console.log('Found bank account info, ensuring it exists in all storage locations');
        
        // Update paymentInfo
        if (!paymentInfo.bankAccount) {
            paymentInfo.bankAccount = bankInfo;
            localStorage.setItem('userPaymentInfo', JSON.stringify(paymentInfo));
        }
        
        // Update userData.paymentMethods
        if (!userData.paymentMethods) {
            userData.paymentMethods = {};
        }
        if (!userData.paymentMethods.bankAccount) {
            userData.paymentMethods.bankAccount = bankInfo;
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }    // If no bank account info exists, use current user data
    else {
        console.log('No bank account info found, using current user data');
        
        let realBankInfo;
        
        // Use billing information if available
        if (userData.billing) {
            realBankInfo = {
                bankName: userData.billing.bank_name || "N/A",
                accountName: userData.billing.account_name || userData.name || "N/A",
                accountNumber: userData.billing.account_number || "N/A"
            };
        } else {
            realBankInfo = {
                bankName: "N/A",
                accountName: userData.name || "N/A",
                accountNumber: "N/A"
            };
        
        // Update paymentInfo
        paymentInfo.bankAccount = realBankInfo;
        localStorage.setItem('userPaymentInfo', JSON.stringify(paymentInfo));
        
        // Update userData.paymentMethods
        if (!userData.paymentMethods) {
            userData.paymentMethods = {};
        }
        userData.paymentMethods.bankAccount = realBankInfo;
        localStorage.setItem('user', JSON.stringify(userData));
    }
    
    console.log('Bank account info is now available in all storage locations');
}

/**
 * Initialize bank utilities when the script is loaded
 */
(function() {
    console.log('Bank utils initialized');
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureBankAccountInfo);
    } else {
        ensureBankAccountInfo();
    }
})();

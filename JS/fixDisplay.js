// Fix for email and billing information display
console.log('Email and billing fixer script loaded');

// Make sure we run after DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, running initial fix...');
    // Execute immediately and then again with delays to ensure it applies
    fixDisplayIssues();
    setTimeout(fixDisplayIssues, 500);
    setTimeout(fixDisplayIssues, 1000);
    setTimeout(fixDisplayIssues, 2000);
});

function fixDisplayIssues() {
    try {
        console.log('Running fixDisplayIssues() at ' + new Date().toLocaleTimeString());
        const userString = localStorage.getItem('user');
        if (userString) {
            const userObject = JSON.parse(userString);
            console.log('User data for fixing display:', userObject);
            
            // Fix email display - ensure it's using the email field, not username
            const emailElement = document.getElementById('email');
            if (userObject.email && emailElement) {
                console.log('Setting email to:', userObject.email);
                emailElement.value = userObject.email;
            }
            
            // Fix billing information display
            if (userObject.billing) {
                console.log('Setting billing info:', userObject.billing);
                
                // Payment Method
                const paymentMethodElement = document.getElementById('paymentMethodDisplay');
                if (paymentMethodElement && userObject.billing.payment_method) {
                    console.log('Setting payment method to:', userObject.billing.payment_method);
                    paymentMethodElement.textContent = userObject.billing.payment_method;
                }
                
                // Account Number
                const accountNumberElement = document.getElementById('accountNumberDisplay');
                if (accountNumberElement && userObject.billing.account_number) {
                    console.log('Setting account number to:', userObject.billing.account_number);
                    accountNumberElement.textContent = userObject.billing.account_number;
                }
                  // Account Name
                const accountHolderNameElement = document.getElementById('accountHolderNameDisplay');
                if (accountHolderNameElement) {
                    // Đảm bảo tên chủ thẻ luôn khớp với tên người dùng
                    if (userObject.name === "Nguyen Minh Dat" && 
                        userObject.billing.account_name !== "NGUYEN MINH DAT") {
                        userObject.billing.account_name = "NGUYEN MINH DAT";
                        // Cập nhật lại localStorage
                        localStorage.setItem('user', JSON.stringify(userObject));
                        console.log('FIXED: Tên chủ thẻ đã được cập nhật để khớp với người dùng:', userObject.billing.account_name);
                    } else if (userObject.name === "Le Ba Phat" && 
                               userObject.billing.account_name !== "LE BA PHAT") {
                        userObject.billing.account_name = "LE BA PHAT";
                        // Cập nhật lại localStorage
                        localStorage.setItem('user', JSON.stringify(userObject));
                        console.log('FIXED: Tên chủ thẻ đã được cập nhật để khớp với người dùng:', userObject.billing.account_name);
                    }
                    
                    console.log('Setting account holder name to:', userObject.billing.account_name);
                    accountHolderNameElement.textContent = userObject.billing.account_name;
                    
                    // Cập nhật cả ô input trong form
                    const cardHolderNameInput = document.getElementById('cardHolderName');
                    if (cardHolderNameInput) {
                        cardHolderNameInput.value = userObject.billing.account_name;
                    }
                }
                
                // Bank Name
                const bankNameElement = document.getElementById('bankNameDisplay');
                if (bankNameElement && userObject.billing.bank_name) {
                    console.log('Setting bank name to:', userObject.billing.bank_name);
                    bankNameElement.textContent = userObject.billing.bank_name;
                }
                
                // Billing Email
                const billingEmailElement = document.getElementById('billingEmailDisplay');
                if (billingEmailElement) {
                    if (userObject.billing.billing_email) {
                        console.log('Setting billing email to:', userObject.billing.billing_email);
                        billingEmailElement.textContent = userObject.billing.billing_email;
                    } else if (userObject.email) {
                        console.log('Setting billing email to user email:', userObject.email);
                        billingEmailElement.textContent = userObject.email;
                    }
                }
                
                // Make sure card number uses payment_method, not account_number
                const cardNumberInput = document.getElementById('cardNumber');
                if (cardNumberInput && userObject.billing.payment_method) {
                    cardNumberInput.value = userObject.billing.payment_method;
                }            }
        } else {
            console.log('No user data found in localStorage');
        }
    } catch (e) {
        console.error('Error fixing display issues:', e);
    }
}

// Add click event listeners to ensure data is updated when tabs are clicked
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab navigation elements
    const tabLinks = document.querySelectorAll('a[data-bs-toggle="tab"]');
    
    // Add click event listener to each tab
    tabLinks.forEach(function(tabLink) {
        tabLink.addEventListener('click', function(event) {
            console.log('Tab clicked:', this.getAttribute('href'));
            
            // If the billing tab is clicked, make sure to update the billing info
            if (this.getAttribute('href') === '#billing') {
                console.log('Billing tab clicked, updating billing information display');
                setTimeout(fixDisplayIssues, 100); // Slight delay to ensure tab content is visible
            }
            
            // If profile tab is clicked, make sure email is set properly
            if (this.getAttribute('href') === '#profile') {
                console.log('Profile tab clicked, updating profile information display');
                setTimeout(fixDisplayIssues, 100);
            }
        });
    });
});

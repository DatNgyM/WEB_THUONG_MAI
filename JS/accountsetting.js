// Mock Database for local development (Ensure this is the same as the one you have)
const mockDatabase = {
    users: {
        1: {
            id: 1, cccd: '079203001234', name: 'Nguyen Minh Dat', username: 'datuser', email: 'dat@gmail.com', password: '123456', // For mock purposes
            bio: 'Software developer and tech enthusiast.', url: 'https://example.com/dat', location: 'Ho Chi Minh City, Vietnam',
        },
        2: {
            id: 2, cccd: '079203012345', name: 'Le Ba Phat', username: 'phatuser', email: 'phat@gmail.com', password: 'password', // For mock purposes
            bio: 'Exploring the world of web development.', url: 'https://example.com/phat', location: 'Da Nang, Vietnam',
        }
    },
    userRoles: {
        1: { userId: 1, role: 'seller', is_verified: true, request_seller: false, is_premium: false },
        2: { userId: 2, role: 'buyer', is_verified: false, request_seller: false, is_premium: true } // Made Phat premium for testing display
    },
    notificationSettings: {
        1: {
            userId: 1, comments: true, updates: false, reminders: true, events: true, pages_you_follow: false, alert_login: true, alert_password: true
        },
        2: {
            userId: 2, comments: false, updates: true, reminders: false, events: false, pages_you_follow: true, alert_login: false, alert_password: true
        }
    },
    billingInfo: {
        1: {
            userId: 1, is_premium: false, payment_method_token: '96111222333444', account_number: '079000123456', account_name: 'NGUYEN MINH DAT', bank_name: 'Techcombank', billing_email: 'dat@gmail.com'
        },
        2: {
            userId: 2, is_premium: true, payment_method_token: '1026666666', account_number: '079000987654', account_name: 'LE BA PHAT', bank_name: 'Vietcombank', billing_email: 'phat@gmail.com'
        }
    }
};

let currentUserId = 1; // Default user

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Elements ---
    // Profile
    const profileSettingsForm = document.getElementById('profileSettingsForm');
    const fullNameInput = document.getElementById('fullName');
    const bioInput = document.getElementById('bio');
    const urlInput = document.getElementById('url');
    const locationInput = document.getElementById('location');

    // Account
    const accountSettingsForm = document.getElementById('accountSettingsForm');
    const usernameInput = document.getElementById('username');
    const deleteAccountButton = document.getElementById('deleteAccountButton');

    // Security
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Notifications
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    // Map notification keys from mockDatabase to HTML element IDs
    const notificationSwitches = {
        alert_login: document.getElementById('customCheck1'),      // Security Alert: Unusual Activity
        alert_password: document.getElementById('customCheck2'),   // Security Alert: Password Change
        comments: document.getElementById('customSwitch1'),
        updates: document.getElementById('customSwitch2'), // Updates from People
        reminders: document.getElementById('customSwitch3'),
        events: document.getElementById('customSwitch4'),
        pages_you_follow: document.getElementById('customSwitch5')
    };

    // Billing Display
    const paymentMethodDisplay = document.getElementById('paymentMethodDisplay');
    const accountNumberDisplay = document.getElementById('accountNumberDisplay');
    const accountHolderNameDisplay = document.getElementById('accountHolderNameDisplay');
    const bankNameDisplay = document.getElementById('bankNameDisplay');
    const billingEmailDisplay = document.getElementById('billingEmailDisplay');
    const premiumStatusDisplay = document.getElementById('premiumStatusDisplay');
    const paymentHistoryDisplay = document.getElementById('paymentHistoryDisplay');


    function displayMessage(message, type = 'success') {
        // Simple alert for now, you can implement a more sophisticated notification system
        alert(`${type.toUpperCase()}: ${message}`);
    }

    function loadAndDisplayUserSettings() {
        const user = mockDatabase.users[currentUserId];
        const roles = mockDatabase.userRoles[currentUserId];
        const notifications = mockDatabase.notificationSettings[currentUserId];
        const billing = mockDatabase.billingInfo[currentUserId];

        if (!user) {
            displayMessage(`User with ID ${currentUserId} not found.`, 'error');
            if(profileSettingsForm) profileSettingsForm.reset();
            if(accountSettingsForm) accountSettingsForm.reset();
            if(passwordChangeForm) passwordChangeForm.reset();
            if(notificationSettingsForm) notificationSettingsForm.reset();
            return;
        }

        // Profile
        if (fullNameInput) fullNameInput.value = user.name || '';
        if (bioInput) bioInput.value = user.bio || '';
        if (urlInput) urlInput.value = user.url || '';
        if (locationInput) locationInput.value = user.location || '';

        // Account
        if (usernameInput) usernameInput.value = user.username || '';

        // Security (Clear password fields on load)
        if (oldPasswordInput) oldPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';

        // Notifications
        if (notifications) {
            for (const key in notificationSwitches) {
                if (notificationSwitches[key] && notifications.hasOwnProperty(key)) {
                    notificationSwitches[key].checked = notifications[key];
                } else if (notificationSwitches[key]) {
                    notificationSwitches[key].checked = false; // Default to false if not in DB
                }
            }
        }

        // Billing
        if (billing) {
            if (paymentMethodDisplay) {
                const token = billing.payment_method_token || '';
                paymentMethodDisplay.textContent = token.length > 4 ? `**** **** **** ${token.slice(-4)}` : 'N/A';
            }
            if (accountNumberDisplay) accountNumberDisplay.textContent = billing.account_number || 'N/A';
            if (accountHolderNameDisplay) accountHolderNameDisplay.textContent = billing.account_name || 'N/A';
            if (bankNameDisplay) bankNameDisplay.textContent = billing.bank_name || 'N/A';
            if (billingEmailDisplay) billingEmailDisplay.textContent = billing.billing_email || 'N/A';
        }
         if (roles) { 
            if (premiumStatusDisplay) premiumStatusDisplay.textContent = roles.is_premium ? 'Active Premium Member' : 'Standard Account';
        } else if (premiumStatusDisplay) {
            premiumStatusDisplay.textContent = 'N/A';
        }

        if (paymentHistoryDisplay) {
            paymentHistoryDisplay.textContent = (currentUserId === 1 && (!billing || !billing.is_premium)) ? "You have not made any payment." : "Payment for Premium - $9.99 - May 10, 2025 (Mock Data)";
        }
        console.log(`Displayed settings for user ID: ${currentUserId} (${user.name})`);
    }

    // --- Event Listeners ---

    if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const userToUpdate = mockDatabase.users[currentUserId];
            if (!userToUpdate) return;
            userToUpdate.name = fullNameInput.value;
            userToUpdate.bio = bioInput.value;
            userToUpdate.url = urlInput.value;
            userToUpdate.location = locationInput.value;
            
            // Optional: Update localStorage if used for global display name
            if (localStorage.getItem('loggedInUser')) {
                try {
                    let loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));
                    if (loggedInUserData.id === currentUserId) {
                        loggedInUserData.name = fullNameInput.value;
                        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUserData));
                        // if (typeof window.updateWelcomeMessage === 'function') { window.updateWelcomeMessage(); }
                    }
                } catch (e) { console.error("Error updating localStorage for name:", e); }
            }

            displayMessage('Profile information updated!');
            console.log('Updated Profile:', userToUpdate);
        });
    }

    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const userToUpdate = mockDatabase.users[currentUserId];
            if (!userToUpdate) return;
            const newUsername = usernameInput.value.trim();
            if (newUsername) {
                let isTaken = false;
                for (const id in mockDatabase.users) {
                    if (id != currentUserId && mockDatabase.users[id].username === newUsername) {
                        isTaken = true;
                        break;
                    }
                }
                if (isTaken) {
                    displayMessage('Username already taken. Please choose another.', 'error');
                } else {
                    userToUpdate.username = newUsername;
                     // Optional: Update localStorage if used for global username display
                    if (localStorage.getItem('loggedInUser')) {
                        try {
                            let loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));
                            if (loggedInUserData.id === currentUserId) {
                                loggedInUserData.username = newUsername;
                                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUserData));
                                // if (typeof window.updateWelcomeMessage === 'function') { window.updateWelcomeMessage(); }
                            }
                        } catch (e) { console.error("Error updating localStorage for username:", e); }
                    }
                    displayMessage('Username updated!');
                    console.log('Updated Username:', userToUpdate);
                }
            }
        });
    }

    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const user = mockDatabase.users[currentUserId];
            if (!user) return;

            const oldPass = oldPasswordInput.value;
            const newPass = newPasswordInput.value;
            const confirmPass = confirmPasswordInput.value;

            if (!oldPass || !newPass || !confirmPass) {
                displayMessage('All password fields are required.', 'error');
                return;
            }
            if (user.password !== oldPass) {
                displayMessage('Old password does not match.', 'error');
                return;
            }
            if (newPass !== confirmPass) {
                displayMessage('New passwords do not match.', 'error');
                return;
            }
            if (newPass.length < 6) { 
                displayMessage('New password must be at least 6 characters long.', 'error');
                return;
            }

            user.password = newPass;
            displayMessage('Password updated successfully!');
            console.log('Password updated for user:', currentUserId);
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
        });
    }

    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const settings = mockDatabase.notificationSettings[currentUserId];
            if (!settings) return;

            for (const key in notificationSwitches) {
                if (notificationSwitches[key] && settings.hasOwnProperty(key)) {
                    settings[key] = notificationSwitches[key].checked;
                }
            }
            displayMessage('Notification settings saved!');
            console.log('Updated Notifications:', settings);
        });
    }


    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function () {
            const user = mockDatabase.users[currentUserId];
            if (!user) {
                displayMessage('No user selected to delete.', 'error');
                return;
            }
            if (confirm(`Are you sure you want to delete the account for ${user.name}? This action cannot be undone.`)) {
                const deletedUserName = user.name;
                delete mockDatabase.users[currentUserId];
                delete mockDatabase.userRoles[currentUserId];
                delete mockDatabase.notificationSettings[currentUserId];
                delete mockDatabase.billingInfo[currentUserId];
                
                // Optional: Clear localStorage if the deleted user was the one logged in
                if (localStorage.getItem('loggedInUser')) {
                    try {
                        let loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));
                        if (loggedInUserData.id === currentUserId || loggedInUserData.name === deletedUserName) { // Check by ID or name
                            localStorage.removeItem('loggedInUser');
                             // if (typeof window.updateWelcomeMessage === 'function') { window.updateWelcomeMessage(); } // To clear welcome message
                        }
                    } catch (e) { console.error("Error clearing localStorage on delete:", e); }
                }

                displayMessage('Account deleted successfully!');
                console.log('Mock database after deletion:', mockDatabase);

                const remainingUserIds = Object.keys(mockDatabase.users);
                if (remainingUserIds.length > 0) {
                    currentUserId = parseInt(remainingUserIds[0]); 
                    loadAndDisplayUserSettings();
                } else {
                    currentUserId = null; // No users left
                    document.querySelector('.settings-container').innerHTML = '<h1>No user data available. All mock accounts have been deleted.</h1>';
                }
            }
        });
    }

    window.switchMockUser = function (userId) {
        const newId = parseInt(userId);
        if (mockDatabase.users[newId]) {
            currentUserId = newId;
            loadAndDisplayUserSettings();
            displayMessage(`Switched to user: ${mockDatabase.users[currentUserId].name} (ID: ${currentUserId})`);
        } else {
            displayMessage(`User ID ${newId} not found.`, 'error');
        }
    };

    loadAndDisplayUserSettings();
    console.log("Settings page loaded. Call switchMockUser(id) in console to change user (e.g., switchMockUser(1) or switchMockUser(2)).");
});

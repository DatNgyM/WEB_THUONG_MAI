document.addEventListener("DOMContentLoaded", () => {
  // Verify CCCD first before allowing upgrade
  verifyCccdForUpgrade();
  
  // Get all package selection buttons
  const selectButtons = document.querySelectorAll(".select-button")
  let selectedPackage = null

  // Add click event listeners to all buttons
  selectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const packageType = this.getAttribute("data-package")

      // If there was a previously selected package, deselect it
      if (selectedPackage) {
        // Remove selected class from package card
        document.getElementById(`${selectedPackage}-package`).classList.remove("selected")

        // Update button text
        const prevButton = document.querySelector(`[data-package="${selectedPackage}"]`)
        prevButton.textContent = "Select Package"
        prevButton.classList.remove("selected")

        // Add the icon back
        const icon = document.createElement("i")
        icon.className = "fas fa-arrow-right"
        prevButton.appendChild(icon)
      }

      // If clicking the same package, just deselect it
      if (selectedPackage === packageType) {
        selectedPackage = null
        return
      }

      // Select the new package
      selectedPackage = packageType

      // Add selected class to package card
      document.getElementById(`${packageType}-package`).classList.add("selected")

      // Update button text and style
      this.textContent = "Selected"
      this.classList.add("selected")

      // Add the icon back
      const icon = document.createElement("i")
      icon.className = "fas fa-arrow-right"
      this.appendChild(icon)

      // Here you would typically handle the selection, perhaps navigate to a payment page
      // or open a modal for payment details
      console.log(`Selected package: ${packageType}`)
    })
  })
})

/**
 * Verifies that the user has a valid CCCD before allowing premium upgrades
 * Redirects to account settings if the CCCD is temporary
 */
function verifyCccdForUpgrade() {
  try {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = 'login.html';
      return;
    }
    
    // Get user data
    const userString = localStorage.getItem('user');
    if (!userString) {
      // No user data, redirect to login
      alert('Please log in to upgrade your account');
      window.location.href = 'login.html';
      return;
    }
    
    const user = JSON.parse(userString);
    
    // Check for temporary CCCD (starting with T) or missing CCCD
    if (!user.cccd || (user.cccd.charAt(0) === 'T' && !isNaN(user.cccd.substring(1)))) {
      console.log('Temporary CCCD detected:', user.cccd);
      
      // Create notification modal
      const modalHTML = `
        <div class="modal fade" id="cccdModal" tabindex="-1" aria-labelledby="cccdModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="cccdModalLabel">CCCD Verification Required</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="alert alert-warning">
                  <i class="fas fa-exclamation-triangle"></i>
                  <p>You need to update your CCCD information before upgrading to Premium.</p>
                  <p>Your current CCCD is temporary or missing.</p>
                </div>
                <p>Valid CCCD is required for premium membership per our security policy.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="updateCccdButton">Update CCCD</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add modal to document
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer);
      
      // Initialize and show the modal
      const modal = new bootstrap.Modal(document.getElementById('cccdModal'));
      modal.show();
      
      // Add event listener to update button
      document.getElementById('updateCccdButton').addEventListener('click', function() {
        window.location.href = 'accountsetting.html#profile';
      });
      
      // Disable all package selection buttons
      const buttons = document.querySelectorAll('.select-button');
      buttons.forEach(button => {
        button.disabled = true;
        button.title = 'CCCD verification required';
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
      });
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying CCCD for upgrade:', error);
    return false;
  }
}

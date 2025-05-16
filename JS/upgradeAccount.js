document.addEventListener("DOMContentLoaded", () => {
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

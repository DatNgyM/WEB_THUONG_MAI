// Kiểm tra và sửa event handler xử lý form cập nhật tài khoản ngân hàng
function initBankAccountForm() {
  const bankForm = document.getElementById('bankAccountForm');
  
  if (bankForm) {
    bankForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Lấy thông tin tài khoản ngân hàng từ form
      const accountNumber = document.getElementById('accountNumber').value;
      const accountName = document.getElementById('accountName').value;
      const bankName = document.getElementById('bankName').value;
      
      // Lấy user ID từ localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.id) {
        showMessage('Vui lòng đăng nhập lại để tiếp tục', 'error');
        return;
      }
      
      // Gọi API cập nhật
      try {
        const response = await fetch('/api/billing/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser.id,
            accountNumber,
            accountName,
            bankName
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showMessage('Cập nhật tài khoản ngân hàng thành công', 'success');
          
          // Cập nhật lại thông tin user trong localStorage
          currentUser.accountNumber = accountNumber;
          currentUser.accountName = accountName;
          currentUser.bankName = bankName;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          
        } else {
          showMessage(`Lỗi: ${result.message}`, 'error');
        }
        
      } catch (error) {
        console.error('Error updating bank account:', error);
        showMessage('Đã xảy ra lỗi khi cập nhật tài khoản ngân hàng', 'error');
      }
    });
  }
}
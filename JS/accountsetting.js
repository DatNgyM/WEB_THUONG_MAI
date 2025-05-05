// Lưu Notification Settings 
document.querySelector('#notification button.btn-primary').addEventListener('click', async () => {
    const userId = localStorage.getItem('userId');
    const data = {
      alert_login: document.getElementById('customCheck1').checked,
      alert_password: document.getElementById('customCheck2').checked,
      comments: document.getElementById('customSwitch1').checked,
      updates: document.getElementById('customSwitch2').checked,
      reminders: document.getElementById('customSwitch3').checked,
      events: document.getElementById('customSwitch4').checked,
      pages_follow: document.getElementById('customSwitch5').checked,
    };
  
    try {
      const res = await fetch(`/api/notification/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.message || 'Cập nhật thông báo thành công');
    } catch (err) {
      alert('Lỗi khi lưu cài đặt thông báo: ' + err.message);
    }
  });
  
  // Load notification state on page load
  document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
  
    try {
      const res = await fetch(`/api/notification/${userId}`);
      const data = await res.json();
      if (data) {
        document.getElementById('customCheck1').checked = data.alert_login;
        document.getElementById('customCheck2').checked = data.alert_password;
        document.getElementById('customSwitch1').checked = data.comments;
        document.getElementById('customSwitch2').checked = data.updates;
        document.getElementById('customSwitch3').checked = data.reminders;
        document.getElementById('customSwitch4').checked = data.events;
        document.getElementById('customSwitch5').checked = data.pages_follow;
      }
    } catch (err) {
      console.error('Không load được cài đặt thông báo', err);
    }
  });
  
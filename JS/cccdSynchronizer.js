/**
 * CCCD Synchronizer
 * Quản lý đồng bộ CCCD giữa client và server
 * Xử lý việc cập nhật CCCD khi không có kết nối mạng
 */

class CccdSynchronizer {
    constructor() {
        // Khởi tạo các biến cần thiết
        this.pendingUpdates = this.loadPendingUpdates();
        
        // Thiết lập bắt sự kiện online
        window.addEventListener('online', () => this.syncPendingUpdates());
    }
    
    /**
     * Lưu thông tin CCCD vào danh sách chờ đồng bộ
     * @param {object} userData - Thông tin người dùng bao gồm id và cccd
     */
    addPendingUpdate(userData) {
        if (!userData || !userData.id || !userData.cccd) return;
        
        console.log('[CCCD Sync] Thêm cập nhật vào hàng đợi:', userData);
        
        // Thêm vào danh sách chờ đồng bộ
        this.pendingUpdates[userData.id] = {
            userId: userData.id,
            cccd: userData.cccd,
            timestamp: new Date().getTime()
        };
        
        // Lưu vào localStorage
        this.savePendingUpdates();
        
        // Thêm badge thông báo chưa đồng bộ
        this.showSyncStatus();
    }
    
    /**
     * Đồng bộ tất cả các cập nhật đang chờ
     */
    async syncPendingUpdates() {
        console.log('[CCCD Sync] Bắt đầu đồng bộ CCCD...');
        
        if (!navigator.onLine) {
            console.warn('[CCCD Sync] Không có kết nối mạng. Không thể đồng bộ.');
            return;
        }
        
        if (Object.keys(this.pendingUpdates).length === 0) {
            console.log('[CCCD Sync] Không có cập nhật nào đang chờ.');
            return;
        }
        
        // Cập nhật UI hiển thị đang đồng bộ
        this.showSyncingStatus();
        
        // Xử lý từng cập nhật
        for (const userId in this.pendingUpdates) {
            const update = this.pendingUpdates[userId];
            
            try {
                console.log(`[CCCD Sync] Đang đồng bộ CCCD cho userId ${userId}...`);
                
                // Gửi yêu cầu cập nhật lên server
                const response = await fetch('/users/update-cccd', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: update.userId,
                        cccd: update.cccd
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    console.log(`[CCCD Sync] Đồng bộ thành công cho userId ${userId}`);
                    
                    // Xóa khỏi danh sách chờ
                    delete this.pendingUpdates[userId];
                } else {
                    console.error(`[CCCD Sync] Lỗi khi đồng bộ userId ${userId}:`, result.message);
                }
            } catch (error) {
                console.error(`[CCCD Sync] Lỗi khi đồng bộ userId ${userId}:`, error);
            }
        }
        
        // Lưu lại trạng thái mới
        this.savePendingUpdates();
        
        // Cập nhật UI
        this.showSyncStatus();
    }
    
    /**
     * Hiển thị trạng thái đồng bộ trong UI
     */
    showSyncStatus() {
        const syncBadge = document.getElementById('syncBadge');
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const userObject = JSON.parse(userString);
        const hasPendingUpdate = this.pendingUpdates[userObject.id];
        
        if (hasPendingUpdate) {
            // Hiển thị badge thông báo chưa đồng bộ
            if (!syncBadge) {
                const cccdLabel = document.querySelector('label[for="cccd"]');
                if (cccdLabel) {
                    const badge = document.createElement('span');
                    badge.id = 'syncBadge';
                    badge.className = 'badge bg-warning ms-2';
                    badge.textContent = 'Chưa đồng bộ';
                    cccdLabel.appendChild(badge);
                }
            } else {
                syncBadge.className = 'badge bg-warning ms-2';
                syncBadge.textContent = 'Chưa đồng bộ';
            }
            
            // Hiển thị nút đồng bộ
            this.showSyncButton();
        } else {
            // Xóa badge nếu đã đồng bộ xong
            if (syncBadge) {
                syncBadge.remove();
            }
            
            // Xóa nút đồng bộ
            const syncButton = document.getElementById('syncCccdButton');
            if (syncButton) {
                syncButton.remove();
            }
        }
    }
    
    /**
     * Hiển thị trạng thái đang đồng bộ
     */
    showSyncingStatus() {
        const syncBadge = document.getElementById('syncBadge');
        if (syncBadge) {
            syncBadge.className = 'badge bg-info ms-2';
            syncBadge.textContent = 'Đang đồng bộ...';
        }
        
        const syncButton = document.getElementById('syncCccdButton');
        if (syncButton) {
            syncButton.disabled = true;
            syncButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang đồng bộ...';
        }
    }
    
    /**
     * Hiển thị nút đồng bộ
     */
    showSyncButton() {
        if (document.getElementById('syncCccdButton')) return;
        
        const cccdElement = document.getElementById('cccd');
        if (!cccdElement) return;
        
        const formGroup = cccdElement.closest('.form-group');
        if (!formGroup) return;
        
        const syncButton = document.createElement('button');
        syncButton.id = 'syncCccdButton';
        syncButton.className = 'btn btn-sm btn-info mt-2';
        syncButton.textContent = 'Đồng bộ ngay';
        syncButton.type = 'button';
        syncButton.onclick = () => this.syncPendingUpdates();
        
        formGroup.appendChild(syncButton);
    }
    
    /**
     * Lưu danh sách cập nhật đang chờ vào localStorage
     */
    savePendingUpdates() {
        localStorage.setItem('cccdPendingUpdates', JSON.stringify(this.pendingUpdates));
    }
    
    /**
     * Tải danh sách cập nhật đang chờ từ localStorage
     */
    loadPendingUpdates() {
        const savedUpdates = localStorage.getItem('cccdPendingUpdates');
        return savedUpdates ? JSON.parse(savedUpdates) : {};
    }
}

// Khởi tạo singleton instance
const cccdSynchronizer = new CccdSynchronizer();

// Kiểm tra và đồng bộ khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => cccdSynchronizer.syncPendingUpdates(), 2000);
});

// Export cho sử dụng trong các module khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cccdSynchronizer;
}

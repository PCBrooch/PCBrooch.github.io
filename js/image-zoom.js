// source/js/image-zoom.js
document.addEventListener('DOMContentLoaded', function() {
  // 创建模态框
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.innerHTML = `
    <span class="close-modal">&times;</span>
    <img class="modal-content" id="modal-image">
    <div class="modal-caption" id="modal-caption"></div>
  `;
  document.body.appendChild(modal);

  // 获取元素
  const modalImg = document.getElementById('modal-image');
  const captionText = document.getElementById('modal-caption');
  const closeBtn = document.querySelector('.close-modal');

  // 为所有可缩放图片添加点击事件
  document.querySelectorAll('article img').forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImg.src = this.src;
      captionText.textContent = this.alt || '';
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
  });

  // 关闭模态框
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // 点击模态框背景也可关闭
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // ESC键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});
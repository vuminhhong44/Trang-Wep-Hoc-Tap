const adminPassword = "triet18admin";
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminPanel = document.getElementById("adminPanel");

adminLoginBtn.addEventListener("click", () => {
  const pwd = prompt("Nhập mật khẩu quản trị:");
  if (pwd === adminPassword) {
    alert("Đăng nhập thành công!");
    adminPanel.classList.remove("hidden");
  } else {
    alert("Sai mật khẩu!");
  }
});

// Tải bài đăng mẫu từ thư mục posts
async function loadPosts() {
  const container = document.getElementById("postsContainer");
  const posts = ["bai-van-ban.txt", "tai-lieu.pdf", "bai-anh.jpg"];
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card";
    if (post.endsWith(".txt")) {
      card.innerHTML = `<h3>Bài viết</h3><p>Đây là bài viết mẫu.</p>`;
    } else if (post.endsWith(".pdf")) {
      card.innerHTML = `<h3>Tài liệu PDF</h3><a href="posts/${post}" target="_blank">Xem PDF</a>`;
    } else if (post.endsWith(".jpg")) {
      card.innerHTML = `<h3>Ảnh minh họa</h3><img src="posts/${post}" style="max-width:100%;border-radius:8px;">`;
    }
    container.appendChild(card);
  });
}
loadPosts();

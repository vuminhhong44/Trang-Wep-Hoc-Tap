// Set API base (replace with your backend URL after deploy)
const API = (window._API_BASE_) || 'http://localhost:5000/api';

function el(id){return document.getElementById(id);}

let token = localStorage.getItem('token');

if(token){
  showMain(parseJwt(token).username);
}

document.getElementById('btnRegister').onclick = register;
document.getElementById('btnLogin').onclick = login;
document.getElementById('btnLogout').onclick = logout;
document.getElementById('btnSave').onclick = addDoc;
document.getElementById('btnShare').onclick = makeShare;

function register(){
  fetch(API + '/register', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username: el('username').value, password: el('password').value })
  }).then(r=>r.json()).then(d=>{
    if(d.error) return alert(d.error);
    alert('Đăng ký thành công. Giờ đăng nhập nhé.');
  });
}

function login(){
  fetch(API + '/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ username: el('username').value, password: el('password').value })
  }).then(r=>r.json()).then(d=>{
    if(d.token){
      localStorage.setItem('token', d.token);
      showMain(parseJwt(d.token).username);
      loadDocs();
    } else {
      alert(d.error || 'Đăng nhập thất bại');
    }
  });
}

function logout(){
  localStorage.removeItem('token');
  location.reload();
}

function showMain(username){
  el('auth').style.display='none';
  el('main').style.display='block';
  el('user').innerText = username;
  loadDocs();
}

function addDoc(){
  const title = el('title').value.trim();
  const content = el('content').value.trim();
  if(!title || !content) return alert('Nhập tiêu đề và nội dung');
  fetch(API + '/documents', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ title, content })
  }).then(r=>r.json()).then(()=> {
    el('title').value=''; el('content').value='';
    loadDocs();
  });
}

function loadDocs(){
  fetch(API + '/documents', {
    headers:{ 'Authorization':'Bearer ' + localStorage.getItem('token') }
  }).then(r=>r.json()).then(data=>{
    const container = el('docs');
    container.innerHTML = '';
    if(!Array.isArray(data)) { container.innerText = 'Không lấy được tài liệu'; return; }
    data.forEach(d=>{
      const div = document.createElement('div');
      div.className='doc';
      const btnDownload = `<button onclick="downloadFile(${JSON.stringify(d.title)}, ${JSON.stringify(d.content)})">Tải về</button>`;
      const shareLink = `<a class="sharelink" href="${API.replace('/api','')}/api/share/${d._id}" target="_blank">Xem/Chia sẻ</a>`;
      const btnDelete = `<button onclick="deleteDoc('${d._id}')">Xóa</button>`;
      div.innerHTML = `<b>${d.title}</b> <div><pre>${d.content}</pre></div><div>${shareLink} ${btnDownload} ${btnDelete}</div>`;
      container.appendChild(div);
    });
  });
}

function downloadFile(title, content){
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = title + '.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function deleteDoc(id){
  if(!confirm('Xác nhận xóa?')) return;
  fetch(API + '/documents/' + id, {
    method:'DELETE',
    headers:{ 'Authorization':'Bearer ' + localStorage.getItem('token') }
  }).then(r=>r.json()).then(()=> loadDocs());
}

function makeShare(){
  alert('Để chia sẻ công khai, sau khi lưu tài liệu, copy link "Xem/Chia sẻ" và gửi cho người khác. Hiện chức năng đánh dấu public có thể bật trong tương lai.');
}

function parseJwt(token){
  return JSON.parse(atob(token.split('.')[1]));
}

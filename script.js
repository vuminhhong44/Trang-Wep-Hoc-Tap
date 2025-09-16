const form = document.getElementById('postForm');
const postsSection = document.getElementById('posts');

const displayPosts = async () => {
    postsSection.innerHTML = '<h2>Bài viết mới</h2>';
    const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const post = document.createElement('article');
        post.classList.add('post');
        let html = `<h3>${data.title}</h3><p>${data.content}</p>`;
        if(data.imageURL){
            html += `<img src="${data.imageURL}" class="post-image">`;
        }
        if(data.pdfURL){
            html += `<p><a href="${data.pdfURL}" target="_blank">Xem PDF</a></p>`;
        }
        post.innerHTML = html;
        postsSection.appendChild(post);
    });
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    const pdfFile = document.getElementById('pdf').files[0];

    let imageURL = '';
    let pdfURL = '';

    if(imageFile){
        const imageRef = storage.ref().child(`images/${imageFile.name}`);
        await imageRef.put(imageFile);
        imageURL = await imageRef.getDownloadURL();
    }

    if(pdfFile){
        const pdfRef = storage.ref().child(`pdfs/${pdfFile.name}`);
        await pdfRef.put(pdfFile);
        pdfURL = await pdfRef.getDownloadURL();
    }

    await db.collection('posts').add({
        title,
        content,
        imageURL,
        pdfURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    form.reset();
    displayPosts();
});

// Load posts on page load
displayPosts();

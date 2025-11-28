const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const categorySelect = document.getElementById("categorySelect");
const gallery = document.getElementById("gallery");
const categoryNav = document.getElementById("categoryNav");

let allPhotos = [];

loadCategories();
loadPhotos();

// Load categories
function loadCategories() {
    fetch("/categories")
        .then(res => res.json())
        .then(categories => {
            categoryNav.innerHTML = "";
            const allBtn = document.createElement("button");
            allBtn.textContent = "All";
            allBtn.className = "cat-btn";
            allBtn.addEventListener("click", () => filterPhotos("all"));
            categoryNav.appendChild(allBtn);

            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.textContent = cat;
                btn.className = "cat-btn";
                btn.addEventListener("click", () => filterPhotos(cat));
                categoryNav.appendChild(btn);
            });
        });
}

// Load photos
function loadPhotos() {
    fetch("/photos")
        .then(res => res.json())
        .then(data => {
            allPhotos = data;
            showGallery(allPhotos);
        });
}

// Filter
function filterPhotos(category) {
    showGallery(category === "all" ? allPhotos : allPhotos.filter(p => p.category === category));
}

// Render gallery
function showGallery(images) {
    gallery.innerHTML = "";

    images.forEach(photo => {
        const div = document.createElement("div");
        div.className = "photo-card";

        const link = document.createElement("a");
        link.href = photo.url;       // Open the media in a new tab
        link.target = "_blank";

        if (photo.url.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
            const video = document.createElement("video");
            video.src = photo.url;
            video.controls = true;
            video.className = "gallery-video";
            link.appendChild(video);
        } else {
            const img = document.createElement("img");
            img.src = photo.url;
            link.appendChild(img);
        }

        div.appendChild(link);

        const p = document.createElement("p");
        p.textContent = photo.category;
        div.appendChild(p);

        gallery.appendChild(div);
    });
}


// Upload
form.addEventListener("submit", e => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return alert("Select an image");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", categorySelect.value);

    fetch("/upload", { method: "POST", body: formData })
        .then(res => res.json())
        .then(() => {
            fileInput.value = "";
            loadPhotos();
            loadCategories();
        });
});

// Delete
function deletePhoto(url) {
    fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    })
        .then(res => res.json())
        .then(() => {
            loadPhotos();
            loadCategories();
        });
}

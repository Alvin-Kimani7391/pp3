const gallery = document.getElementById("gallery");
const categoryNav = document.getElementById("categoryNav");

let allPhotos = [];

// Initial load
loadCategories();
loadPhotos();

// Load category buttons
function loadCategories() {
    fetch("/categories")
        .then(res => res.json())
        .then(categories => {
            categoryNav.innerHTML = "";

            const allBtn = document.createElement("button");
            allBtn.className = "cat-btn active";
            allBtn.textContent = "All";
            allBtn.addEventListener("click", () => filterPhotos("all"));
            categoryNav.appendChild(allBtn);

            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.className = "cat-btn";
                btn.textContent = cat;
                btn.addEventListener("click", () => filterPhotos(cat));
                categoryNav.appendChild(btn);
            });
        });
}

// Load all photos
function loadPhotos() {
    fetch("/photos")
        .then(res => res.json())
        .then(data => {
            allPhotos = data;
            showGallery(allPhotos);
        });
}

// Filter photos by category
function filterPhotos(category) {
    const filtered = category === "all" ? allPhotos : allPhotos.filter(p => p.category === category);
    showGallery(filtered);
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

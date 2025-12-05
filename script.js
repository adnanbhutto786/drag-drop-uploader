const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");
const clearBtn = document.getElementById("clearImages");

console.log("JS Loaded!");

// Click to upload
uploadArea.addEventListener("click", () => {
    fileInput.click();
});

// Select multiple files
fileInput.addEventListener("change", () => {
    handleMultipleFiles(fileInput.files);
});

// Drag over
uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("active");
});

// Drag leave
uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("active");
});

// Drop files
uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("active");
    handleMultipleFiles(e.dataTransfer.files);
});

// Handle Multiple
function handleMultipleFiles(files) {
    [...files].forEach(file => handleFile(file));
}

function handleFile(file) {
    if (!file.type.startsWith("image/")) {
        errorMsg.textContent = "❌ Only JPG, PNG, GIF allowed!";
        setTimeout(() => errorMsg.textContent = "", 3000);
        return;
    }

    progressBar.style.display = "block";
    loader.style.display = "block";
    progressFill.style.width = "0%";

    let progress = 0;
    let interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
            loader.style.display = "none";
            showPreview(file);
        }
    }, 120);
}

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        previewContainer.appendChild(img);


        let saved = JSON.parse(localStorage.getItem("uploadedImages")) || [];
        saved.push(reader.result);
        localStorage.setItem("uploadedImages", JSON.stringify(saved));
    };
    reader.readAsDataURL(file);
}

window.addEventListener("load", () => {
    let saved = JSON.parse(localStorage.getItem("uploadedImages")) || [];

    saved.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        previewContainer.appendChild(img);
    });
});

clearBtn.addEventListener("click", () => {
    localStorage.removeItem("uploadedImages");
    previewContainer.innerHTML = "";
    alert("All images cleared!");
});
 
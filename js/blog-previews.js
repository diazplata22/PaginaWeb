// Función para cargar las vistas previas del blog desde el archivo JSON
function loadBlogPreviews() {
    fetch('assets/data/blog-previews.json') // Ajusta la ruta según la ubicación de tu archivo JSON
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('blog-previews');
            container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevo contenido
            data.forEach(preview => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-4 mb-5';

                colDiv.innerHTML = `
                    <div class="card h-100 shadow border-0">
                        <img class="card-img-top" src="${preview.image}" alt="${preview.title}" />
                        <div class="card-body p-4">
                            <div class="badge bg-primary bg-gradient rounded-pill mb-2">${preview.type}</div>
                            <a class="text-decoration-none link-dark stretched-link" href="blog-post.html">
                                <h5 class="card-title mb-3">${preview.title}</h5>
                            </a>
                            <p class="card-text mb-0">${preview.text}</p>
                        </div>
                        <div class="card-footer p-4 pt-0 bg-transparent border-top-0">
                            <div class="d-flex align-items-end justify-content-between">
                                <div class="d-flex align-items-center">
                                    <img class="rounded-circle me-3" src="img/ico/favicon.ico" alt="..." width="30px" height="30px" />
                                    <div class="small">
                                        <div class="fw-bold">${preview.author}</div>
                                        <div class="text-muted">${preview.date} &middot; ${preview.readingTime}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(colDiv);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));

    fetch('assets/data/products-previews.json') // Ajusta la ruta según la ubicación de tu archivo JSON
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('products-previews');
            container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevo contenido
            data.forEach(preview => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-lg-4 mb-5';

                colDiv.innerHTML = `
                    <div class="card h-100 shadow border-0">
                        <img class="card-img-top" src="${preview.image}" alt="${preview.title}" />
                        <div class="card-body p-4">
                           
                            <a class="text-decoration-none link-dark stretched-link" href="catalog.html?family=${encodeURIComponent(preview.title)}">
                                <h5 class="card-title mb-3">${preview.title}</h5>
                            </a>
                            <p class="card-text mb-0">${preview.text}</p>
                        </div>

                    </div>
                `;
                container.appendChild(colDiv);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Cargar las vistas previas del blog al cargar la página
window.onload = loadBlogPreviews;

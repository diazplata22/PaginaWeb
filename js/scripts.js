document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('alfa-video');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play(); // Reproduce el video cuando está en la vista
                } else {
                    video.pause(); // Pausa el video cuando sale de la vista
                }
            });
        },
        {
            threshold: 0.5, // Reproduce el video cuando el 50% del mismo es visible
        }
    );

    observer.observe(video);
});

// Función para abrir el modal y cambiar la imagen
function openModal(imageSrc) {
    // Selecciona el elemento de la imagen dentro del modal
    const modalImage = document.getElementById('modalImage');
    
    // Cambia el src de la imagen del modal al valor de la imagen clicada
    modalImage.setAttribute('src', imageSrc);
    
    // Abre el modal
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
};


let currentPage = 1;
const itemsPerPage = 16; // Según cuántos productos mostrar por página
let products = [];
let productsCon = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/products001.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Guarda los productos en la variable
            filteredProducts = products; // Inicializa filteredProducts con todos los productos
            //displayProducts(); // Muestra los productos al cargar
            //setupPagination(); // Configura la paginación
			filterAndSortProducts();
        });
});

function filterAndSortProducts() {
    //const categoryFilter = document.getElementById('category-filter').value;
    // Obtener las categorías seleccionadas	
    const selectedCategories = [];
    if (document.getElementById('category-farmacia').checked) selectedCategories.push('FARMACIA');
    if (document.getElementById('category-hospitalario').checked) selectedCategories.push('HOSPITALARIO');
    if (document.getElementById('category-hogar').checked) selectedCategories.push('HOGAR');
	
    // Obtener la familia seleccionada
    const selectedFamily = document.getElementById('family-filter').value;

    // Filtrar los productos por familia y categoría
    const filteredProducts = products.filter(product => {
        // const matchesFamily = selectedFamily ? product.family === selectedFamily : true;
		const matchesFamily = selectedFamily ? product.category.includes(selectedFamily) : true;

        // Convertir la cadena de categorías en un arreglo para poder hacer la comparación
        const productCategories = product.category.split(';');

        const matchesCategory = selectedCategories.length
            ? selectedCategories.some(category => productCategories.includes(category))
            : true;

        return matchesFamily && matchesCategory;
    });
	
    // Filtrar productos
    //filteredProducts = categoryFilter ? products.filter(product => product.category === categoryFilter) : products;

	const sortBy = document.getElementById('sort-by').value;
	
    // Ordenar productos
    if (sortBy === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'category') {
        filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
    }

    currentPage = 1; // Reiniciar a la primera página después de filtrar o ordenar
	
	// Actualizar la URL a catalog.html
    window.history.replaceState(null, '', 'catalog.html');
	productsCon = filteredProducts;
    displayProducts(filteredProducts);
    setupPagination(filteredProducts);
	/*
	const filterValue = document.getElementById('family-filter').value;
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselElement = document.getElementById('carouselExampleFade');
    const carousel = new bootstrap.Carousel(carouselElement);

    let selectedItemIndex = -1;

    if (filterValue === "") {
        // Si se selecciona "Todas las Familias", mostrar todos los banners y reanudar el carrusel
        carouselItems.forEach((item, index) => {
            item.style.display = 'block';
        });
        selectedItemIndex = 0;  // Puedes seleccionar el primer elemento al mostrar todos
		carousel.to(selectedItemIndex);  // Navegar al banner filtrado
        reanudarCarusel(carousel);
    } else {
        // Si se selecciona una familia específica, filtrar los banners y pausar el carrusel
        carouselItems.forEach((item, index) => {
            const family = item.getAttribute('data-family');
            if (family === filterValue) {
                item.style.display = 'block';  // Mostrar el banner que coincide con la familia seleccionada
                if (selectedItemIndex === -1) {
                    selectedItemIndex = index;  // Seleccionamos el primer elemento que aparece
                }
            } else {
                item.style.display = 'none';   // Ocultar los demás banners
            }
        });
        
        // Si se encontró un elemento visible después de filtrar, seleccionarlo
        if (selectedItemIndex !== -1) {
            carousel.to(selectedItemIndex);  // Navegar al banner filtrado
        }
        
        pausaCarusel(carousel);  // Pausar el ciclo del carrusel
    }*/
}
/*
function pausaCarusel(carouselParam){
	// Pausar el ciclo del carrusel
	carouselParam.pause(); 
}

function reanudarCarusel(carouselParamC){
	carouselParamC.cycle(); // Reanudar el ciclo del carrusel
}
*/
function displayProducts(filteredProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos productos

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col mb-5';

        // Verifica si product.image es un array y toma la primera imagen
        const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;

        col.innerHTML = `
            <div class="card h-100">
                <img class="card-img-top pointer" src="${imageSrc}" alt="${product.name}" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder" style="font-size:1.00rem">${product.name}</h5>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-primary btn-lg" href="#" onclick="event.preventDefault(); showPopup('${product.id}')">Ver Detalles</a></div>
                </div>
            </div>
        `;
        productList.appendChild(col);
    });
}

function setupPagination(filteredProducts) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpiar la paginación existente
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';
        if (i === currentPage) {
            li.classList.add('active'); // Resaltar la página actual
        }
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }

    // Botones de anterior y siguiente
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous" onclick="changePage(currentPage - 1)"><span aria-hidden="true">&laquo;</span></a>`;
    pagination.insertBefore(prevLi, pagination.firstChild);

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next" onclick="changePage(currentPage + 1)"><span aria-hidden="true">&raquo;</span></a>`;
    pagination.appendChild(nextLi);
}

function changePage(page) {
    const totalPages = Math.ceil(productsCon.length / itemsPerPage);
    if (page < 1 || page > totalPages) return; // Validar límites

    currentPage = page;

    // Actualizar la URL con la página actual
    const url = new URL(window.location.href);
    url.searchParams.set('page', currentPage);
    window.history.pushState({ page: currentPage }, '', url);

    displayProducts(productsCon);
    highlightCurrentPage(); // Resaltar página actual
}

function highlightCurrentPage() {
    const pagination = document.getElementById('pagination');
    const allPages = pagination.querySelectorAll('.page-item');
    allPages.forEach(page => page.classList.remove('active'));

    const currentPageLink = pagination.querySelector(`a.page-link[onclick="changePage(${currentPage})"]`);
    if (currentPageLink) {
        currentPageLink.parentElement.classList.add('active');
    }
}

let currentProductId = null; // ID del producto actual
let currentProductImages = []; // Imágenes del producto actual
let currentImageIndex = 0; // Índice de la imagen mostrada

function showPopup(productId) {
    if (productId === 'prev' || productId === 'next') {
        // Navegación entre productos
        const currentIndex = productsCon.findIndex(p => p.id === currentProductId);

        if (productId === 'prev' && currentIndex > 0) {
            currentProductId = productsCon[currentIndex - 1].id;
        } else if (productId === 'next' && currentIndex < productsCon.length - 1) {
            currentProductId = productsCon[currentIndex + 1].id;
        } else {
            return; // Si está en el límite, no hacemos nada
        }
    } else {
        // Producto inicial
        currentProductId = productId;
    }

    const product = products.find(p => p.id === currentProductId);

    if (product) {
        // Actualiza el contenido del popup
        document.getElementById('popup-title').innerText = product.name;

        // Configurar imágenes del carrusel
        currentProductImages = product.image;
        currentImageIndex = 0;
        updateCarousel();

        // Descripción
        document.getElementById('popup-description').innerHTML = product.description;

        // Categorías como etiquetas
        const categoriesContainer = document.getElementById('popup-categories');
        categoriesContainer.innerHTML = '';
        product.category.split(';').forEach(cat => {
            const categoryTag = document.createElement('span');
            categoryTag.innerText = cat;
            categoriesContainer.appendChild(categoryTag);
        });

        // Reiniciar el estado del acordeón
        const accordion = document.getElementById('accordionDescription');
        const allPanels = accordion.querySelectorAll('.accordion-collapse');
        const allButtons = accordion.querySelectorAll('.accordion-button');
        const firstPanel = document.getElementById('collapsePresentation');
        const firstButton = document.querySelector('#headingPresentation .accordion-button');

        allPanels.forEach(panel => panel.classList.remove('show'));
        allButtons.forEach(button => button.classList.add('collapsed'));
        firstPanel.classList.add('show');
        firstButton.classList.remove('collapsed');

        // Detalles
        document.getElementById('popup-presentation').innerHTML = product.presentation;
        document.getElementById('popup-availability').innerHTML = product.availability;
        document.getElementById('popup-types').innerHTML = product.types || 'No especificado';
        document.getElementById('popup-uses').innerHTML = product.uses || 'No especificado';
        document.getElementById('popup-productCode').innerHTML = product.productCode;

        // Mostrar el popup y el fondo
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('product-popup').style.display = 'block';

        // Actualizar estado de los botones
        const currentIndex = products.findIndex(p => p.id === currentProductId);
        document.getElementById('prev-product').disabled = currentIndex === 0;
        document.getElementById('next-product').disabled = currentIndex === products.length - 1;
    }
}

function closePopup() {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('product-popup').style.display = 'none';
}

function updatePopupContent(productId) {
    // Actualizar el contenido del popup (ya existente)
    showPopup(productId)
    // Deshabilitar los botones si es el primero o el último producto
    document.getElementById('prev-product').disabled = currentProductIndex === 0;
    document.getElementById('next-product').disabled = currentProductIndex === products.length - 1;
}

function updateCarousel() {
    const popupImage = document.getElementById('popup-image');
    const indicators = document.getElementById('image-indicators');

    // Actualiza la imagen principal
    popupImage.src = currentProductImages[currentImageIndex];

    // Actualiza los indicadores
    indicators.innerHTML = '';
    currentProductImages.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = index === currentImageIndex ? 'active' : '';
        indicator.onclick = () => setImage(index);
        indicators.appendChild(indicator);
    });
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
    updateCarousel();
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
    updateCarousel();
}

function setImage(index) {
    currentImageIndex = index;
    updateCarousel();
}

window.onclick = function(event) {
    const popup = document.getElementById('product-popup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
};

// Detectar cuando se presiona la tecla Escape
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { // Detecta si se presionó Esc
        closePopup(); // Llama a la función para cerrar el popup
    }
});
/*
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page'), 10);

    if (page && page > 0) {
        currentPage = page;
    } else {
        currentPage = 1; // Página predeterminada
    }

    displayProducts(filteredProducts);
    setupPagination(filteredProducts);
    highlightCurrentPage();
});
*/
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page'), 10);

    // Establecer la página actual desde el parámetro 'page'
    if (page && page > 0) {
        currentPage = page;
    } else {
        currentPage = 1; // Página predeterminada
    }

    // Leer y aplicar el filtro 'family' desde la URL
    const familyFilter = urlParams.get('family');
    if (familyFilter) {
        const familySelect = document.getElementById('family-filter');
        if (familySelect) {
            familySelect.value = familyFilter.toUpperCase(); // Asignar el valor al select de familia
        }
    }

    // Leer y aplicar el filtro 'categories' desde la URL
    const selectedCategories = urlParams.get('categories')?.split(',') || [];
    selectedCategories.forEach(category => {
        const categoryCheckbox = document.getElementById(`category-${category.toLowerCase()}`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true; // Marcar las categorías seleccionadas
        }
    });

    // Aplicar filtros y mostrar productos
    filterAndSortProducts();

    // Configurar la paginación y resaltar la página actual
    setupPagination(filteredProducts);
    highlightCurrentPage();
});


// Funciones de filtro
function filterProducts() {
    const category = document.getElementById('filter-category').value;
    const filteredProducts = products.filter(product => {
        return category === 'all' || product.category === category;
    });
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col mb-5';
        col.innerHTML = `
            <div class="card h-100">
                <img class="card-img-top pointer" src="${product.image}" alt="${product.name}" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${product.name}</h5>
                        <p>${product.description}</p>
                        <span class="text-muted">${product.presentation}</span>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-primary btn-lg" href="#" onclick="showPopup(${product.id})">Ver Detalles</a></div>
                </div>
            </div>
        `;
        productList.appendChild(col);
    });
}

// Función para ordenar productos
function sortProducts() {
    const sortOption = document.getElementById('sort-options').value;
    const sortedProducts = [...products];

    if (sortOption === 'name') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'price') {
        sortedProducts.sort((a, b) => a.price - b.price);
    }

    displayFilteredProducts(sortedProducts);
}




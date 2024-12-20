// Cargar el contenido del blog desde el archivo JSON
fetch('assets/data/blog.json')
  .then(response => response.json())
  .then(data => {
    // Llenar los campos de la sección de autor
    const authorImage = document.querySelector('.col-lg-3 img');
    const authorName = document.querySelector('.col-lg-3 .fw-bold');
    const authorCategory = document.querySelector('.col-lg-3 .text-muted');

    authorImage.src = data.author.author_image;
    authorImage.alt = data.author.author_name;
    authorName.textContent = data.author.author_name;
    authorCategory.textContent = data.author.author_category;

    // Contenedor para los posts
    const postsContainer = document.querySelector('.col-lg-9 section');

    data.posts.forEach(post => {
      // Crear elementos para cada post
      const postTitle = document.createElement('h1');
      const postDate = document.createElement('p');
      const postImage = document.createElement('img');
      const postContent = document.createElement('div');
      postContent.classList.add('post-content');

      postTitle.textContent = post.post_title;
      postDate.textContent = post.post_date;
      postImage.src = post.post_image;
      postImage.alt = post.post_title;
      postImage.classList.add('post-image'); // Añadir clase para tamaño

      // Agregar el título, fecha y la imagen al contenedor
      postsContainer.appendChild(postTitle);
      postsContainer.appendChild(postDate);
      postsContainer.appendChild(postImage);

      // Crear las categorías del post
      const postCategoriesContainer = document.createElement('div');
      postCategoriesContainer.classList.add('post-categories', 'mb-3');
      post.post_categories.forEach(category => {
        const categorySpan = document.createElement('span');
        categorySpan.classList.add('badge', 'bg-secondary', 'me-2');
        categorySpan.textContent = category;
        postCategoriesContainer.appendChild(categorySpan);
      });
      postsContainer.appendChild(postCategoriesContainer);

      // Llenar el contenido del post
      post.post_content.forEach(paragraph => {
        const paraElement = document.createElement('p');
        paraElement.textContent = paragraph;
        postContent.appendChild(paraElement);
      });
      postsContainer.appendChild(postContent);

      // Añadir subsecciones automáticamente
      let i = 1; // Contador para subsecciones
      while (post[`subsection_title_${i}`] && post[`subsection_content_${i}`]) {
        const subsectionTitle = document.createElement('h2');
        subsectionTitle.classList.add('fw-bolder', 'mb-4', 'mt-5');
        subsectionTitle.textContent = post[`subsection_title_${i}`];
        postsContainer.appendChild(subsectionTitle);

        post[`subsection_content_${i}`].forEach(subParagraph => {
          const subParaElement = document.createElement('p');
          subParaElement.textContent = subParagraph;
          postsContainer.appendChild(subParaElement);
        });

        i++; // Incrementar el contador
      }
    });
  })
  .catch(error => console.error('Error loading blog data:', error));

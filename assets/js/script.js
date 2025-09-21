// Configurazione API
const API_URL = 'https://striveschool-api.herokuapp.com/api/product/';
const STRIVESCHOOL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGNkMTZhODZmMzAyMjAwMTUxMDgwZTMiLCJpYXQiOjE3NTgyNzExNDQsImV4cCI6MTc1OTQ4MDc0NH0.gQFBPic0-yXwrfDjCkMl8gk4dDfKT-2Abfouj9qSLnM';

// Elementi DOM
const productsContainer = document.getElementById('productsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const noProducts = document.getElementById('noProducts');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const alertContainer = document.getElementById('alertContainer');

// Funzioni di utilità
function showAlert(message, type) {
    // Verifica se alertContainer esiste
    if (!alertContainer) {
        console.log('Alert:', message);
        return;
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alertDiv);
    
    // Rimuovi l'alert dopo 5 secondi
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col';
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="text-muted mb-2">${product.brand}</p>
                <p class="card-text">${product.description.substring(0, 90)}${product.description.length > 90 ? '...' : ''}</p>
                <p class="fw-bold text-primary fs-5 mb-3">€ ${product.price.toFixed(2)}</p>
                <div class="d-flex justify-content-between">
                    <a href="details.html?id=${product._id}" class="btn btn-primary">Scopri di più</a>
                    <a href="backoffice.html?id=${product._id}" class="btn btn-light">Modifica</a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Vecchia funzione loadProducts (mantenuta per compatibilità)
function loadProducts() {
    // Verifica se siamo nella pagina index
    if (!document.getElementById('productsContainer')) {
        console.log('Non siamo nella pagina index, skip caricamento prodotti');
        return;
    }
    
    // Mostra il loading spinner
    if (loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }
    
    // Nascondi eventuali messaggi di errore precedenti
    if (errorContainer) {
        errorContainer.classList.add('d-none');
    }
    if (noProducts) {
        noProducts.classList.add('d-none');
    }
    
    console.log('Tentativo di caricamento prodotti...');
    
    // Carica direttamente i prodotti usando l'API key
    fetchProducts();
    
    function fetchProducts() {
        fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${STRIVESCHOOL_API_KEY}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            // Nascondi il loading spinner
            if (loadingSpinner) {
                loadingSpinner.classList.add('d-none');
            }
            
            // Svuota il container dei prodotti
            if (productsContainer) {
                productsContainer.innerHTML = '';
            }
            
            if (products.length === 0) {
                // Mostra il messaggio di nessun prodotto
                if (noProducts) {
                    noProducts.classList.remove('d-none');
                }
            } else {
                // Crea e aggiungi le card dei prodotti
                products.forEach(product => {
                    const productCard = createProductCard(product);
                    if (productsContainer) {
                        productsContainer.appendChild(productCard);
                    }
                });
            }
        })
        .catch(error => {
            // Nascondi il loading spinner
            if (loadingSpinner) {
                loadingSpinner.classList.add('d-none');
            }
            
            // Mostra il messaggio di errore
            if (errorMessage) {
                errorMessage.textContent = `Si è verificato un errore: ${error.message}`;
            }
            if (errorContainer) {
                errorContainer.classList.remove('d-none');
            }
            
            console.error('Errore durante il caricamento dei prodotti:', error);
        });
    }
}

// Funzione per filtrare i prodotti in base alla ricerca
function filterProducts(products, searchTerm) {
    if (!searchTerm) return products;
    
    searchTerm = searchTerm.toLowerCase();
    return products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    });
}

// Gestione del form di ricerca
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="search"]');
    const searchTerm = searchInput.value.trim();
    
    // Memorizza il termine di ricerca in sessionStorage
    sessionStorage.setItem('searchTerm', searchTerm);
    
    // Se siamo già nella pagina index.html, filtra i prodotti
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        loadProducts(searchTerm);
    } else {
        // Altrimenti, reindirizza alla pagina index con il parametro di ricerca
        window.location.href = 'index.html?search=' + encodeURIComponent(searchTerm);
    }
}

// Aggiorna la funzione loadProducts per accettare un termine di ricerca
function loadProducts(searchTerm) {
    // Se non è specificato un termine di ricerca, controlla l'URL e sessionStorage
    if (!searchTerm) {
        const urlParams = new URLSearchParams(window.location.search);
        searchTerm = urlParams.get('search') || sessionStorage.getItem('searchTerm') || '';
        
        // Aggiorna il campo di ricerca con il termine corrente
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput && searchTerm) {
            searchInput.value = searchTerm;
        }
    }
    
    // Verifica se gli elementi esistono prima di accedere alle loro proprietà
    // (potrebbero non esistere in tutte le pagine)
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorContainer = document.getElementById('errorContainer');
    const noProducts = document.getElementById('noProducts');
    const productsContainer = document.getElementById('productsContainer');
    
    // Se non siamo nella pagina index, non procedere con il caricamento dei prodotti
    if (!productsContainer) {
        console.log('Non siamo nella pagina index, skip caricamento prodotti');
        return;
    }
    
    // Mostra il loading spinner
    if (loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }
    
    // Nascondi eventuali messaggi di errore precedenti
    if (errorContainer) {
        errorContainer.classList.add('d-none');
    }
    if (noProducts) {
        noProducts.classList.add('d-none');
    }
    
    console.log('Tentativo di caricamento prodotti...');
    
    // Carica direttamente i prodotti usando l'API key
    fetchProducts();
    
    function fetchProducts() {
        fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${STRIVESCHOOL_API_KEY}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            // Filtra i prodotti se c'è un termine di ricerca
            const filteredProducts = searchTerm ? filterProducts(products, searchTerm) : products;
            
            // Nascondi il loading spinner
            if (loadingSpinner) {
                loadingSpinner.classList.add('d-none');
            }
            
            // Svuota il container dei prodotti
            if (productsContainer) {
                productsContainer.innerHTML = '';
            }
            
            if (filteredProducts.length === 0) {
                if (searchTerm && noProducts) {
                    // Mostra un messaggio personalizzato per la ricerca senza risultati
                    noProducts.innerHTML = `
                        <h4 class="alert-heading">Nessun prodotto trovato</h4>
                        <p>La ricerca "${searchTerm}" non ha prodotto risultati. <a href="index.html" class="alert-link">Visualizza tutti i prodotti</a>.</p>
                    `;
                }
                // Mostra il messaggio di nessun prodotto
                if (noProducts) {
                    noProducts.classList.remove('d-none');
                }
            } else {
                // Crea e aggiungi le card dei prodotti
                filteredProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    if (productsContainer) {
                        productsContainer.appendChild(productCard);
                    }
                });
                
                // Se c'era un termine di ricerca, mostra un messaggio con il numero di risultati
                if (searchTerm) {
                    showAlert(`Trovati ${filteredProducts.length} prodotti per "${searchTerm}"`, 'info');
                }
            }
        })
        .catch(error => {
            // Nascondi il loading spinner
            loadingSpinner.classList.add('d-none');
            
            // Mostra il messaggio di errore
            errorMessage.textContent = `Si è verificato un errore: ${error.message}`;
            errorContainer.classList.remove('d-none');
            
            console.error('Errore durante il caricamento dei prodotti:', error);
        });
    }
}

// Carica i prodotti quando la pagina è pronta
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Aggiungi il gestore per il form di ricerca nella navbar
    const searchForm = document.querySelector('nav form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});
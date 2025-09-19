// Usa API_URL e STRIVESCHOOL_API_KEY da script.js
// Usa anche errorContainer, errorMessage, alertContainer e la funzione showAlert da script.js

// Elementi DOM specifici della pagina details
const loadingContainer = document.getElementById('loadingContainer');
const productContainer = document.getElementById('productContainer');

// Elementi del prodotto
const productImage = document.getElementById('productImage');
const productName = document.getElementById('productName');
const productBrand = document.getElementById('productBrand');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const editProductLink = document.getElementById('editProductLink');

function loadProductDetails() {
    // Ottieni l'ID del prodotto dall'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // Nessun ID prodotto specificato
        showError('Nessun ID prodotto specificato nell\'URL.');
        
        // Aggiungi un pulsante per tornare alla homepage
        setTimeout(() => {
            const errorContainer = document.getElementById('errorContainer');
            if (errorContainer) {
                const backButton = document.createElement('a');
                backButton.href = 'index.html';
                backButton.className = 'btn btn-primary mt-3';
                backButton.textContent = 'Torna alla homepage';
                errorContainer.appendChild(backButton);
            }
        }, 100); // Piccolo ritardo per assicurarsi che l'errore sia già visualizzato
        return;
    }
    
    // Aggiorna il link di modifica
    editProductLink.href = `backoffice.html?id=${productId}`;
    
    // Carica direttamente i dettagli del prodotto usando l'API key definita all'inizio
    fetchProductDetails();
    
    function fetchProductDetails() {
        fetch(`${API_URL}${productId}`, {
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
        .then(product => {
            // Popola i dettagli del prodotto
            productImage.src = product.imageUrl;
            productImage.alt = product.name;
            productName.textContent = product.name;
            productBrand.textContent = `Marca: ${product.brand}`;
            productPrice.textContent = `€ ${product.price.toFixed(2)}`;
            productDescription.textContent = product.description;
            
            // Aggiorna il titolo della pagina
            document.title = `${product.name} - SuperStore`;
            
            // Nascondi il loading spinner e mostra i dettagli del prodotto
            loadingContainer.classList.add('d-none');
            productContainer.classList.remove('d-none');
        })
        .catch(error => {
            showError(`Si è verificato un errore: ${error.message}`);
            console.error('Errore durante il caricamento dei dettagli del prodotto:', error);
        });
    }
}

function showError(message) {
    // Nascondi il loading spinner
    if (loadingContainer) {
        loadingContainer.classList.add('d-none');
    }
    
    // Ottieni riferimenti agli elementi globali
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    // Mostra il messaggio di errore
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    if (errorContainer) {
        errorContainer.classList.remove('d-none');
    }
}

// Carica i dettagli del prodotto quando la pagina è pronta
document.addEventListener('DOMContentLoaded', loadProductDetails);

// Configurazione API
const API_URL = 'https://striveschool-api.herokuapp.com/api/product/';
const STRIVESCHOOL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGNkMTZhODZmMzAyMjAwMTUxMDgwZTMiLCJpYXQiOjE3NTgyNzExNDQsImV4cCI6MTc1OTQ4MDc0NH0.gQFBPic0-yXwrfDjCkMl8gk4dDfKT-2Abfouj9qSLnM';

// Elementi DOM
const productForm = document.getElementById('productForm');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const brandInput = document.getElementById('brand');
const imageUrlInput = document.getElementById('imageUrl');
const priceInput = document.getElementById('price');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const deleteBtn = document.getElementById('deleteBtn');
const alertContainer = document.getElementById('alertContainer');

// Elementi anteprima
const previewImage = document.getElementById('previewImage');
const previewName = document.getElementById('previewName');
const previewBrand = document.getElementById('previewBrand');
const previewDescription = document.getElementById('previewDescription');
const previewPrice = document.getElementById('previewPrice');

// Modal di conferma
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
const confirmModalBody = document.getElementById('confirmModalBody');
const confirmModalBtn = document.getElementById('confirmModalBtn');

// Variabili globali
let productId = null;
let isEditMode = false;

// Funzioni di utilità
function showAlert(message, type) {
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

function updatePreview() {
    previewName.textContent = nameInput.value || 'Nome Prodotto';
    previewBrand.textContent = brandInput.value || 'Marca';
    previewDescription.textContent = descriptionInput.value || 'Descrizione del prodotto...';
    previewPrice.textContent = `€ ${parseFloat(priceInput.value || 0).toFixed(2)}`;
    
    if (imageUrlInput.value) {
        previewImage.src = imageUrlInput.value;
    } else {
        // Usa un'immagine locale o un data URI invece di un servizio esterno
        previewImage.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Ctext%20fill%3D%22%23AAAAAA%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20dy%3D%220.5em%22%20font-weight%3D%22bold%22%20x%3D%22100%22%20y%3D%22100%22%20text-anchor%3D%22middle%22%3EAnteprima%20Immagine%3C%2Ftext%3E%3C%2Fsvg%3E';
    }
}

function resetForm() {
    productForm.reset();
    updatePreview();
    
    if (isEditMode) {
        // Chiedi conferma prima di resettare in modalità modifica
        confirmModalBody.textContent = 'Sei sicuro di voler resettare il form? Tutte le modifiche andranno perse.';
        confirmModalBtn.onclick = () => {
            productForm.reset();
            updatePreview();
            confirmModal.hide();
        };
        confirmModal.show();
    } else {
        productForm.reset();
        updatePreview();
    }
}

function loadProductDetails(id) {
    // Usa direttamente l'API key definita all'inizio del file
    fetchProductDetails();
    
    function fetchProductDetails() {
        fetch(`${API_URL}${id}`, {
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
            // Popola il form con i dati del prodotto
            nameInput.value = product.name;
            descriptionInput.value = product.description;
            brandInput.value = product.brand;
            imageUrlInput.value = product.imageUrl;
            priceInput.value = product.price;
            
            // Aggiorna l'anteprima
            updatePreview();
            
            // Imposta la modalità modifica
            isEditMode = true;
            productId = id;
            // Aggiorna il testo del pulsante
            submitBtn.textContent = 'Aggiorna Prodotto';
            deleteBtn.classList.remove('d-none');
            
            showAlert('Prodotto caricato con successo!', 'info');
        })
        .catch(error => {
            console.error('Errore durante il caricamento del prodotto:', error);
            showAlert(`Errore durante il caricamento del prodotto: ${error.message}`, 'danger');
        });
    }
}

function saveProduct(event) {
    event.preventDefault();
    
    // Usa direttamente l'API key definita all'inizio del file
    saveProductData();
    
    function saveProductData() {
        // Crea l'oggetto prodotto dai dati del form
        const product = {
            name: nameInput.value,
            description: descriptionInput.value,
            brand: brandInput.value,
            imageUrl: imageUrlInput.value,
            price: parseFloat(priceInput.value)
        };
        
        // Determina l'URL e il metodo in base alla modalità (crea o modifica)
        const url = isEditMode ? `${API_URL}${productId}` : API_URL;
        const method = isEditMode ? 'PUT' : 'POST';
        
        // Invia la richiesta all'API
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRIVESCHOOL_API_KEY}`
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const actionText = isEditMode ? 'aggiornato' : 'creato';
            showAlert(`Prodotto ${actionText} con successo!`, 'success');
            
            if (!isEditMode) {
                // Se era una nuova creazione, resetta il form
                productForm.reset();
                updatePreview();
            }
        })
        .catch(error => {
            console.error('Errore durante il salvataggio del prodotto:', error);
            showAlert(`Errore durante il salvataggio del prodotto: ${error.message}`, 'danger');
        });
    }
}

async function deleteProduct() {
    if (!productId) return;
    
    // Chiedi conferma prima di eliminare
    confirmModalBody.textContent = 'Sei sicuro di voler eliminare questo prodotto? Questa azione non può essere annullata.';
    confirmModalBtn.onclick = async () => {
        try {
            // Usa direttamente l'API key definita all'inizio del file
            
            // Invia la richiesta DELETE all'API
            const response = await fetch(`${API_URL}${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${STRIVESCHOOL_API_KEY}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            await response.json();
            
            showAlert('Prodotto eliminato con successo!', 'success');
            confirmModal.hide();
            
            // Reindirizza alla homepage dopo l'eliminazione
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            console.error('Errore durante l\'eliminazione del prodotto:', error);
            showAlert(`Errore durante l'eliminazione del prodotto: ${error.message}`, 'danger');
            confirmModal.hide();
        }
    };
    confirmModal.show();
}

// Funzione rimossa: searchPexelsImages

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Controlla se c'è un ID prodotto nell'URL (per modalità modifica)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        loadProductDetails(id);
    }
    
    // Aggiorna l'anteprima quando i campi del form cambiano
    nameInput.addEventListener('input', updatePreview);
    descriptionInput.addEventListener('input', updatePreview);
    brandInput.addEventListener('input', updatePreview);
    imageUrlInput.addEventListener('input', updatePreview);
    priceInput.addEventListener('input', updatePreview);
    
    // Event listeners per i pulsanti
    productForm.addEventListener('submit', saveProduct);
    resetBtn.addEventListener('click', resetForm);
    deleteBtn.addEventListener('click', deleteProduct);
    
    // Event listeners per Pexels rimossi
});

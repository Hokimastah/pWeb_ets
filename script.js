// DOM Elements
const formTab = document.getElementById('form-tab');
const membersTab = document.getElementById('members-tab');
const formSection = document.getElementById('form-section');
const membersSection = document.getElementById('members-section');
const registrationForm = document.getElementById('registration-form');
const successModal = document.getElementById('success-modal');
const closeModal = document.querySelector('.close');
const viewMembersBtn = document.getElementById('view-members-btn');
const clearAllBtn = document.getElementById('clear-all');
const emptyMessage = document.getElementById('empty-message');
const membersCards = document.getElementById('members-cards');

// Form elements
const fullname = document.getElementById('fullname');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const birthdate = document.getElementById('birthdate');
const address = document.getElementById('address');

// Error elements
const fullnameError = document.getElementById('fullname-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');
const genderError = document.getElementById('gender-error');
const birthdateError = document.getElementById('birthdate-error');
const addressError = document.getElementById('address-error');

// Tab switching
formTab.addEventListener('click', () => {
    formTab.classList.add('active');
    membersTab.classList.remove('active');
    formSection.style.display = 'block';
    membersSection.style.display = 'none';
});

membersTab.addEventListener('click', () => {
    membersTab.classList.add('active');
    formTab.classList.remove('active');
    membersSection.style.display = 'block';
    formSection.style.display = 'none';
    displayMembers();
});

// Form validation
function validateForm() {
    let isValid = true;
    
    // Reset errors
    resetErrors();
    
    // Validate fullname
    if (fullname.value.trim() === '') {
        showError(fullname, fullnameError, 'Nama lengkap harus diisi');
        isValid = false;
    } else if (fullname.value.trim().length < 3) {
        showError(fullname, fullnameError, 'Nama lengkap minimal 3 karakter');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        showError(email, emailError, 'Email harus diisi');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError(email, emailError, 'Format email tidak valid');
        isValid = false;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10,13}$/;
    if (phone.value.trim() === '') {
        showError(phone, phoneError, 'Nomor HP harus diisi');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim())) {
        showError(phone, phoneError, 'Nomor HP harus berisi 10-13 digit angka');
        isValid = false;
    }
    
    // Validate gender
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        genderError.textContent = 'Pilih gender Anda';
        isValid = false;
    }
    
    // Validate birthdate
    if (birthdate.value === '') {
        showError(birthdate, birthdateError, 'Tanggal lahir harus diisi');
        isValid = false;
    } else {
        const today = new Date();
        const birthdateValue = new Date(birthdate.value);
        const age = today.getFullYear() - birthdateValue.getFullYear();
        
        if (age < 17) {
            showError(birthdate, birthdateError, 'Usia minimal 17 tahun');
            isValid = false;
        }
    }
    
    // Validate address
    if (address.value.trim() === '') {
        showError(address, addressError, 'Alamat harus diisi');
        isValid = false;
    } else if (address.value.trim().length < 10) {
        showError(address, addressError, 'Alamat terlalu pendek (minimal 10 karakter)');
        isValid = false;
    }
    
    return isValid;
}

function showError(input, errorElement, message) {
    input.classList.add('invalid');
    errorElement.textContent = message;
}

function resetErrors() {
    const allInputs = registrationForm.querySelectorAll('.form-control');
    const allErrors = registrationForm.querySelectorAll('.error');
    
    allInputs.forEach(input => input.classList.remove('invalid'));
    allErrors.forEach(error => error.textContent = '');
}

// Form submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Get form data
        const member = {
            id: Date.now(),
            fullname: fullname.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            gender: document.querySelector('input[name="gender"]:checked').value,
            birthdate: birthdate.value,
            address: address.value.trim()
        };
        
        // Save to local storage
        saveToLocalStorage(member);
        
        // Reset form
        registrationForm.reset();
        
        // Show success modal
        successModal.style.display = 'block';
    }
});

// Local Storage Functions
function saveToLocalStorage(member) {
    let members = getFromLocalStorage();
    members.push(member);
    localStorage.setItem('members', JSON.stringify(members));
}

function getFromLocalStorage() {
    const membersData = localStorage.getItem('members');
    return membersData ? JSON.parse(membersData) : [];
}

function removeFromLocalStorage(id) {
    let members = getFromLocalStorage();
    members = members.filter(member => member.id !== id);
    localStorage.setItem('members', JSON.stringify(members));
}

function clearLocalStorage() {
    localStorage.removeItem('members');
    displayMembers();
}

// Display members
function displayMembers() {
    const members = getFromLocalStorage();
    
    membersCards.innerHTML = '';
    
    if (members.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        
        members.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.classList.add('member-card');
            
            const birthdateFormatted = new Date(member.birthdate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            memberCard.innerHTML = `
                <button class="delete-member" data-id="${member.id}">×</button>
                <h3>${member.fullname}</h3>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>No. HP:</strong> ${member.phone}</p>
                <p><strong>Gender:</strong> ${member.gender}</p>
                <p><strong>Tanggal Lahir:</strong> ${birthdateFormatted}</p>
                <p><strong>Alamat:</strong> ${member.address}</p>
            `;
            
            membersCards.appendChild(memberCard);
        });
    }
}

// Modal functionality
closeModal.addEventListener('click', () => {
    successModal.style.display = 'none';
});

viewMembersBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    formTab.classList.remove('active');
    membersTab.classList.add('active');
    formSection.style.display = 'none';
    membersSection.style.display = 'block';
    displayMembers();
});

// Clear all data
clearAllBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data member?')) {
        clearLocalStorage();
    }
});

// Handle member deletion
membersCards.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-member')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
            removeFromLocalStorage(id);
            displayMembers();
        }
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Initial display
window.addEventListener('DOMContentLoaded', () => {
    // Initialize display
    formSection.style.display = 'block';
    membersSection.style.display = 'none';
});
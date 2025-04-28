// DOM Elements
const formTab = document.getElementById('form-tab');
const membersTab = document.getElementById('members-tab');
const formSection = document.getElementById('form-section');
const membersSection = document.getElementById('members-section');
const registrationForm = document.getElementById('registration-form');
const successModal = document.getElementById('success-modal');
const closeModal = document.querySelector('.close');
const viewMembersBtn = document.getElementById('view-members-btn');
const membersCards = document.getElementById('members-cards');
const clearAllBtn = document.getElementById('clear-all');
const emptyMessage = document.getElementById('empty-message');

// Initial setup
let members = JSON.parse(localStorage.getItem('members')) || [];
updateMembersList();

// Tab navigation
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
});

// Form validation and submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Get form values
        const newMember = {
            id: Date.now(),
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            birthdate: document.getElementById('birthdate').value,
            address: document.getElementById('address').value
        };
        
        // Save to localStorage
        members.push(newMember);
        localStorage.setItem('members', JSON.stringify(members));
        
        // Reset form
        registrationForm.reset();
        
        // Show success modal
        successModal.style.display = 'block';
        
        // Update members list
        updateMembersList();
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    
    // Validate fullname
    const fullname = document.getElementById('fullname');
    const fullnameError = document.getElementById('fullname-error');
    if (fullname.value.trim() === '') {
        fullnameError.textContent = 'Nama lengkap harus diisi';
        fullname.classList.add('invalid');
        isValid = false;
    } else {
        fullnameError.textContent = '';
        fullname.classList.remove('invalid');
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        emailError.textContent = 'Email harus diisi';
        email.classList.add('invalid');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Format email tidak valid';
        email.classList.add('invalid');
        isValid = false;
    } else {
        emailError.textContent = '';
        email.classList.remove('invalid');
    }
    
    // Validate phone
    const phone = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    // Indonesian phone number format: starts with 0 or +62, followed by numbers
    const phoneRegex = /^([0-9]{10,14}|\+62[0-9]{9,12})$/;
    if (phone.value.trim() === '') {
        phoneError.textContent = 'Nomor HP harus diisi';
        phone.classList.add('invalid');
        isValid = false;
    } else if (!phoneRegex.test(phone.value)) {
        phoneError.textContent = 'Format nomor HP tidak valid';
        phone.classList.add('invalid');
        isValid = false;
    } else {
        phoneError.textContent = '';
        phone.classList.remove('invalid');
    }
    
    // Validate gender
    const genderError = document.getElementById('gender-error');
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    if (!genderChecked) {
        genderError.textContent = 'Pilih gender';
        isValid = false;
    } else {
        genderError.textContent = '';
    }
    
    // Validate birthdate
    const birthdate = document.getElementById('birthdate');
    const birthdateError = document.getElementById('birthdate-error');
    if (birthdate.value === '') {
        birthdateError.textContent = 'Tanggal lahir harus diisi';
        birthdate.classList.add('invalid');
        isValid = false;
    } else {
        birthdateError.textContent = '';
        birthdate.classList.remove('invalid');
    }
    
    // Validate address
    const address = document.getElementById('address');
    const addressError = document.getElementById('address-error');
    if (address.value.trim() === '') {
        addressError.textContent = 'Alamat harus diisi';
        address.classList.add('invalid');
        isValid = false;
    } else {
        addressError.textContent = '';
        address.classList.remove('invalid');
    }
    
    return isValid;
}

// Update members list in UI
function updateMembersList() {
    membersCards.innerHTML = '';
    
    if (members.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        
        members.forEach(member => {
            // Format date for display: YYYY-MM-DD to DD-MM-YYYY
            const birthDate = new Date(member.birthdate);
            const formattedDate = `${birthDate.getDate().toString().padStart(2, '0')}-${(birthDate.getMonth() + 1).toString().padStart(2, '0')}-${birthDate.getFullYear()}`;
            
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            memberCard.innerHTML = `
                <button class="delete-member" data-id="${member.id}">×</button>
                <h3>${member.fullname}</h3>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>Nomor HP:</strong> ${member.phone}</p>
                <p><strong>Gender:</strong> ${member.gender}</p>
                <p><strong>Tanggal Lahir:</strong> ${formattedDate}</p>
                <p><strong>Alamat:</strong> ${member.address}</p>
            `;
            membersCards.appendChild(memberCard);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-member').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteMember(id);
            });
        });
    }
}

// Delete a single member
function deleteMember(id) {
    members = members.filter(member => member.id !== id);
    localStorage.setItem('members', JSON.stringify(members));
    updateMembersList();
}

// Delete all members
clearAllBtn.addEventListener('click', () => {
    if (confirm('Anda yakin ingin menghapus semua data member?')) {
        members = [];
        localStorage.setItem('members', JSON.stringify(members));
        updateMembersList();
    }
});

// Modal controls
closeModal.addEventListener('click', () => {
    successModal.style.display = 'none';
});

viewMembersBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    formTab.classList.remove('active');
    membersTab.classList.add('active');
    formSection.style.display = 'none';
    membersSection.style.display = 'block';
});

window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Input validation real-time
document.getElementById('fullname').addEventListener('input', function() {
    validateField(this, document.getElementById('fullname-error'), 
        value => value.trim() !== '', 'Nama lengkap harus diisi');
});

document.getElementById('email').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(this, document.getElementById('email-error'),
        value => emailRegex.test(value), 'Format email tidak valid');
});

document.getElementById('phone').addEventListener('input', function() {
    const phoneRegex = /^([0-9]{10,14}|\+62[0-9]{9,12})$/;
    validateField(this, document.getElementById('phone-error'),
        value => phoneRegex.test(value), 'Format nomor HP tidak valid');
});

document.getElementById('address').addEventListener('input', function() {
    validateField(this, document.getElementById('address-error'),
        value => value.trim() !== '', 'Alamat harus diisi');
});

// Helper function for field validation
function validateField(field, errorElement, validationFn, errorMessage) {
    if (field.value.trim() === '') {
        errorElement.textContent = '';
        field.classList.remove('invalid');
        return;
    }
    
    if (!validationFn(field.value)) {
        errorElement.textContent = errorMessage;
        field.classList.add('invalid');
    } else {
        errorElement.textContent = '';
        field.classList.remove('invalid');
    }
}

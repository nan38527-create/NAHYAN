    // Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        alert(`Thank you, ${name}! Your message has been sent. We will get back to you at ${email} soon.`);
        contactForm.reset();
    });
}

// Custom Smooth Scrolling for All Internal Links (Slower)
function smoothScrollTo(target, duration = 2000) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

const allLinks = document.querySelectorAll('a[href^="#"]');

allLinks.forEach(item => {
    item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            smoothScrollTo(target, 1000); // 1 second
        }
        // Close mobile menu after click
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Amenity prices
const amenityPrices = {
    'Free Wi-Fi': 20,
    'Swimming Pool': 50,
    'Buffet': 100,
    'Gym': 30,
    'Spa': 150
};

// Function to calculate total price
function calculateTotalPrice() {
    const roomSelect = document.getElementById('roomType');
    const selectedOption = roomSelect.options[roomSelect.selectedIndex];
    let total = 0;
    if (selectedOption.value) {
        const priceMatch = selectedOption.text.match(/AED (\d+)/);
        if (priceMatch) {
            total = parseInt(priceMatch[1]);
        }
    }
    const checkedAmenities = document.querySelectorAll('input[name="amenities"]:checked');
    checkedAmenities.forEach(checkbox => {
        total += amenityPrices[checkbox.value] || 0;
    });
    document.getElementById('totalPrice').textContent = `Total Price: AED ${total}/night`;
}

// Progressive form logic
function showNextStep(currentStep) {
    const nextStep = document.querySelector(`.step[data-step="${currentStep + 1}"]`);
    if (nextStep) {
        nextStep.style.display = 'block';
    }
}

// Step 1: Room selection
document.getElementById('roomType').addEventListener('change', (e) => {
    if (e.target.value) {
        showNextStep(1);
    }
    calculateTotalPrice();
});

// Step 2: Amenities
document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checked = document.querySelectorAll('input[name="amenities"]:checked');
        if (checked.length > 0) {
            showNextStep(2);
        }
        calculateTotalPrice();
    });
});

// Step 3: Dates
document.getElementById('checkIn').addEventListener('change', checkDates);
document.getElementById('checkOut').addEventListener('change', checkDates);

function checkDates() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    if (checkIn && checkOut) {
        showNextStep(3);
    }
}

// Step 4: Guests
document.getElementById('guestName1').addEventListener('input', (e) => {
    if (e.target.value.trim()) {
        showNextStep(4);
    }
});

// Step 5: Email and Phone
document.getElementById('email').addEventListener('input', checkContact);
document.getElementById('phone').addEventListener('input', checkContact);

function checkContact() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    if (email && phone) {
        showNextStep(5);
    }
}

// Booking Form
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestNames = Array.from(document.querySelectorAll('input[name="guestName[]"]')).map(input => input.value).join(', ');
        alert(`Thank you, ${guestNames}! Your booking request has been sent. We will contact you soon.`);
        bookingForm.reset();
        // Reset guest count and remove extra fields
        const guestNamesContainer = document.getElementById('guestNamesContainer');
        const extraRows = guestNamesContainer.querySelectorAll('.guest-label-row:not(:first-child)');
        extraRows.forEach(row => {
            const input = row.nextElementSibling;
            if (input && input.tagName === 'INPUT') {
                guestNamesContainer.removeChild(input);
            }
            guestNamesContainer.removeChild(row);
        });
        guestCount = 1;
        // Reset total price
        document.getElementById('totalPrice').textContent = 'Total Price: AED 0/night';
    });
}

// Add Guest Functionality
let guestCount = 1;
const addGuestBtn = document.getElementById('addGuestBtn');
const guestNamesContainer = document.getElementById('guestNamesContainer');

if (addGuestBtn && guestNamesContainer) {
    addGuestBtn.addEventListener('click', () => {
        guestCount++;
        const newLabelRow = document.createElement('div');
        newLabelRow.className = 'guest-label-row';

        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', `guestName${guestCount}`);
        newLabel.textContent = `Guest Name ${guestCount}:`;

        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = `guestName${guestCount}`;
        newInput.name = 'guestName[]';
        newInput.required = true;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '-';
        removeBtn.addEventListener('click', () => {
            const row = removeBtn.closest('.guest-label-row');
            const input = row.nextElementSibling;
            if (input && input.tagName === 'INPUT') {
                guestNamesContainer.removeChild(input);
            }
            guestNamesContainer.removeChild(row);
            guestCount--;
        });

        newLabelRow.appendChild(newLabel);
        newLabelRow.appendChild(removeBtn);

        guestNamesContainer.appendChild(newLabelRow);
        guestNamesContainer.appendChild(newInput);
    });
}

    // Auto-resize textarea on contact page
    document.addEventListener('DOMContentLoaded', () => {
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.style.resize = 'none';
            messageTextarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }

        // Save booking form data when navigating to sickness.html
        const reportSicknessLink = document.querySelector('a[href="sickness.html"]');
        if (reportSicknessLink) {
            reportSicknessLink.addEventListener('click', () => {
                // Save current form data to localStorage before navigating
                const bookingForm = document.querySelector('#bookingForm');
                if (bookingForm) {
                    const formData = new FormData(bookingForm);
                    const data = {};
                    for (let [key, value] of formData.entries()) {
                        if (data[key]) {
                            if (Array.isArray(data[key])) {
                                data[key].push(value);
                            } else {
                                data[key] = [data[key], value];
                            }
                        } else {
                            data[key] = value;
                        }
                    }
                    localStorage.setItem('bookingFormData', JSON.stringify(data));
                }
            });
        }

        // Load saved form data on booking page
        if (window.location.pathname.includes('booking.html')) {
            const savedData = localStorage.getItem('bookingFormData');
            if (savedData) {
                const data = JSON.parse(savedData);
                const bookingForm = document.querySelector('#bookingForm');
                if (bookingForm) {
                    Object.keys(data).forEach(key => {
                        const elements = bookingForm.querySelectorAll(`[name="${key}"]`);
                        elements.forEach(element => {
                            if (element.type === 'checkbox' || element.type === 'radio') {
                                if (Array.isArray(data[key])) {
                                    if (data[key].includes(element.value)) {
                                        element.checked = true;
                                    }
                                } else {
                                    if (element.value === data[key]) {
                                        element.checked = true;
                                    }
                                }
                            } else {
                                element.value = data[key];
                            }
                        });
                    });
                    // Trigger calculations and step progression
                    calculateTotalPrice();
                    // Show appropriate steps based on filled data
                    if (data.roomType) showNextStep(1);
                    if (data.amenities) showNextStep(2);
                    if (data.checkIn && data.checkOut) showNextStep(3);
                    if (data['guestName[]']) showNextStep(4);
                    if (data.email && data.phone) showNextStep(5);
                }
            }
        }
    });



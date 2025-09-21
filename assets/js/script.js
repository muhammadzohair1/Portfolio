// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('back-to-top');

    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        backToTop.classList.add('active');
    } else {
        header.classList.remove('scrolled');
        backToTop.classList.remove('active');
    }
});

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbar = document.querySelector('.navbar');
            const menuIcon = document.querySelector('#menu-icon');
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
            }
        }
    });
});

// Mobile Menu Toggle
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// Typewriter Effect
const roles = [
    "Graphic Designer",
    "Video Editor",
    "Front-End Developer",
    "Backend Developer",
    "UI / UX Designer",
    "MySQL Developer",
    "XML Developer",
    "Freelancer",
];

const roleSpan = document.getElementById("role-text");
const cursorSpan = document.querySelector(".cursor");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];
    const visibleText = currentRole.substring(0, charIndex);
    roleSpan.textContent = visibleText;

    if (!isDeleting && charIndex < currentRole.length) {
        charIndex++;
        setTimeout(typeRole, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeRole, 50);
    } else {
        if (!isDeleting) {
            isDeleting = true;
            setTimeout(typeRole, 1000);
        } else {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 200);
        }
    }
}

typeRole();

// Contact Form Elements
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const ageInput = document.getElementById("age");
const messageInput = document.getElementById("message");

// Real-time Field Validation
document.querySelectorAll('.input-animate').forEach(input => {
    input.addEventListener('input', function () {
        validateField(this);
    });
    input.addEventListener('blur', function () {
        validateField(this);
    });
});

function validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    field.classList.remove('error', 'valid');
    errorElement.textContent = '';

    if (field.value.trim() === '') return;

    let isValid = true;
    let errorMessage = '';

    if (field.id === 'name') {
        isValid = field.value.trim().length >= 3;
        errorMessage = 'Name must be at least 3 characters';
    }
    else if (field.id === 'email') {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        errorMessage = 'Please enter a valid email';
    }
    else if (field.id === 'phone') {
        const digits = field.value.replace(/\D/g, '');
        isValid = digits.length === 11;
        errorMessage = 'Phone must be exactly 11 digits';
    }
    else if (field.id === 'age') {
        const age = parseInt(field.value);
        isValid = !isNaN(age) && age >= 1 && age <= 100;
        errorMessage = 'Age must be between 1-100';
    }
    else if (field.id === 'message') {
        isValid = field.value.trim().length >= 10;
        errorMessage = 'Message must be at least 10 characters';
    }

    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    } else {
        field.classList.add('valid');
    }
}

// Input Restrictions
phoneInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 11) {
        this.value = this.value.slice(0, 11);
    }
    validateField(this);
});

ageInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3);
    }
    validateField(this);
});

// Auto-complete email
emailInput.addEventListener('blur', function () {
    if (this.value && !this.value.includes('@')) {
        this.value += '@gmail.com';
    }
    validateField(this);
});

// Form Submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    document.querySelectorAll('.input-animate').forEach(validateField);

    const errorFields = document.querySelectorAll('.input-animate.error');
    if (errorFields.length > 0) {
        return;
    }

    const submitBtn = form.querySelector('input[type="submit"]');
    submitBtn.value = "Sending...";
    submitBtn.disabled = true;

    try {
        // Save to Firestore
        await firebase.firestore().collection('contactSubmissions').add({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.replace(/\D/g, ''),
            age: parseInt(ageInput.value),
            message: messageInput.value.trim(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Show success
        alert("Message sent successfully!");
        form.reset();
        document.querySelectorAll('.input-animate').forEach(field => {
            field.classList.remove('valid');
        });
    } catch (error) {
        console.error("Error saving contact form:", error);
        alert("Failed to send message. Please try again.");
    } finally {
        submitBtn.value = "Send Message";
        submitBtn.disabled = false;
    }
});

// Initialize AOS with more options
AOS.init({
    duration: 800,
    delay: 100,
    once: false,
    mirror: true,
    easing: 'ease-in-out-quad'
});

// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');

    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (position < screenPosition) {
            el.classList.add('aos-animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Run once on page load

// Hire button functionality
document.querySelector('.btn-group .btn[href="#"]')?.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'hire.html';
});

// Firebase initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Registration Function
async function registerUser(email, password) {
    try {
        const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);

        await firebase.firestore().collection('users').doc(userCred.user.uid).set({
            email: email,
            isAdmin: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log("User successfully registered!");
    } catch (error) {
        console.error("Registration error:", error.message);
    }
}

// Admin Check Function
async function checkAdmin() {
    const user = firebase.auth().currentUser;
    if (user) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        return userDoc.exists && userDoc.data().isAdmin === true;
    }
    return false;
}
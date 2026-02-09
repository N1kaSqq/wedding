// ===================================
// Smooth Scroll Navigation
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('navigation');
    const navHeight = nav.offsetHeight;
    
    // Smooth scroll to section on click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // Active Navigation Link on Scroll
    // ===================================
    
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttle scroll event for performance
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                setActiveLink();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Set active link on page load
    setActiveLink();
    
    // ===================================
    // Form Validation & Submission
    // ===================================
    
    const form = document.getElementById('wedding-form');
    const formStatus = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous status
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            
            // Basic validation
            const fullname = document.getElementById('fullname').value.trim();
            const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
            const attendanceSelected = Array.from(attendanceInputs).some(input => input.checked);
            
            if (!fullname) {
                showFormStatus('Пожалуйста, укажите ваше ФИО', 'error');
                document.getElementById('fullname').focus();
                return;
            }
            
            if (!attendanceSelected) {
                showFormStatus('Пожалуйста, укажите, будете ли вы присутствовать на свадьбе', 'error');
                return;
            }
            
            // Collect form data
            const formData = new FormData(form);
            
            // Handle multiple checkboxes for food and drinks preferences
            const foodPreferences = [];
            document.querySelectorAll('input[name="food_preferences"]:checked').forEach(cb => {
                foodPreferences.push(cb.value);
            });
            
            const drinksPreferences = [];
            document.querySelectorAll('input[name="drinks_preferences"]:checked').forEach(cb => {
                drinksPreferences.push(cb.value);
            });
            
            // Remove old entries and add combined values
            formData.delete('food_preferences');
            formData.delete('drinks_preferences');
            formData.append('food_preferences', foodPreferences.join(', ') || 'Не указано');
            formData.append('drinks_preferences', drinksPreferences.join(', ') || 'Не указано');
            
            // Disable submit button during submission
            const submitButton = form.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            
            try {
                // Submit to Formspree
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showFormStatus('Спасибо! Ваши данные успешно отправлены. До встречи на свадьбе!', 'success');
                    form.reset();
                    
                    // Scroll to success message
                    setTimeout(() => {
                        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showFormStatus('Произошла ошибка при отправке. Пожалуйста, проверьте данные и попробуйте снова.', 'error');
                    } else {
                        showFormStatus('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('Произошла ошибка сети. Пожалуйста, проверьте подключение к интернету и попробуйте снова.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
    
    // Helper function to show form status
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    }
    
    // ===================================
    // Input Validation Feedback
    // ===================================
    
    // Add real-time validation for required fields
    const fullnameInput = document.getElementById('fullname');
    if (fullnameInput) {
        fullnameInput.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderBottomColor = '#dc3545';
            } else {
                this.style.borderBottomColor = '';
            }
        });
        
        fullnameInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderBottomColor = '';
            }
        });
    }
    
    // ===================================
    // Accessibility Enhancements
    // ===================================
    
    // Allow keyboard navigation for custom radio/checkbox
    document.querySelectorAll('.radio-label, .checkbox-label').forEach(label => {
        label.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const input = this.querySelector('input');
                if (input) {
                    input.click();
                }
            }
        });
    });
    
    // ===================================
    // Mobile Menu Enhancement (if needed)
    // ===================================
    
    // Close mobile menu after clicking a link (for future enhancement)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add mobile menu close logic here if you add a hamburger menu later
        });
    });
    
    // ===================================
    // Browser Compatibility Checks
    // ===================================
    
    // Check for IntersectionObserver support (alternative to scroll event)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: `-${navHeight + 50}px 0px 0px 0px`,
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // ===================================
    // Performance Optimization
    // ===================================
    
    // Lazy load images (if you add more images later)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
    
    // ===================================
    // Console Log for Debugging
    // ===================================
    
    console.log('Wedding website loaded successfully!');
});

// Ensure the DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    // Debounce function for scroll events
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Portfolio Video Hover Functionality
    const initVideoHover = () => {
        const videoBoxes = document.querySelectorAll('.video-box');

        videoBoxes.forEach(box => {
            const video = box.querySelector('video');

            // Play video on mouse over
            box.addEventListener('mouseover', () => {
                video.play().catch(error => {
                    console.error('Error playing video:', error);
                });
            });

            // Pause video on mouse leave
            box.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; // Reset video to start
            });

            // Accessibility: Play/Pause video on focus/blur for keyboard users
            box.addEventListener('focus', () => {
                video.play().catch(error => {
                    console.error('Error playing video on focus:', error);
                });
            });

            box.addEventListener('blur', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    };

    // Validate Email Format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Validate Contact Form
    const validateForm = (params) => {
        if (!params.from_name) {
            alert('Please enter your name.');
            return false;
        }
        if (!params.from_email || !validateEmail(params.from_email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (!params.message) {
            alert('Please fill in the message.');
            return false;
        }
        return true;
    };

    // Initialize EmailJS and Contact Form Submission
    const initContactForm = () => {
        // Ensure EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS SDK not loaded.');
            return;
        }

        // Initialize EmailJS with your user ID
        emailjs.init("YOUR_USER_ID"); // Replace with your actual EmailJS user ID

        const contactForm = document.getElementById('contact-form');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Disable the submit button to prevent multiple submissions
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Prepare the email parameters
            const emailParams = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Validate the form
            if (!validateForm(emailParams)) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                return;
            }

            // Send the email via EmailJS
            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailParams)
                .then(response => {
                    alert('Your message has been sent successfully!');
                    contactForm.reset(); // Clear form after submission
                })
                .catch(error => {
                    console.error('EmailJS Error:', error);
                    alert('Failed to send your message, please try again later.');
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                });
        });
    };

    // Filter Portfolio by Category
    const initPortfolioFilter = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.video-box');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button styling
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        item.setAttribute('aria-hidden', 'false');
                    } else {
                        item.style.display = 'none';
                        item.setAttribute('aria-hidden', 'true');
                    }
                });
            });

            // Accessibility: Allow filtering via keyboard (Enter key)
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    };

    // Reveal Elements on Scroll
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;

            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < windowHeight - 100) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
        };

        // Apply debounce to the scroll event
        window.addEventListener('scroll', debounce(revealOnScroll, 100));
        // Trigger once on load
        revealOnScroll();
    };

    // Initialize all functionalities
    const init = () => {
        initVideoHover();
        initPortfolioFilter();
        initScrollReveal();
        initContactForm();
    };

    init();
});

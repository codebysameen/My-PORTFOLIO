/**
 * ==============================================================================
 * SAMEEN PORTFOLIO - JAVASCRIPT LOGIC
 * Features:
 * 1. Mobile Navigation & Hamburger Menu Toggle (with accessibility & outside click)
 * 2. Sticky & Blurred Navbar with Scroll Detection
 * 3. Animated Typing Effect (Vanilla JS loop with realistic timing)
 * 4. Smooth Anchor Link Navigation
 * 5. Dynamic Profile Image & Fallback Handling
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. MOBILE HAMBURGER MENU TOGGLE
  // ----------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu open/close
  function toggleMobileMenu() {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    hamburgerBtn.classList.toggle('active');
    navMenuWrapper.classList.toggle('active');

    // Prevent background scrolling when menu is active on mobile
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Close mobile menu safely
  function closeMobileMenu() {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.classList.remove('active');
    navMenuWrapper.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && navMenuWrapper) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (event) => {
      if (!navMenuWrapper.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on pressing the Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenuWrapper.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }


  // ----------------------------------------------------------------------------
  // 2. STICKY NAVBAR ON SCROLL EFFECT
  // ----------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Listen to scroll events with passive optimization
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Initial check on page load
  handleNavbarScroll();


  // ----------------------------------------------------------------------------
  // 3. ANIMATED TYPING TEXT EFFECT (VANILLA JAVASCRIPT)
  // ----------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  
  // The three roles to cycle through
  const roles = [
    'Web Developer',
    'Software Engineer',
    'Creative Web Designer'
  ];

  let roleIndex = 0;       // Index of the current role in array
  let charIndex = 0;       // Current character index being typed/deleted
  let isDeleting = false;  // Flag indicating whether text is currently deleting

  // Accessibility: Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typing speed configuration (in milliseconds)
  const typingSpeed = 100;      // Speed when typing a letter
  const deletingSpeed = 45;     // Speed when deleting a letter
  const pauseAfterTyping = 1900; // Pause after word is fully typed
  const pauseAfterDelete = 400;  // Pause before starting next word

  function typeEffect() {
    if (!typingElement) return;

    // Respect reduced motion preference
    if (prefersReducedMotion) {
      typingElement.textContent = roles[0];
      return;
    }

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      // Remove a character
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add a character
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine timing for next tick
    let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

    // Word is completely typed
    if (!isDeleting && charIndex === currentRole.length) {
      nextDelay = pauseAfterTyping;
      isDeleting = true;
    }
    // Word is completely erased
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Move to next word (loops seamlessly)
      nextDelay = pauseAfterDelete;
    }

    setTimeout(typeEffect, nextDelay);
  }

  // Start the typing animation loop
  typeEffect();


  // ----------------------------------------------------------------------------
  // 4. SCROLL DOWN INDICATOR & SMOOTH SCROLLING
  // ----------------------------------------------------------------------------
  const scrollIndicator = document.getElementById('scroll-indicator');

  /**
   * Smoothly scrolls to target section, taking into account the fixed navbar offset.
   * If the target section (#about) has not yet been added to the DOM,
   * it smoothly scrolls down past the hero section so the indicator always works.
   */
  function smoothScrollToTarget(targetId) {
    const targetElement = document.querySelector(targetId);
    const navHeight = navbar ? navbar.offsetHeight : 70;

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });
      return true;
    } else if (targetId === '#about' || targetId === '#projects' || targetId === '#contact') {
      // If the target section is scheduled for next steps, smoothly scroll down past hero
      const heroSection = document.getElementById('home') || document.querySelector('.hero-section');
      const targetPosition = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) : window.innerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      return false;
    }
    return false;
  }

  // Scroll Down Indicator click & keyboard handling
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToTarget('#about');
    });

    // Keyboard accessibility: allow pressing Enter or Space
    scrollIndicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        smoothScrollToTarget('#about');
      }
    });
  }

  // Smooth scrolling for all anchor links (#home, #about, #skills, etc.)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {
    // Avoid attaching duplicate click listener to scrollIndicator
    if (anchor === scrollIndicator) return;

    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      e.preventDefault();
      const scrolledToElement = smoothScrollToTarget(targetId);

      // If clicked from navbar, update the active link indicator
      if (scrolledToElement && anchor.classList.contains('nav-link')) {
        navLinks.forEach(link => link.classList.remove('active'));
        anchor.classList.add('active');
      }
    });
  });


  // ----------------------------------------------------------------------------
  // 5. PROFILE IMAGE PLACEHOLDER FALLBACK (HERO & ABOUT)
  // ----------------------------------------------------------------------------
  function setupImageFallback(imgId, placeholderId) {
    const imgEl = document.getElementById(imgId);
    const placeholderEl = document.getElementById(placeholderId);

    if (imgEl && placeholderEl) {
      // Check if image is already loaded from disk/cache
      if (imgEl.complete && imgEl.naturalWidth > 0) {
        imgEl.style.display = 'block';
        placeholderEl.style.display = 'none';
      }

      imgEl.addEventListener('load', () => {
        imgEl.style.display = 'block';
        placeholderEl.style.display = 'none';
      });

      imgEl.addEventListener('error', () => {
        // Safe auto-retry if Windows created double-extension profile.jpg.jpeg
        if (imgEl.src && !imgEl.src.endsWith('.jpeg') && (imgId === 'profile-img' || imgId === 'about-profile-img')) {
          imgEl.src = 'assets/profile.jpg.jpeg';
        } else {
          imgEl.style.display = 'none';
          placeholderEl.style.display = 'flex';
        }
      });
    }
  }

  // Set up profile and project image fallbacks
  setupImageFallback('profile-img', 'profile-svg-placeholder');
  setupImageFallback('about-profile-img', 'about-svg-placeholder');
  setupImageFallback('proj1-img', 'proj1-placeholder');
  setupImageFallback('proj2-img', 'proj2-placeholder');
  setupImageFallback('proj3-img', 'proj3-placeholder');


  // ----------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Immediately reveal elements that are already within or near the viewport on load
  function checkInitialReveals() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight + 80 && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }

  if (prefersReducedMotion) {
    // Respect user's reduced-motion preference: immediately show all elements without motion
    revealElements.forEach(el => el.classList.add('revealed'));
  } else if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    // Trigger initial check for visible elements
    checkInitialReveals();
  } else {
    // Fallback for older browsers: show elements immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  // ----------------------------------------------------------------------------
  // 7. ACTIVE NAVIGATION ON SCROLL (SCROLLSPY OBSERVER)
  // ----------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: 0.4
    });

    trackedSections.forEach(section => sectionObserver.observe(section));
  }


  // ----------------------------------------------------------------------------
  // 8. DOWNLOAD CV BUTTON & TOAST NOTIFICATION
  // ----------------------------------------------------------------------------
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const cvStatusBadge = document.getElementById('cv-status-badge');
  const toast = document.getElementById('aesthetic-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (downloadCvBtn) {
    const cvUrl = downloadCvBtn.getAttribute('href');

    // Check if the CV file exists in the assets folder
    fetch(cvUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          // File exists: update badge to Ready and allow native download
          if (cvStatusBadge) cvStatusBadge.textContent = 'Ready';
        } else {
          // File not found: mark as placeholder
          if (cvStatusBadge) cvStatusBadge.textContent = 'Placeholder';
        }
      })
      .catch(() => {
        if (cvStatusBadge) cvStatusBadge.textContent = 'Placeholder';
      });

    // Click handler for CV button
    downloadCvBtn.addEventListener('click', (e) => {
      fetch(cvUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            e.preventDefault();
            showToast('✦ CV Placeholder: Please place "Sameen-CV.pdf" inside the assets folder to enable direct download!');
          }
        })
        .catch(() => {
          e.preventDefault();
          showToast('✦ CV Placeholder: Please place "Sameen-CV.pdf" inside the assets folder to enable direct download!');
        });
    });
  }

  // ----------------------------------------------------------------------------
  // 9. SKILL PROGRESS BARS & COUNTER ANIMATION (OPTIONAL / BACKWARD-COMPATIBLE)
  // ----------------------------------------------------------------------------
  const progressFills = document.querySelectorAll('.skill-progress-fill');
  if (progressFills.length > 0) {
    const skillCards = document.querySelectorAll('.skill-card');

    function animateSkillCounter(element, targetValue, duration = 1200) {
      if (!element) return;
      const startTime = performance.now();
      const startValue = 0;

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);

        element.textContent = currentValue + '%';

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = targetValue + '%';
        }
      }

      requestAnimationFrame(step);
    }

    if (prefersReducedMotion) {
      skillCards.forEach(card => {
        const progressFill = card.querySelector('.skill-progress-fill');
        const percentageText = card.querySelector('.skill-percentage');
        if (progressFill) {
          const target = progressFill.getAttribute('data-progress') || '0';
          progressFill.style.width = target + '%';
          if (percentageText) {
            percentageText.textContent = target + '%';
          }
        }
      });
    } else if ('IntersectionObserver' in window) {
      const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const progressFill = card.querySelector('.skill-progress-fill');
            const percentageText = card.querySelector('.skill-percentage');

            if (progressFill) {
              const target = parseInt(progressFill.getAttribute('data-progress'), 10) || 0;
              progressFill.style.width = target + '%';

              if (percentageText) {
                const targetNumber = parseInt(percentageText.getAttribute('data-target'), 10) || target;
                animateSkillCounter(percentageText, targetNumber, 1200);
              }
            }
            observer.unobserve(card);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
      });

      skillCards.forEach(card => skillObserver.observe(card));
    }
  }


  // ----------------------------------------------------------------------------
  // 10. PROJECT BUTTON PLACEHOLDER CLICKS & NOTIFICATIONS
  // ----------------------------------------------------------------------------
  const projectPlaceholderButtons = document.querySelectorAll('.project-btn[data-placeholder="true"]');

  projectPlaceholderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      // If the link still points to a placeholder, show friendly notification toast
      if (href === '#' || href === '#projects') {
        e.preventDefault();
        const actionType = btn.classList.contains('project-btn-view') ? 'Live Demo' : 'Source Code';
        const projectTitle = btn.getAttribute('data-project') || 'Project';
        showToast(`✦ ${projectTitle} (${actionType}): Replace '#projects' with your live link in index.html!`);
      }
    });
  });


  // ----------------------------------------------------------------------------
  // 11. EDUCATION TIMELINE ANIMATION (INTERSECTION OBSERVER)
  // ----------------------------------------------------------------------------
  const timelineWrapper = document.getElementById('timeline-wrapper');
  const timelineLine = document.getElementById('timeline-line');

  if ('IntersectionObserver' in window && timelineWrapper && timelineLine) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineLine.classList.add('active');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px 50px 0px'
    });

    timelineObserver.observe(timelineWrapper);
  }


  // ----------------------------------------------------------------------------
  // 12. CONTACT FORM VALIDATION & INTEGRATION
  // ----------------------------------------------------------------------------
  /**
   * EMAIL INTEGRATION CONFIGURATION:
   * To receive real messages in your inbox, set your form endpoint below:
   * Examples:
   * 1. Formspree:  'https://formspree.io/f/YOUR_FORM_ID'
   * 2. FormSubmit: 'https://formsubmit.co/your-email@example.com'
   * 3. Leave empty ('') for client-side validation mode with prefilled mailto action.
   */
  const EMAIL_ENDPOINT = ''; // <--- Enter your form endpoint URL here when ready
  const FALLBACK_INBOX_EMAIL = 'sameend790@gmail.com'; // <--- Destination for email client fallback

  const contactForm        = document.getElementById('contact-form');
  const formSuccess        = document.getElementById('form-success');
  const btnSendAnother     = document.getElementById('btn-send-another');
  const btnOpenMail        = document.getElementById('btn-open-mail');
  const successHeading     = document.getElementById('success-heading');
  const successBody        = document.getElementById('success-body');
  const successNameDisplay = document.getElementById('success-name-display');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function setFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) {
      input.classList.add('error-state');
      input.classList.remove('success-state');
    }
    if (error) error.textContent = message;
  }

  function setFieldSuccess(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) {
      input.classList.remove('error-state');
      input.classList.add('success-state');
    }
    if (error) error.textContent = '';
  }

  function clearFieldState(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error-state', 'success-state');
    if (error) error.textContent = '';
  }

  function setupMailtoLink(name, email, subject, message) {
    if (!btnOpenMail) return;
    const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
    const mailBody = encodeURIComponent(`Hi Sameen,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
    btnOpenMail.href = `mailto:${FALLBACK_INBOX_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput    = document.getElementById('contact-name');
      const emailInput   = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name    = nameInput ? nameInput.value.trim() : '';
      const email   = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validate Full Name
      if (!name) {
        setFieldError('contact-name', 'error-name', 'Please enter your full name.');
        isValid = false;
      } else if (name.length < 2) {
        setFieldError('contact-name', 'error-name', 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        setFieldSuccess('contact-name', 'error-name');
      }

      // Validate Email
      if (!email) {
        setFieldError('contact-email', 'error-email', 'Please enter your email address.');
        isValid = false;
      } else if (!validateEmail(email)) {
        setFieldError('contact-email', 'error-email', 'Please enter a valid email (e.g. you@example.com).');
        isValid = false;
      } else {
        setFieldSuccess('contact-email', 'error-email');
      }

      // Validate Subject
      if (!subject) {
        setFieldError('contact-subject', 'error-subject', 'Please enter a subject.');
        isValid = false;
      } else if (subject.length < 3) {
        setFieldError('contact-subject', 'error-subject', 'Subject must be at least 3 characters.');
        isValid = false;
      } else {
        setFieldSuccess('contact-subject', 'error-subject');
      }

      // Validate Message
      if (!message) {
        setFieldError('contact-message', 'error-message', 'Please enter your message.');
        isValid = false;
      } else if (message.length < 10) {
        setFieldError('contact-message', 'error-message', 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        setFieldSuccess('contact-message', 'error-message');
      }

      if (isValid) {
        const submitBtn = document.getElementById('btn-send-message');

        // Check if a real backend endpoint has been provided
        if (EMAIL_ENDPOINT && EMAIL_ENDPOINT.trim() !== '') {
          const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending Message...</span> <span class="btn-send-emoji">⏳</span>';
          }

          fetch(EMAIL_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              email: email,
              subject: subject,
              message: message
            })
          })
          .then(res => {
            if (res.ok) {
              contactForm.style.display = 'none';
              if (formSuccess) {
                if (successHeading) successHeading.textContent = 'Message Delivered! 💌';
                if (successBody) {
                  successBody.innerHTML = `Thank you, <strong class="highlight-name-inline">${escapeHtml(name)}</strong>! Your message was delivered successfully to Sameen's inbox.`;
                }
                if (btnOpenMail) btnOpenMail.style.display = 'none';
                formSuccess.classList.add('visible');
              }
            } else {
              throw new Error('Server returned an error');
            }
          })
          .catch(() => {
            // Friendly fallback if network or endpoint fails
            showToast('⚠️ Could not connect to form endpoint. You can send directly using your email app.');
            contactForm.style.display = 'none';
            if (formSuccess) {
              if (successHeading) successHeading.textContent = 'Message Ready to Send! ✉️';
              if (successBody) {
                successBody.innerHTML = `Thank you, <strong class="highlight-name-inline">${escapeHtml(name)}</strong>! Your message has been prepared. Click below to open your email client and send directly.`;
              }
              setupMailtoLink(name, email, subject, message);
              formSuccess.classList.add('visible');
            }
          })
          .finally(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
          });

        } else {
          // Preview Mode (default): Honest feedback without falsely claiming delivery
          contactForm.style.display = 'none';
          if (formSuccess) {
            if (successNameDisplay) successNameDisplay.textContent = name;
            setupMailtoLink(name, email, subject, message);
            formSuccess.classList.add('visible');
          }
        }
      }
    });

    // Live inline validation — clears the red border as soon as the user starts correcting a field
    ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      el.addEventListener('input', () => {
        // If the field currently shows an error and the user has typed something, remove the red border
        if (el.classList.contains('error-state') && el.value.trim()) {
          el.classList.remove('error-state');
          const errorKey  = id.replace('contact-', '');
          const errorSpan = document.getElementById('error-' + errorKey);
          if (errorSpan) errorSpan.textContent = '';
        }
      });
    });
  }

  // --- "Send Another Message" button — resets the form ---
  if (btnSendAnother && contactForm) {
    btnSendAnother.addEventListener('click', () => {
      // Reset all native values
      contactForm.reset();

      // Clear validation states
      ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach((id) => {
        const errorKey = id.replace('contact-', '');
        clearFieldState(id, 'error-' + errorKey);
      });

      // Show the form again, hide the success message
      contactForm.style.display = '';
      if (formSuccess) formSuccess.classList.remove('visible');
    });
  }


  // ----------------------------------------------------------------------------
  // 13. SOCIAL LINK PLACEHOLDER NOTIFICATIONS
  //     (shows a toast when a social button still uses '#contact' as its href)
  // ----------------------------------------------------------------------------
  const socialPlaceholderLinks = document.querySelectorAll('.social-link-btn[data-social-placeholder="true"]');

  socialPlaceholderLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#contact') {
        e.preventDefault();
        // Try to read the visible label inside the button, fall back to "Social"
        const labelEl   = link.querySelector('.social-label');
        const socialName = labelEl ? labelEl.textContent.trim() : 'Social';
        showToast(`✦ ${socialName} Placeholder: Replace '#contact' with your actual ${socialName} profile URL in index.html!`);
      }
    });
  });


  // ----------------------------------------------------------------------------
  // 14. FOOTER — AUTO-UPDATE COPYRIGHT YEAR & BACK TO TOP
  // ----------------------------------------------------------------------------
  const footerYearEl = document.getElementById('footer-year');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});

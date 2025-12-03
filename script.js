// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
const animateElements = document.querySelectorAll('.project-card, .skill-category, .stat-item, .contact-item, .education-item, .certification-card, .honor-card');
animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Skill progress bars animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Counter animation for stats
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            entry.target.classList.add('counted');
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target;
                }
            };
            
            updateCounter();
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        console.log('Form submitted:', formData);
        
        // Show success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Message Sent! ✓';
        submitButton.style.background = '#10b981';
        submitButton.disabled = true;
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
        
        // In a real application, you would:
        // 1. Send data to your backend API
        // 2. Handle errors appropriately
        // 3. Show proper success/error messages
    });
}

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Fetch repository details including README and file structure
async function fetchRepoDetails(repo) {
    const username = 'AAmitha';
    const repoName = repo.name;
    
    try {
        // Try to fetch README file
        const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`);
        if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            const readmeContent = atob(readmeData.content);
            
            // Extract description from README (first paragraph or first few lines)
            const lines = readmeContent.split('\n').filter(line => line.trim());
            let description = '';
            
            // Look for description in common README patterns
            for (let i = 0; i < Math.min(10, lines.length); i++) {
                const line = lines[i].trim();
                // Skip headers, badges, and empty lines
                if (line && !line.startsWith('#') && !line.startsWith('![') && !line.startsWith('[') && line.length > 20) {
                    description = line.replace(/[#*`]/g, '').trim();
                    break;
                }
            }
            
            if (description) {
                return description;
            }
        }
    } catch (error) {
        console.log(`Could not fetch README for ${repoName}`);
    }
    
    // If README fetch fails, try to get repository contents to infer description
    try {
        const contentsResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`);
        if (contentsResponse.ok) {
            const contents = await contentsResponse.json();
            const fileNames = contents.map(item => item.name.toLowerCase());
            
            // Generate description based on file structure
            return generateDescriptionFromFiles(repoName, fileNames, repo.language);
        }
    } catch (error) {
        console.log(`Could not fetch contents for ${repoName}`);
    }
    
    return null;
}

// Generate description based on repository name and files
function generateDescriptionFromFiles(repoName, fileNames, language) {
    const nameLower = repoName.toLowerCase();
    
    // Project-specific descriptions based on name and files
    if (nameLower.includes('patient-readmission') || nameLower.includes('readmission')) {
        return 'AI-powered system to predict patient readmission risk and generate automated appeal letters. Uses machine learning models to analyze patient data and create personalized appeal documentation for healthcare providers.';
    }
    
    if (nameLower.includes('risklens') || nameLower.includes('credit-risk') || nameLower.includes('risk')) {
        return 'AI-powered credit risk scoring system that analyzes financial data to assess borrower creditworthiness. Implements advanced machine learning algorithms for accurate risk prediction and credit decision support.';
    }
    
    if (nameLower.includes('usa-accidents') || nameLower.includes('accident')) {
        return 'Comprehensive analysis of USA traffic accidents dataset. Includes data exploration, visualization, and predictive modeling to identify accident patterns, risk factors, and trends across different regions and conditions.';
    }
    
    if (nameLower.includes('house') && nameLower.includes('price') || nameLower.includes('price-predictor')) {
        return 'Machine learning model to predict house prices based on various features like location, size, amenities, and market conditions. Uses regression techniques and feature engineering for accurate price estimation.';
    }
    
    if (nameLower.includes('ai-log-error') || nameLower.includes('log-error-explainer') || (nameLower.includes('log') && nameLower.includes('error'))) {
        return 'A Streamlit application that uses AI to analyze error logs and provide detailed explanations, root cause analysis, fix suggestions, and sample corrected code. Powered by OpenAI GPT models for intelligent error diagnosis.';
    }
    
    if (nameLower.includes('wafer') && (nameLower.includes('defect') || nameLower.includes('classification'))) {
        return 'A lightweight full-stack prototype that ingests wafer map imagery or ASCII grid data, renders it on HTML5 canvas, and uses Google Gemini 1.5 Flash for visual reasoning and defect classification. Features Tailwind-powered UI with live debug logging.';
    }
    
    if (nameLower.includes('service-outage') || nameLower.includes('rca-assistant') || (nameLower.includes('outage') && nameLower.includes('rca'))) {
        return 'An interactive Python assistant that behaves like an expert NOC engineer. Ingests raw network logs, dynamically adjusts persona to system type, uses Gemini API for intelligent root cause analysis, and persists results in SQLite with Markdown reports.';
    }
    
    // Generic descriptions based on file types
    if (fileNames.some(f => f.includes('notebook') || f.includes('.ipynb'))) {
        return `Data science project using ${language || 'Python'} for analysis and machine learning. Includes exploratory data analysis, model development, and insights generation.`;
    }
    
    if (fileNames.some(f => f.includes('model') || f.includes('train') || f.includes('predict'))) {
        return `Machine learning project implementing ${language || 'Python'} models for prediction and analysis. Includes data preprocessing, model training, and evaluation.`;
    }
    
    if (fileNames.some(f => f.includes('app') || f.includes('streamlit') || f.includes('flask'))) {
        return `Interactive ${language || 'Python'} application with web interface. Combines data science and software development for user-friendly data analysis and visualization.`;
    }
    
    return null;
}

// Manual fallback projects (used if GitHub API fails)
const fallbackProjects = [
    {
        name: 'AI-Log-Error-Explainer-Agent',
        description: 'An intelligent AI-powered tool that analyzes log files and error messages to provide detailed explanations and actionable solutions for debugging.',
        html_url: 'https://github.com/AAmitha/AI-Log-Error-Explainer-Agent',
        language: 'Python',
        topics: ['AI', 'Machine Learning', 'NLP', 'Log Analysis', 'Error Detection']
    },
    {
        name: 'automated-wafer-defect-classification-tool',
        description: 'Automated classification system for detecting and categorizing defects in semiconductor wafers using computer vision and machine learning.',
        html_url: 'https://github.com/AAmitha/automated-wafer-defect-classification-tool',
        language: 'Python',
        topics: ['Machine Learning', 'Computer Vision', 'Image Processing', 'Classification']
    },
    {
        name: 'Service-Outage-RCA-Assistant',
        description: 'AI assistant that helps generate comprehensive Root Cause Analysis (RCA) reports for service outages, improving incident response efficiency.',
        html_url: 'https://github.com/AAmitha/Service-Outage-RCA-Assistant',
        language: 'Python',
        topics: ['AI', 'NLP', 'RCA', 'Incident Management', 'Automation']
    },
    {
        name: 'Patient-Readmission-Predictor-with-AI-Appeal-Letter',
        description: 'Machine learning model to predict patient readmissions and generate AI-powered appeal letters for healthcare providers.',
        html_url: 'https://github.com/AAmitha/Patient-Readmission-Predictor-with-AI-Appeal-Letter',
        language: 'Python',
        topics: ['Machine Learning', 'Healthcare', 'NLP', 'Predictive Analytics']
    },
    {
        name: 'RiskLens-AI-Powered-Credit-Risk-Scoring',
        description: 'Advanced credit risk scoring system using AI and machine learning to assess borrower creditworthiness and predict default probabilities.',
        html_url: 'https://github.com/AAmitha/RiskLens-AI-Powered-Credit-Risk-Scoring',
        language: 'Python',
        topics: ['Machine Learning', 'Finance', 'Risk Analysis', 'Credit Scoring']
    },
    {
        name: 'USA-Accidents',
        description: 'Comprehensive analysis of US traffic accident data using data science techniques to identify patterns, risk factors, and insights.',
        html_url: 'https://github.com/AAmitha/USA-Accidents',
        language: 'Python',
        topics: ['Data Science', 'Data Analysis', 'Visualization', 'Statistics']
    },
    {
        name: 'House_Price_Predictor',
        description: 'Machine learning model to predict house prices based on various features using regression techniques and feature engineering.',
        html_url: 'https://github.com/AAmitha/House_Price_Predictor',
        language: 'Python',
        topics: ['Machine Learning', 'Regression', 'Predictive Modeling', 'Data Science']
    }
];

// Fetch GitHub repositories and display them
async function fetchGitHubRepos() {
    const username = 'AAmitha';
    const projectsGrid = document.getElementById('projectsGrid');
    
    if (!projectsGrid) return;
    
    // Priority projects to show first
    const priorityProjects = [
        'AI-Log-Error-Explainer-Agent',
        'automated-wafer-defect-classification-tool',
        'Service-Outage-RCA-Assistant',
        'Patient-Readmission-Predictor-with-AI-Appeal-Letter',
        'RiskLens-AI-Powered-Credit-Risk-Scoring',
        'USA-Accidents',
        'House_Price_Predictor'
    ];
    
    try {
        // Fetch repositories from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API Error:', response.status, errorText);
            throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
        }
        
        const repos = await response.json();
        
        // Filter out forks, archived repos, and unwanted projects
        const excludedProjects = ['careerforage', 'careerforge', 'aamitha', 'aamitha-akepati'];
        let publicRepos = repos.filter(repo => {
            const repoNameLower = repo.name.toLowerCase();
            return !repo.fork && 
                   !repo.archived && 
                   !excludedProjects.includes(repoNameLower) &&
                   !repoNameLower.includes('careerforge') &&
                   !repoNameLower.includes('aamitha');
        });
        
        // Separate priority projects and other projects
        const priorityRepos = publicRepos.filter(repo => priorityProjects.includes(repo.name));
        const otherRepos = publicRepos.filter(repo => !priorityProjects.includes(repo.name));
        
        // Sort priority repos by the order in priorityProjects array
        priorityRepos.sort((a, b) => {
            return priorityProjects.indexOf(a.name) - priorityProjects.indexOf(b.name);
        });
        
        // Sort other repos by updated date
        otherRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        // Combine: priority first, then others
        const sortedRepos = [...priorityRepos, ...otherRepos];
        
        // Clear loading message
        projectsGrid.innerHTML = '';
        
        if (sortedRepos.length === 0) {
            projectsGrid.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);"><p>No public repositories found.</p></div>';
            return;
        }
        
        // Fetch details and create project cards for each repository
        for (const repo of sortedRepos) {
            const enhancedRepo = { ...repo };
            
            // Try to get better description from repository details
            if (!repo.description || repo.description.length < 50) {
                const betterDescription = await fetchRepoDetails(repo);
                if (betterDescription) {
                    enhancedRepo.description = betterDescription;
                }
            }
            
            const projectCard = createProjectCard(enhancedRepo);
            projectsGrid.appendChild(projectCard);
        }
        
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        console.error('Error details:', {
            message: error.message,
            username: username,
            stack: error.stack
        });
        
        // Show more detailed error message
        let errorMessage = 'Unable to load projects from GitHub.';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage += '<br><br>Possible causes:<br>• Network connection issue<br>• GitHub API rate limit exceeded<br>• CORS policy blocking the request';
        } else if (error.message.includes('404')) {
            errorMessage += `<br><br>GitHub username "${username}" not found.`;
        }
        
        // If API fails, show fallback projects
        console.warn('GitHub API failed, showing fallback projects');
        projectsGrid.innerHTML = '';
        
        // Display fallback projects
        fallbackProjects.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Create a project card element
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Get language color or default to black
    const language = repo.language || 'Other';
    const languageColors = {
        'Python': '#3776AB',
        'JavaScript': '#F7DF1E',
        'TypeScript': '#3178C6',
        'Java': '#ED8B00',
        'C++': '#00599C',
        'C': '#A8B9CC',
        'HTML': '#E34C26',
        'CSS': '#1572B6',
        'R': '#276DC3',
        'Jupyter Notebook': '#DA5B0B',
        'SQL': '#336791',
        'Shell': '#89E051'
    };
    const langColor = languageColors[language] || '#000000';
    
    // Format description (limit to 180 characters)
    let description = repo.description || 'No description available.';
    if (description.length > 180) {
        description = description.substring(0, 180) + '...';
    }
    
    // Format repository name (replace hyphens/underscores with spaces, capitalize properly)
    const repoName = repo.name
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    // Get topics/tags - prioritize certain tags
    const topics = repo.topics || [];
    let techTags = [];
    
    if (topics.length > 0) {
        // Use topics if available (up to 6)
        techTags = topics.slice(0, 6);
    } else if (language && language !== 'Other') {
        // Use language if no topics
        techTags = [language];
    } else {
        // Default tags based on repo name
        const nameLower = repo.name.toLowerCase();
        if (nameLower.includes('ai') || nameLower.includes('ml') || nameLower.includes('machine-learning')) {
            techTags = ['Machine Learning', 'AI'];
        } else if (nameLower.includes('predict') || nameLower.includes('model')) {
            techTags = ['Data Science', 'ML'];
        } else {
            techTags = ['Data Science'];
        }
    }
    
    // Add language to tags if not already present and we have space
    if (language && language !== 'Other' && !techTags.includes(language) && techTags.length < 6) {
        techTags.push(language);
    }
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-placeholder">${repoName}</div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${repoName}</h3>
            <p class="project-description">${description}</p>
            <div class="project-tech">
                ${techTags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                ${repo.homepage ? `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Enhanced scroll animations with stagger effect
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

// Apply stagger animation to skill tags
document.addEventListener('DOMContentLoaded', () => {
    // Load resume data and render sections. If resume data is not available, fall back to built-in content.
    loadResumeData().then(data => {
        if (!data) return;
        renderHero(data);
        renderAbout(data);
        renderStats(data);
        renderContact(data);
        renderSkills(data);
        renderExperience(data);
        renderEducation(data);
        renderCertifications(data);
        renderHonors(data);
        renderProjects(data);
    }).catch(err => {
        console.error('Error loading resume data:', err);
        // If resume loading fails, still show fallback projects
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            fallbackProjects.forEach(repo => {
                const projectCard = createProjectCard(repo);
                projectsGrid.appendChild(projectCard);
            });
        }
    });
    
    // Animate skill tags with stagger
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = `opacity 0.3s ease ${index * 0.03}s, transform 0.3s ease ${index * 0.03}s`;
        staggerObserver.observe(tag);
    });
    
    // Animate coursework list items
    const courseworkItems = document.querySelectorAll('.coursework-list li');
    courseworkItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        staggerObserver.observe(item);
    });
    
    // Animate honor details list items
    const honorDetailsItems = document.querySelectorAll('.honor-details li');
    honorDetailsItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-15px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;
        staggerObserver.observe(item);
    });
    
    // Add subtle parallax effect to hero background
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');
                if (hero && scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Add CSS for enhanced animations and active states
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: currentColor; }
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Smooth scroll behavior for all sections */
    section {
        scroll-margin-top: 80px;
    }
    
    /* Enhanced hover effects */
    .certification-card,
    .honor-card,
    .education-item {
        will-change: transform;
    }
    
    /* Loading state for projects */
    .loading-message {
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ------------------ Resume data loader & renderers ------------------
async function loadResumeData() {
    try {
        const resp = await fetch('data/resume.json');
        if (!resp.ok) throw new Error('Resume JSON not found');
        return await resp.json();
    } catch (err) {
        console.warn('Could not load resume.json:', err);
        return null;
    }
}

function safeText(text) {
    return text ? text : '';
}

function renderHero(data) {
    const nameEl = document.querySelector('.name');
    const titleEl = document.querySelector('.title');
    const descEl = document.querySelector('.hero-description');
    if (nameEl) nameEl.textContent = safeText(data.name);
    if (titleEl) titleEl.textContent = safeText(data.title);
    if (descEl && Array.isArray(data.summary)) descEl.textContent = data.summary[0] || '';
}

function renderAbout(data) {
    const aboutText = document.querySelector('.about-text');
    if (!aboutText) return;
    aboutText.innerHTML = '';
    if (Array.isArray(data.summary)) {
        data.summary.forEach(par => {
            const p = document.createElement('p');
            p.textContent = par;
            aboutText.appendChild(p);
        });
    }
}

function renderStats(data) {
    try {
        document.querySelectorAll('.stat-number').forEach(el => {
            const key = el.getAttribute('data-target');
            // Keep existing handling by setting data-target appropriately
            if (key && data.stats) {
                // Map known keys: years (4), accuracy (96), efficiency (40)
                if (parseInt(key) === 4) el.setAttribute('data-target', data.stats.years_experience);
                if (parseInt(key) === 96) el.setAttribute('data-target', data.stats.model_accuracy);
                if (parseInt(key) === 40) el.setAttribute('data-target', data.stats.efficiency_improvement);
            }
        });
    } catch (e) { }
}

function renderContact(data) {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo || !data.contact) return;
    contactInfo.innerHTML = '';
    // Email
    const emailBlock = createContactItem('Email', `mailto:${data.contact.email}`, data.contact.email, 'M');
    contactInfo.appendChild(emailBlock);
    // Phone
    const phoneBlock = createContactItem('Phone', `tel:${data.contact.phone.replace(/[^0-9+]/g, '')}`, data.contact.phone, 'P');
    contactInfo.appendChild(phoneBlock);
    // Location
    const loc = document.createElement('div'); loc.className = 'contact-item';
    loc.innerHTML = `
        <div class="contact-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>
        <div><h3>Location</h3><p>${safeText(data.contact.location)}</p></div>
    `;
    contactInfo.appendChild(loc);
    // Optional profile links
    if (data.contact.github) contactInfo.appendChild(createContactItem('GitHub', data.contact.github, data.contact.github, 'G'));
    if (data.contact.linkedin) contactInfo.appendChild(createContactItem('LinkedIn', data.contact.linkedin, data.contact.linkedin, 'in'));
    if (data.contact.kaggle) contactInfo.appendChild(createContactItem('Kaggle', data.contact.kaggle, data.contact.kaggle, 'K'));
    if (data.contact.hackerrank) contactInfo.appendChild(createContactItem('HackerRank', data.contact.hackerrank, data.contact.hackerrank, 'H'));
    if (data.contact.leetcode) contactInfo.appendChild(createContactItem('LeetCode', data.contact.leetcode, data.contact.leetcode, 'L'));
}

function createContactItem(title, href, text, short) {
    const wrap = document.createElement('div');
    wrap.className = 'contact-item';
    wrap.innerHTML = `
        <div class="contact-icon">${short ? `<span style="font-weight:700">${short}</span>` : ''}</div>
        <div><h3>${title}</h3><a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a></div>
    `;
    return wrap;
}

function renderSkills(data) {
    const grid = document.querySelector('.skills-grid');
    if (!grid || !data.skills) return;
    grid.innerHTML = '';
    Object.keys(data.skills).forEach(cat => {
        const col = document.createElement('div');
        col.className = 'skill-category';
        col.innerHTML = `
            <h3 class="skill-category-title">${cat}</h3>
            <div class="skill-tags">${data.skills[cat].map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
        `;
        grid.appendChild(col);
    });
}

function renderExperience(data) {
    const timeline = document.querySelector('.experience-timeline');
    if (!timeline || !data.experience) return;
    timeline.innerHTML = '';
    data.experience.forEach(item => {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <div class="experience-header">
                <div class="experience-title-wrapper">
                    <h3 class="experience-title">${item.role}</h3>
                    <span class="experience-company">${item.company}</span>
                </div>
                <span class="experience-date">${item.date}</span>
            </div>
            <ul class="experience-details">
                ${item.details.map(d => `<li>${d}</li>`).join('')}
            </ul>
            <div class="experience-tech">
                ${item.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
        `;
        timeline.appendChild(div);
    });
}

function renderEducation(data) {
    const timeline = document.querySelector('.education-timeline');
    if (!timeline || !data.education) return;
    timeline.innerHTML = '';
    data.education.forEach(item => {
        const div = document.createElement('div');
        div.className = 'education-item';
        div.innerHTML = `
            <div class="education-header">
                <div class="education-title-wrapper">
                    <h3 class="education-degree">${item.degree}</h3>
                    <span class="education-school">${item.school}</span>
                </div>
                <span class="education-date">${item.date}</span>
            </div>
            <div class="education-details">
                <p class="education-relevant">Relevant Coursework:</p>
                <ul class="coursework-list">
                    ${item.coursework.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
        `;
        timeline.appendChild(div);
    });
}

function renderCertifications(data) {
    const grid = document.querySelector('.certifications-grid');
    if (!grid || !data.certifications) return;
    grid.innerHTML = '';
    data.certifications.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certification-card';
        card.innerHTML = `
            <div class="cert-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l6 3v8.18c0 4.24-2.98 8.1-6 9.18-3.02-1.08-6-4.94-6-9.18V7.18l6-3z"/><path d="M9 12l2 2 4-4"/></svg></div>
            <h3 class="cert-title">${cert}</h3>
            <a class="cert-link" href="#" onclick="return false">View Certificate</a>
        `;
        grid.appendChild(card);
    });
}

function renderHonors(data) {
    const grid = document.querySelector('.honors-grid');
    if (!grid || !data.honors) return;
    grid.innerHTML = '';
    data.honors.forEach(h => {
        const card = document.createElement('div');
        card.className = 'honor-card';
        card.innerHTML = `
            <div class="honor-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l6 3v8.18c0 4.24-2.98 8.1-6 9.18-3.02-1.08-6-4.94-6-9.18V7.18l6-3z"/><path d="M12 8l-4 4h3v4h2v-4h3l-4-4z"/></svg></div>
            <h3 class="honor-title">${h.title}</h3>
            ${h.organization ? `<p class="honor-organization">${h.organization}</p>` : ''}
            ${h.achievement ? `<p class="honor-achievement">${h.achievement}</p>` : ''}
            ${h.description ? `<p class="honor-description">${h.description}</p>` : ''}
            ${h.details ? `<ul class="honor-details">${h.details.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
        `;
        grid.appendChild(card);
    });
}

function renderProjects(data) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';
    const list = (Array.isArray(data.projects) && data.projects.length>0) ? data.projects : fallbackProjects;
    list.forEach(repo => {
        const projectCard = createProjectCard(repo);
        projectsGrid.appendChild(projectCard);
    });
}

// ------------------ End resume renderers ------------------

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Any heavy scroll operations can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);


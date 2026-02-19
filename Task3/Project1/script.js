// --- State Management ---
// Goals for each project based on their HTML data-id
const projectGoals = {
    1: 20000,
    2: 10000,
    3: 50000
};

let currentProjectId = null;

// --- DOM Elements ---
const modal = document.getElementById('payment-modal');
const modalTitle = document.getElementById('modal-project-title');
const paymentForm = document.getElementById('contribution-form');
const successMsg = document.getElementById('success-msg');
const pledgeInput = document.getElementById('pledge-amount');

// --- Functions ---

// Open the payment modal and set the context for which project is being backed
function openModal(projectId, projectTitle) {
    currentProjectId = projectId;
    modalTitle.textContent = projectTitle;
    
    // Reset form states
    paymentForm.reset();
    paymentForm.classList.remove('hidden');
    successMsg.classList.add('hidden');
    
    // Show modal
    modal.classList.add('active');
}

// Close the modal
function closeModal() {
    modal.classList.remove('active');
    currentProjectId = null;
}

// Close modal if user clicks outside of the modal content box
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Handle Payment Submission
paymentForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    const pledgeAmount = parseFloat(pledgeInput.value);

    if (pledgeAmount && pledgeAmount > 0 && currentProjectId) {
        
        // 1. Get current DOM elements for the specific project
        const raisedEl = document.getElementById(`raised-${currentProjectId}`);
        const percentEl = document.getElementById(`percent-${currentProjectId}`);
        const progressBar = document.getElementById(`progress-${currentProjectId}`);
        
        // 2. Calculate new totals
        const currentRaised = parseFloat(raisedEl.innerText);
        const newRaised = currentRaised + pledgeAmount;
        const goal = projectGoals[currentProjectId];
        
        let newPercentage = (newRaised / goal) * 100;
        
        // 3. Update the UI
        raisedEl.innerText = newRaised.toFixed(0);
        percentEl.innerText = Math.floor(newPercentage) + '%';
        
        // Cap the visual progress bar width at 100% even if overfunded
        const visualPercentage = newPercentage > 100 ? 100 : newPercentage;
        progressBar.style.width = visualPercentage + '%';

        // 4. Show Success Message
        paymentForm.classList.add('hidden');
        successMsg.classList.remove('hidden');

        // Optional: Auto-close modal after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);
    }
});
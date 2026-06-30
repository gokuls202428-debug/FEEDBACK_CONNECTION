const scriptURL = 'https://script.google.com/macros/s/AKfycby2_icOemdpXGFvT2Obv1Q4Q_PWBnTuDsss6bxro-13Prp3BHv7Asw24XzNKl81w1-z/exec';
const form = document.forms['google-sheet'];

// Page elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const successPage = document.getElementById('successPage');

// Buttons
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');

// --- Page Navigation ---

nextBtn.addEventListener('click', () => {
    // Validate fields on Page 1 before proceeding
    const inputs = page1.querySelectorAll('input[required], select[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = 'red'; // Highlight empty required fields
        } else {
            input.style.borderColor = '#bdc3c7'; // Reset border color
        }
    });

    if (isValid) {
        page1.style.display = 'none';
        page2.style.display = 'block';
        window.scrollTo(0, 0); // Scroll to top of the form
    } else {
        alert('Please fill out all required fields before proceeding.');
    }
});

prevBtn.addEventListener('click', () => {
    page2.style.display = 'none';
    page1.style.display = 'block';
    window.scrollTo(0, 0); // Scroll to top of the form
});


// --- Form Submission ---

form.addEventListener('submit', e => {
    e.preventDefault();

    // --- Validate fields on Page 2 before submitting ---
    const inputs = page2.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    inputs.forEach(input => {
        // For radio buttons, check if one in the group is checked
        if (input.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
            if (![...radioGroup].some(r => r.checked)) {
                isValid = false;
                // Optionally, highlight the container or label for radio groups
                input.closest('.form-group').style.border = '1px solid red';
            }
        } else if (!input.value) {
            isValid = false;
            input.style.borderColor = 'red'; // Highlight empty required fields
        }
    });

    if (!isValid) {
        alert('Please fill out all required fields on this page.');
        return; // Stop the submission
    }
    // --- End of validation ---

    submitBtn.innerText = "Submitting Feedback...";
    submitBtn.disabled = true;
    prevBtn.disabled = true;
    
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
          // Hide the form and show the success page
          form.style.display = 'none';
          successPage.style.display = 'block';
          window.scrollTo(0, 0);
      })
      .catch(error => {
          console.error('Submission Error!', error.message);
          alert("Network issue. Please verify connection and submit again.");
          submitBtn.innerText = "Submit Feedback";
          submitBtn.disabled = false;
          prevBtn.disabled = false;
      });
});

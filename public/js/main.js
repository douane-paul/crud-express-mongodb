// Add onSubmit event listener to the form
document.getElementById('form-edit').addEventListener('submit', (e) => {
    e.preventDefault();
    // Get the quote from the form
    const quote = document.getElementById('inputQuote-edit').value;
    // Get the name from the form
    const name = document.getElementById('inputName-edit').value;
    // Get the id from the form
    const id = document.getElementById('inputId-edit').value;
    console.log(`/api/quotes/${id}/edit`);
    // fetch the url /api/quotes/:id/edit
    fetch(`/api/quotes/edit/${id}`, {
        method: 'PUT',
        // Set the headers to application/json
        headers: {
            'Content-Type': 'application/json'
        },
        // Set the body to the JSON object
        body: JSON.stringify({
            quote: quote,
            name: name
        })
    }).then(data => {
        if (data.status === 200) {
            // Redirect to the home page
            window.location.href = '/';
        }
    })
});

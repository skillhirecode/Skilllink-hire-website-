document.getElementById('fetchDataBtn').addEventListener('click', () => {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('responseData').textContent = data.message;
        })
        .catch(error => console.error('Error:', error));
    });

import axios from 'axios';

const apiEndpoint = 'https://api.example.com/attendance';

axios.get(apiEndpoint)
    .then(response => {
        populateTable(response.data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
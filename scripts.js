document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userType = document.getElementById('userType').value;
    const baseUrl = 'http://localhost:5000';

    // Handle Login
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
    
        const data = await response.json();
        if (response.ok) {
            const role = data.role;
            sessionStorage.setItem('token', data.token);
            if (role === 'admin') window.location.href = 'admin.html';
            else if (role === 'voter') window.location.href = 'voter.html';
            else if (role === 'candidate') window.location.href = 'candidate.html';
        } else {
            document.getElementById('error').textContent = data.msg;
        }
    });
    
    // Admin - Create Election
    document.getElementById('createElectionForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
    
        const response = await fetch(`${baseUrl}/api/election/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, startDate, endDate })
        });
    
        const data = await response.json();
        if (response.ok) {
            alert('Election created successfully');
        } else {
            alert('Error: ' + data.error);
        }
    });
    
    // Voter - View Available Elections & Cast Vote
    async function loadElections() {
        const response = await fetch(`${baseUrl}/api/election`, {
            headers: {
                'Authorization': sessionStorage.getItem('token')
            }
        });
        const elections = await response.json();
        const electionSelect = document.getElementById('electionId');
    
        elections.forEach(election => {
            const option = document.createElement('option');
            option.value = election._id;
            option.textContent = election.title;
            electionSelect.appendChild(option);
        });
    }
    
    document.getElementById('castVoteForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const electionId = document.getElementById('electionId').value;
        const candidateId = document.getElementById('candidateId').value;
    
        const response = await fetch(`${baseUrl}/api/vote/cast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
            },
            body: JSON.stringify({ electionId, candidateId })
        });
    
        const data = await response.json();
        if (response.ok) {
            alert('Vote cast successfully');
        } else {
            alert('Error: ' + data.error);
        }
    });
    
    // View Results
    document.getElementById('viewResults')?.addEventListener('click', async () => {
        const response = await fetch(`${baseUrl}/api/election/results`, {
            headers: { 'Authorization': sessionStorage.getItem('token') }
        });
        const results = await response.json();
        console.log(results);  // Display results on the page
    });
    
    if (userType === 'admin') {
        window.location.href = 'admin.html';
    } else if (userType === 'voter') {
        window.location.href = 'voter.html';
    } else if (userType === 'candidate') {
        window.location.href = 'candidate.html';
    }
});


document.addEventListener('DOMContentLoaded', () => 
    {
        const userId = sessionStorage.getItem('userId');
        const firstName = sessionStorage.getItem('userFirstName') || 'there';
        if (!userId) 
            return window.location.href = 'index.html';

        // Elements
        const welcome    = document.getElementById('welcome');
        const logoutBtn  = document.getElementById('logoutBtn');
        const searchTerm = document.getElementById('searchTerm');
        const searchBtn  = document.getElementById('searchBtn');
        const searchMsg  = document.getElementById('searchMessage');
        const contactsTbody = document.querySelector('#contactsTable tbody');
        const addFirst   = document.getElementById('addFirst');
        const addLast    = document.getElementById('addLast');
        const addPhone   = document.getElementById('addPhone');
        const addEmail   = document.getElementById('addEmail');
        const addBtn     = document.getElementById('addBtn');
        const addMsg     = document.getElementById('addMessage');

        // Show a simple greeting (you can store name on login)
        //   welcome.textContent = `Welcome, User #${userId}!`;
        welcome.textContent = 'Welcome, ${firstName}!';

        // Logout
        logoutBtn.addEventListener('click', () => 
            {
                sessionStorage.removeItem('userId');
                window.location.href = 'index.html';
            });

        // Fetch and render contacts
        async function fetchContacts(term = '') {
            contactsTbody.innerHTML = '';
            searchMsg.textContent = '';
            try {
            const res  = await fetch('/LAMPAPI/SearchContacts.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: Number(userId), searchTerm: term })
            });
            const json = await res.json();
            if (res.status !== 200) {
                searchMsg.textContent = json.error || 'Error loading contacts.';
                return;
            }
            json.results.forEach(c => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.phone}</td>
                <td>${c.email}</td>
                <td>
                    <button data-id="${c.id}" class="editBtn">Edit</button>
                    <button data-id="${c.id}" class="delBtn">Delete</button>
                </td>`;
                contactsTbody.appendChild(row);
            });
            } catch {
            searchMsg.textContent = 'Network error.';
            }
        }

        // Initial load
        fetchContacts();

        // Search handler
        searchBtn.addEventListener('click', () => {
            fetchContacts(searchTerm.value.trim());
        });

        // Add contact handler
        addBtn.addEventListener('click', async () => {
            addMsg.textContent = '';
            const payload = {
            userId: Number(userId),
            firstName: addFirst.value.trim(),
            lastName:  addLast.value.trim(),
            phone:     addPhone.value.trim(),
            email:     addEmail.value.trim()
            };
            if (!payload.firstName || !payload.lastName) {
            return addMsg.textContent = 'First and last name required.';
            }
            try {
            const res  = await fetch('/LAMPAPI/AddContact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (res.status === 200) {
                addMsg.textContent = 'Contact added!';
                addFirst.value = addLast.value = addPhone.value = addEmail.value = '';
                fetchContacts();
            } else {
                addMsg.textContent = json.error || 'Failed to add.';
            }
            } catch {
            addMsg.textContent = 'Network error.';
            }
        });

        // Delete & Edit buttons via event delegation
        contactsTbody.addEventListener('click', async e => {
            if (e.target.classList.contains('delBtn')) {
            const id = Number(e.target.dataset.id);
            await fetch('/LAMPAPI/DeleteContact.php', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({ contactId: id })
            });
            fetchContacts(searchTerm.value.trim());
            }
            // TODO: handle editBtn clicks to open an edit form
    });
});

// Handles page load events and main logic
// Includes login, search, add, delete, and edit functionality

document.addEventListener('DOMContentLoaded', () => {
    // Get session user info
    const userId = sessionStorage.getItem('userId');
    const firstName = sessionStorage.getItem('userFirstName') || 'there';
    if (!userId) return window.location.href = 'index.html';

    // Element references
    const welcome = document.getElementById('welcome');
    const logoutBtn = document.getElementById('logoutBtn');
    const searchTerm = document.getElementById('searchTerm');
    const searchBtn = document.getElementById('searchBtn');
    const searchMsg = document.getElementById('searchMessage');
    const contactsTbody = document.querySelector('#contactsTable tbody');
    const addFirst = document.getElementById('addFirst');
    const addLast = document.getElementById('addLast');
    const addPhone = document.getElementById('addPhone');
    const addEmail = document.getElementById('addEmail');
    const addBtn = document.getElementById('addBtn');
    const addMsg = document.getElementById('addMessage');

    let editingId = null; // Track if editing

    // Display welcome message
    welcome.textContent = `Welcome, ${firstName}!`;

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('userId');
        window.location.href = 'index.html';
    });

    // Fetch all contacts or filtered contacts
    async function fetchContacts(term = '') {
        contactsTbody.innerHTML = '';
        searchMsg.textContent = '';
        try {
            const res = await fetch('/LAMPAPI/SearchContacts.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: Number(userId), searchTerm: term })
            });
            const json = await res.json();
            if (res.status !== 200 || !json.results) {
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
                        <button data-id="${c.id}" data-fn="${c.firstName}" data-ln="${c.lastName}" data-ph="${c.phone}" data-em="${c.email}" class="editBtn">Edit</button>
                        <button data-id="${c.id}" class="delBtn">Delete</button>
                    </td>`;
                contactsTbody.appendChild(row);
            });
        } catch {
            searchMsg.textContent = 'Network error.';
        }
    }

    // Load contacts initially
    fetchContacts();

    // Search button handler
    searchBtn.addEventListener('click', () => {
        fetchContacts(searchTerm.value.trim());
    });

    // Add or update contact handler
    addBtn.addEventListener('click', async () => {
        addMsg.textContent = '';

        const payload = {
            userId: Number(userId),
            firstName: addFirst.value.trim(),
            lastName: addLast.value.trim(),
            phone: addPhone.value.trim(),
            email: addEmail.value.trim()
        };

        if (!payload.firstName || !payload.lastName) {
            return addMsg.textContent = 'First and last name required.';
        }

        // If editing, update the contact
        if (editingId !== null) {
            try {
                const res = await fetch('/LAMPAPI/UpdateContact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, contactId: editingId })
                });
                const json = await res.json();
                if ((res.status === 200 || res.status === 201) && (!json.error || json.error.trim() === '')) {
                    addMsg.textContent = 'Contact updated!';
                    addFirst.value = addLast.value = addPhone.value = addEmail.value = '';
                    editingId = null;
                    addBtn.textContent = 'Add Contact';
                    fetchContacts();
                } else {
                    addMsg.textContent = json.error || 'Failed to update.';
                }
            } catch {
                addMsg.textContent = 'Network error.';
            }
        } else {
            // Add new contact
            try {
                const res = await fetch('/LAMPAPI/AddContact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if ((res.status === 200 || res.status === 201) && (!json.error || json.error.trim() === '')) {
                    addMsg.textContent = 'Contact added!';
                    addFirst.value = addLast.value = addPhone.value = addEmail.value = '';
                    fetchContacts();
                } else {
                    addMsg.textContent = json.error || 'Failed to add.';
                }
            } catch {
                addMsg.textContent = 'Network error.';
            }
        }
    });

    // Delete and Edit button handler
    contactsTbody.addEventListener('click', async e => {
        const target = e.target;

        // Handle delete
        if (target.classList.contains('delBtn')) {
            const id = Number(target.dataset.id);
            try {
                const res = await fetch('/LAMPAPI/DeleteContact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contactId: id, userId: Number(userId) })
                });
                const json = await res.json();
                if (res.status === 200 && (!json.error || json.error.trim() === '')) {
                    fetchContacts(searchTerm.value.trim());
                } else {
                    alert("Failed to delete: " + (json.error || "Unknown error"));
                }
            } catch {
                alert("Network error while deleting contact.");
            }
        }

        // Handle edit
        if (target.classList.contains('editBtn')) {
            editingId = Number(target.dataset.id);
            addFirst.value = target.dataset.fn;
            addLast.value = target.dataset.ln;
            addPhone.value = target.dataset.ph;
            addEmail.value = target.dataset.em;
            addBtn.textContent = 'Update Contact';
            addMsg.textContent = 'Editing contact...';
        }
    });
});

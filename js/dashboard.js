
document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem('userId');
    const firstName = sessionStorage.getItem('userFirstName') || 'there';
    if (!userId)
        return window.location.href = 'index.html';

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

    welcome.textContent = `Welcome, ${firstName}!`;

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('userId');
        window.location.href = 'index.html';
    });

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
                    <button data-id="${c.id}" class="editBtn">Edit</button>
                    <button data-id="${c.id}" class="delBtn">Delete</button>
                </td>`;
                contactsTbody.appendChild(row);
            });
        } catch {
            searchMsg.textContent = 'Network error.';
        }
    }

    fetchContacts();

    searchBtn.addEventListener('click', () => {
        fetchContacts(searchTerm.value.trim());
    });

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

        try {
            const res = await fetch('/LAMPAPI/AddContact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (res.status === 200 && json.error === "") {
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

    contactsTbody.addEventListener('click', async e => {
        if (e.target.classList.contains('delBtn')) {
            const id = Number(e.target.dataset.id);
            try {
                const res = await fetch('/LAMPAPI/DeleteContact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contactId: id })
                });
                const json = await res.json();
                if (res.status === 200 && json.error === "") {
                    fetchContacts(searchTerm.value.trim());
                } else {
                    alert("Failed to delete: " + (json.error || "Unknown error"));
                }
            } catch {
                alert("Network error while deleting contact.");
            }
        }
    });
});


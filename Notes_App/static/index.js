let isEditing = false;
let editingNoteId = null;

// Get Notes
async function getNotes(url = "http://127.0.0.1:8000/api/notes/?page=1") {
    const token = localStorage.getItem("access");
    const username_data = localStorage.getItem("username")
    const fill_username = document.getElementById("username")
    fill_username.innerHTML = username_data;
    if (!token) return;

    try {
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            const data = await res.json();
            const notes = data.results || [];
            const tbody = document.getElementById("notes-table-body");

            tbody.innerHTML = "";
            notes.forEach(note => {
                tbody.innerHTML += `
                    <tr>
                        <td>
                            <a href="#" onclick="editNote(${note.id}, \`${note.title}\`, \`${note.description.replace(/`/g, "\\`")}\`); return false;">
                                ${note.title}
                            </a>
                        </td>
                        <td>${new Date(note.create_date).toLocaleDateString()}</td>
                        <td>
                            <button onclick="deleteNote(${note.id})" class="btn btn-danger btn-sm">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            showPagination(data.next, data.previous);
        } else {
            alert("Unauthorized. Please login again.");
            window.location.href = "/register/";
        }
    } catch (err) {
        console.error("Fetch notes error", err);
    }
}


//Pagination
function showPagination(nextUrl, prevUrl) {
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const pageInfo = document.getElementById("page-info");

    nextBtn.disabled = !nextUrl;
    prevBtn.disabled = !prevUrl;

    // Page number tracking (extract page query)
    if (nextUrl) {
        const match = nextUrl.match(/page=(\d+)/);
        if (match) currentPage = parseInt(match[1]) - 1;
    }

    if (!nextUrl && prevUrl) {
        const match = prevUrl.match(/page=(\d+)/);
        if (match) currentPage = parseInt(match[1]) + 1;
    }

    if (!nextUrl && !prevUrl) currentPage = 1;

    pageInfo.textContent = `Page ${currentPage}`;

    nextBtn.onclick = () => {
        if (nextUrl) {
            currentPage++;
            getNotes(nextUrl);
        }
    };
    prevBtn.onclick = () => {
        if (prevUrl) {
            currentPage--;
            getNotes(prevUrl);
        }
    };
}

// Edit 
function editNote(id, title, description) {
    const form = document.getElementById("note_form");
    const table_Data = document.getElementById("notes_table_container");
    const add_notes_text = document.getElementById("add_notes");

    // Show form, hide table
    form.style.display = "block";
    table_Data.style.display = "none";
    add_notes_text.innerHTML = "Back";

    // Fill form with note data
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;

    isEditing = true;
    editingNoteId = id;
}


//Add Note click
document.getElementById("add_notes").addEventListener("click", () => {
    const form = document.getElementById("note_form");
    const table_Data = document.getElementById("notes_table_container");
    const add_notes_text = document.getElementById("add_notes");

    const isFormVisible = form.style.display === "block";

    form.style.display = isFormVisible ? "none" : "block";
    table_Data.style.display = isFormVisible ? "block" : "none";
    add_notes_text.innerHTML = isFormVisible ? "Add Note" : "Back";

    // Reset form and edit state
    if (isFormVisible) {
        form.reset();
        document.getElementById("file-name").textContent = "";
        isEditing = false;
        editingNoteId = null;
    }
});


// Add Note Handler (from form)
document.getElementById("note_form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const token = localStorage.getItem("access");
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const file = document.getElementById("file_data").files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("image_path", file);

    let url = "http://127.0.0.1:8000/api/notes/";
    let method = "POST";

    if (isEditing && editingNoteId) {
        url += `${editingNoteId}/`;
        method = "PUT"; // or PATCH if you're using partial updates
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (res.ok) {
            alert(isEditing ? "Note updated!" : "Note added!");
            getNotes();
            e.target.reset();
            document.getElementById("file-name").textContent = "";
            form.style.display = "none";
            document.getElementById("notes_table_container").style.display = "block";
            document.getElementById("add_notes").innerHTML = "Add Note";

            isEditing = false;
            editingNoteId = null;
        } else {
            const errorData = await res.json();
            console.error("Server error:", errorData);
            alert("Failed:\n" + JSON.stringify(errorData, null, 2));
        }
    } catch (err) {
        console.error("Add/Edit note error", err);
        alert("Network error");
    }
});


// Delete Note
async function deleteNote(id) {
    const token = localStorage.getItem("access");

    const res = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) {
        alert("Note deleted!");
        getNotes();
    } else {
        alert("Delete failed.");
    }
}

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/register/";
});



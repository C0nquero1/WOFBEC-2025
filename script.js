// Dynamic Data for Sessions
const sessions = [
    {
        name: "Session One",
        time: "5:30 PM",
        date: "2025-01-08",
    },
    {
        name: "Session Two",
        time: "5:30 PM",
        date: "2025-01-09",
    },
    {
        name: "Session Three",
        time: "5:30 PM",
        date: "2025-01-10",
    },
    {
        name: "Session Four",
        time: "9:00 AM",
        date: "2025-01-11",
    },
    {
        name: "Session Five",
        time: "5:30 PM",
        date: "2025-01-11",
    },
    {
        name: "Session Six",
        time: "9:00 AM",
        date: "2025-01-12",
    },
];

// Populate Session Cards
const sessionCardsContainer = document.getElementById("session-cards");
sessions.forEach(session => {
    const card = document.createElement("div");
    card.classList.add("session-card");
    card.innerHTML = `
        <h3>${session.name}</h3>
        <p><strong>Date:</strong> ${session.date}</p>
        <p><strong>Time:</strong> ${session.time}</p>
        <button class="check-in-btn" data-session="${session.name}">Check-In</button>
        <a href="https://youtube.com/@wofbec?si=nm4OrMx1XbAA_4MX" target="_blank" class="watch-online">Watch Online</a>
    `;
    sessionCardsContainer.appendChild(card);
});

// Show Pop-up Form for Check-In
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("check-in-btn")) {
        const sessionName = e.target.dataset.session;
        document.getElementById("session").value = sessionName;
        document.getElementById("popup-form").classList.remove("hidden");
    }
});

// Close Pop-up Form
document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("popup-form").classList.add("hidden");
});

// Handle Check-In Form Submission
document.getElementById("check-in-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch("https://formspree.io/f/xjkkkroy", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
    })
        .then(response => {
            if (response.ok) {
                alert("Check-In successful!");
                document.getElementById("popup-form").classList.add("hidden");
            } else {
                alert("Failed to check in. Please try again.");
            }
        })
        .catch(() => {
            alert("Network error. Please try again.");
        });
});
// Utility: Convert time to 24-hour format
function convertTo24Hour(time) {
    const [hour, minute] = time.split(/:| /);
    const period = time.slice(-2).toUpperCase();
    let hours = parseInt(hour, 10);

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minute}`;
}

// Function to generate a calendar event link
function generateCalendarLink(session) {
    const startDate = new Date(`${session.date}T${convertTo24Hour(session.time)}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assuming sessions last 2 hours

    const formatDate = date => date.toISOString().replace(/-|:|\.\d+/g, '');
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.name)}&dates=${start}/${end}&details=${encodeURIComponent(
        session.speakers
    )}&location=Online`;
}

// Add Event Listeners to "Add Calendar" Buttons on Event Schedule
document.querySelectorAll(".add-to-calendar-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
        const session = sessions[index];
        const calendarLink = generateCalendarLink(session);

        // Open the Google Calendar link in a new tab
        window.open(calendarLink, "_blank");
    });
});

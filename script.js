let matches = [];
let teams = [];
let selectedTeams = [];

// Thêm hàm selectVaccine để tích hợp với OCR
function selectVaccine(team) {
    if (!selectedTeams.includes(team)) {
        selectedTeams.push(team);
        updateSelectedTeams();
        updateMatches();
    }
    input.value = '';
    suggestions.style.display = 'none';
}

async function init() {
    try {
        const response = await fetch('matches.json');
        const data = await response.json();
        matches = data.matches;
        teams = Array.from(new Set(matches.flatMap(match => [match.vax1, match.vax2])));
        setupInputEvents();
        updateSelectedTeams();
        updateMatches();
    } catch (error) {
        console.error("Không thể tải dữ liệu vắc xin:", error);
    }
}

const input = document.getElementById("team-input");
const suggestions = document.getElementById("suggestions");
const matchResults = document.getElementById("match-results");
const selectedTeamsList = document.getElementById("selected-teams-list");

function setupInputEvents() {
    input.addEventListener("input", () => {
        const value = input.value.toLowerCase();
        suggestions.innerHTML = "";

        if (value.trim() === "") {
            suggestions.style.display = "none";
            return;
        }

        const filteredTeams = teams.filter(
            team => team.toLowerCase().includes(value) && !selectedTeams.includes(team)
        );

        filteredTeams.forEach(team => {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = team;
            suggestionItem.style.padding = "10px";
            suggestionItem.style.cursor = "pointer";
            suggestionItem.addEventListener("click", () => selectVaccine(team));
            suggestions.appendChild(suggestionItem);
        });

        suggestions.style.display = filteredTeams.length > 0 ? "block" : "none";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown-container")) {
            suggestions.style.display = "none";
        }
    });
}

function updateSelectedTeams() {
    selectedTeamsList.innerHTML = "";

    selectedTeams.forEach((team, idx) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${idx + 1}. ${team}`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.style.marginLeft = "10px";
        removeButton.addEventListener("click", () => {
            selectedTeams = selectedTeams.filter(t => t !== team);
            updateSelectedTeams();
            updateMatches();
        });

        listItem.appendChild(removeButton);
        selectedTeamsList.appendChild(listItem);
    });
}

function updateMatches() {
    matchResults.innerHTML = "";

    const relatedMatches = matches.filter(match =>
        selectedTeams.includes(match.vax1) && selectedTeams.includes(match.vax2)
    );

    if (relatedMatches.length > 0) {
        relatedMatches.forEach((match, idx) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${idx + 1}. ${match.vax1} vs ${match.vax2}: ${match.tuongtac}`;
            matchResults.appendChild(listItem);
        });
    } else {
        matchResults.innerHTML = "<li>Không có tương tác nào giữa các vắc xin đã chọn.</li>";
    }
}

init();

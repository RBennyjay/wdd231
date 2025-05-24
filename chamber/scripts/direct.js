document.addEventListener("DOMContentLoaded", () => {
  const membersContainer = document.getElementById("membersContainer");
  const gridBtn = document.getElementById("gridBtn");
  const listBtn = document.getElementById("listBtn");

  async function loadMembers() {
    try {
      const response = await fetch("data/members.json");
      const data = await response.json();
      displayMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
      membersContainer.innerHTML = "<p>Error loading directory.</p>";
    }
  }

  function displayMembers(members) {
    membersContainer.innerHTML = ""; // Clear container
    members.forEach(member => {
      const card = document.createElement("div");
      card.classList.add("member-card");
      card.innerHTML = `
         <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="200" height="200" class="member-logo" />
         <h3>${member.name}</h3>
         <p>${member.description}</p>
         <p><strong>Address:</strong> ${member.address}</p>
         <p><strong>Phone:</strong> ${member.phone}</p>
         <p><a href="${member.website}" target="_blank">Visit Website</a></p>
         <p class="membership">Membership: ${getMembershipLevel(member.membership)}</p>
      `;
      membersContainer.appendChild(card);
    });
  }

  function getMembershipLevel(level) {
    switch (level) {
      case 3: return "Gold";
      case 2: return "Silver";
      default: return "Member";
    }
  }

  gridBtn.addEventListener("click", () => {
    membersContainer.classList.add("grid-view");
    membersContainer.classList.remove("list-view");
  });

  listBtn.addEventListener("click", () => {
    membersContainer.classList.add("list-view");
    membersContainer.classList.remove("grid-view");
  });

  loadMembers();
});
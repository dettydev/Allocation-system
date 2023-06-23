
const participants = [];
const allocation = {};

function addParticipant() {
  const nameInput = document.getElementById('nameInput');
  const roleSelect = document.getElementById('roleSelect');
  const skillSelect = document.getElementById('skillSelect');

  const participant = {
    name: nameInput.value,
    role: roleSelect.value,
    skill: skillSelect.value
  };

  participants.push(participant);
  updateParticipantsList();
  allocateRooms();
    nameInput.value = '';
    roleSelect.selectedIndex = 0;
    skillSelect.selectedIndex = 0;
    }

function updateParticipantsList() {
  const participantsList = document.getElementById('participantsList');
  participantsList.innerHTML = '';

  participants.forEach(participant => {
    const listItem = document.createElement('li');
    listItem.textContent = `${participant.name} - ${participant.role} (${participant.skill})`;
    participantsList.appendChild(listItem);
  });
}

function allocateRooms() {
  const facilitators = participants.filter(participant => participant.role === 'facilitator');
  const developers = participants.filter(participant => participant.role !== 'facilitator');

  allocationStatus.textContent = '';

  // Clear previous allocation
  allocationTable.innerHTML = '<tr><th>Bedroom</th><th>Facilitator</th><th>Developers</th></tr>';

  const bedrooms = [1, 2, 3, 4, 5, 6];
  const allocatedDevelopers = {};


facilitators.forEach(facilitator => {
    const bedroom = bedrooms.shift();
    if (!bedroom) {
      allocationStatus.textContent = 'No available bedrooms.';
      return;
    }

    allocation[bedroom] = { facilitator, developers: [] };
  });

  developers.forEach(developer => {
    const bedroom = Object.keys(allocation).find(bedroom => {
      const room = allocation[bedroom];
      if (room.developers.length < 3 && (!room.facilitator || room.facilitator.skill === developer.skill)) {
        if (room.facilitator && room.facilitator.gender !== developer.gender) {
          return false;
        }
        return true;
      }
      return false;
    });

    if (!bedroom) {
      allocationStatus.textContent = 'No available bedrooms or skill conflict.';
      return;
    }

const room = allocation[bedroom];
    room.developers.push(developer);
    allocatedDevelopers[developer.name] = true;
  });


  
  Object.keys(allocation).forEach(bedroom => {
    const room = allocation[bedroom];

    const row = allocationTable.insertRow();
    row.insertCell().textContent = bedroom;
    row.insertCell().textContent = room.facilitator ? room.facilitator.name : '';
    row.insertCell().textContent = room.developers.map(developer => developer.name).join(', ');
  });

  const unallocatedDevelopers = developers.filter(developer => !allocatedDevelopers[developer.name]);
  if (unallocatedDevelopers.length > 0) {
    allocationStatus.textContent = 'Some developers could not be allocated.';
  }
}
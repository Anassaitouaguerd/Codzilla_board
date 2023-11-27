"use strict";
// GLOBAL VARIABLES :
const onlyMonthsTr = document.getElementById("only-months");
const monthsTr = document.getElementById("months");
const weekdaysTr = document.getElementById("weekdays");
const sprintsWTr = document.getElementById("sprints-tr_vw");
const sprintsMTr = document.getElementById("sprints-tr_vm");
const tbody = document.querySelector("tbody");
const timelineMonths = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const projectData = {
  backlog: JSON.parse(localStorage.getItem("backlog")) || [],
  sprints: JSON.parse(localStorage.getItem("sprints")) || [
    {
      name: "Sprint 1",
      duration: 7,
      start: "2023-10-21",
      isStarted: true,
      user_stories: [
        {
          name: "User 1",
          status: 0,
          description: "",
          start: "2023-10-21",
          duration: 1,
        },
        {
          name: "User 2",
          status: 0,
          description: "",
          start: "2023-10-22",
          duration: 2,
        },
        {
          name: "User 3",
          status: 0,
          description: "",
          start: "2023-10-24",
          duration: 1,
        },
        {
          name: "User 4",
          status: 0,
          description: "",
          start: "2023-10-25",
          duration: 1,
        },
        {
          name: "User 3",
          status: 0,
          description: "",
          start: "2023-10-26",
          duration: 2,
        },
      ],
    },
    {
      name: "Sprint 2",
      duration: 8,
      start: "2023-11-1",
      isStarted: false,
    },
  ],
  users: JSON.parse(localStorage.getItem("users")) || [],
};

/***  ASIDE SCRIPT    ***/
document.getElementById("aside_icon").addEventListener("click", controlAside);

function controlAside(e) {
  const aside = document.getElementById("aside");
  e.target.style.transform = ` translateX(50%) ${
    aside.classList.contains("aside_pos") ? "rotate(0deg)" : "rotate(180deg)"
  }`;
  aside.classList.toggle("aside_pos");
}

/***  TIMELINE PAGE SCRIPT    ***/

// Check if the current page is timer.html :
if (window.location.pathname.split("/").slice(-1) == "timer.html")
  loadTableRows();

// Get Start & End point for table tr :
function getStartPoint(d, m, y) {
  const startDate = new Date(y, m - 1, d);
  const dayNumber = startDate.getDay();
  return dayNumber == 1 ? startDate : new Date(y, m - 1, d - dayNumber + 1);
}

function getEndPoint(d, m, y) {
  const endDate = new Date(y, m - 1, d);
  const dayNumber = endDate.getDay();
  return dayNumber == 0 ? endDate : new Date(y, m - 1, d + 7 - dayNumber);
}

// Get Month for each table td :
function getMonth(startDate) {
  const currDate = new Date(startDate.getTime());
  const firstMonth = startDate.getMonth();

  let firstMonthCount = 0;
  let secondMonthCount = 0;
  for (let i = 0; i < 7; i++) {
    currDate.getMonth() == firstMonth ? firstMonthCount++ : secondMonthCount++;
    currDate.setDate(currDate.getDate() + 1);
  }

  return firstMonthCount > secondMonthCount
    ? firstMonth - 1
    : currDate.getMonth() - 1;
}

// Load all table rows :
function loadTableRows() {
  const activeSprints = projectData.sprints
    .filter((sprint) => sprint.isStarted)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .map((sprint) => ({
      ...sprint,
      user_stories: sprint.user_stories.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      ),
    }));
  const firstDate = new Date(activeSprints[0].start);
  const lastDate = new Date(activeSprints.slice(-1)[0].start);
  lastDate.setDate(lastDate.getDate() + activeSprints.slice(-1)[0].duration);
  const firstDateObj = [
    firstDate.getDate(),
    firstDate.getMonth() + 1,
    firstDate.getFullYear(),
  ];
  const lastDateObj = [
    lastDate.getDate(),
    lastDate.getMonth() + 1,
    lastDate.getFullYear(),
  ];
  const startDate = getStartPoint(...firstDateObj);
  const endDate = getEndPoint(...lastDateObj);
  loadWeeksTd(startDate, endDate);
  loadMonthsTd(startDate, endDate);
  loadSprintsWV(startDate, activeSprints);
  loadSprintsMV(activeSprints);
  loadUserStories(startDate, activeSprints);
  loadYearMonths(startDate, endDate);
}

// load table td for months :
function loadMonthsTd(startDate, endDate) {
  const monthsNumber = (endDate - startDate) / 86400000 / 7;
  const currDate = new Date(startDate.getTime());

  for (let i = 0; i < monthsNumber; i++) {
    monthsTr?.insertAdjacentHTML(
      "beforeend",
      `<th scope="col" colspan="7">${
        timelineMonths[getMonth(currDate) + 1]
      }</th>`
    );
    currDate.setDate(currDate.getDate() + 7);
  }
}

// Load Only Months :
function loadYearMonths(startDate, endDate) {
  for (let i = startDate.getMonth(); i <= endDate.getMonth(); i++)
    onlyMonthsTr?.insertAdjacentHTML(
      "beforeend",
      `<th scope="col" colspan="7">${timelineMonths[i]}</th>`
    );

  onlyMonthsTr?.classList.add("hidden");
}

// load table td for weekdays :
function loadWeeksTd(startDate, endDate) {
  const currDate = new Date(startDate.getTime());
  let i = 0;
  while (currDate.getTime() !== endDate.getTime()) {
    if (i == 100) break;

    weekdaysTr?.insertAdjacentHTML(
      "beforeend",
      `<td>${currDate.getDate()}</td>`
    );
    currDate.setDate(currDate.getDate() + 1);
    i++;
  }
}

// load Sprints in table for Weeks vue :
function loadSprintsWV(startDate, activeSprints) {
  activeSprints.forEach((sprint, indx) => {
    let colspan;
    if (indx == 0) colspan = (new Date(sprint.start) - startDate) / 86400000;
    else {
      const endDate = new Date(activeSprints[indx - 1].start);
      endDate.setDate(endDate.getDate() + activeSprints[indx - 1].duration);
      colspan = (new Date(sprint.start) - endDate) / 86400000;
    }

    sprintsWTr?.insertAdjacentHTML(
      "beforeend",
      `
        <td colspan="${colspan}"></td>
        <td colspan="${sprint.duration}" class="sprints">
          <span class="d-block bg-sprint1 rounded-3 fs-14 text-primary">
            ${sprint.name}
          </span>
        </td>
        `
    );
  });
}

// load Sprints in table for Weeks vue :
function loadSprintsMV(activeSprints) {
  activeSprints.forEach((sprint, indx) => {
    const sprintStartDate = new Date(sprint.start);
    let colspan, nDays;
    if (indx == 0) {
      nDays = sprintStartDate.getDate();
    } else {
      const endDate = new Date(activeSprints[indx - 1].start);
      endDate.setDate(endDate.getDate() + activeSprints[indx - 1].duration);
      nDays = (sprintStartDate - endDate) / 86400000;
    }

    colspan = (nDays * 7) / 28;
    sprintsMTr?.insertAdjacentHTML(
      "beforeend",
      `
        <td colspan="${Math.round(colspan)}"></td>
        <td colspan="${Math.round((sprint.duration * 7) / 30)}" class="sprints">
          <span class="d-block bg-sprint1 rounded-3 fs-14 text-primary">
            ${sprint.name}
          </span>
        </td>
        `
    );
  });
  sprintsMTr?.classList.add("hidden");
}

// load User Stories in Table :
function loadUserStories(startDate, activeSprints) {
  let currColor = 1;
  activeSprints.forEach((sprint) => {
    const sprintStart = new Date(sprint.start);
    sprint.user_stories?.forEach((story, indx) => {
      const colspan = (sprintStart - startDate) / 86400000;
      tbody?.insertAdjacentHTML(
        "beforeend",
        `
        <tr class="user_story_tr">
          <td colspan="${colspan}"></td>
          <td style="--i: ${
            indx + 1
          }" class="user_story story${currColor}" colspan="${story.duration}">
            <span></span>
          </td>
        </tr>
      `
      );
      sprintStart.setDate(sprintStart.getDate() + story.duration);
      currColor = currColor == 6 ? 1 : currColor + 1;
    });
  });
}

// change vue :
const controlVue = (e) => {
  const value = e.target.textContent.toLowerCase();
  const storiesTr = document.querySelectorAll(".user_story_tr");

  Object.values(e.currentTarget.children).forEach((item) =>
    item.classList.remove("active")
  );
  e.target.classList.add("active");
  if (value == "months") {
    onlyMonthsTr?.classList.remove("hidden");
    sprintsMTr.classList.remove("hidden");
    sprintsWTr.classList.add("hidden");
    monthsTr?.classList.add("hidden");
    weekdaysTr?.classList.add("hidden");
    storiesTr.forEach((story) => story.classList.add("hidden"));
  } else if (value == "weeks") {
    onlyMonthsTr?.classList.add("hidden");
    sprintsMTr.classList.add("hidden");
    sprintsWTr.classList.remove("hidden");
    monthsTr?.classList.remove("hidden");
    weekdaysTr?.classList.remove("hidden");
    storiesTr.forEach((story) => story.classList.remove("hidden"));
  }
};

/***  Backlog PAGE SCRIPT    ***/

/***  Backlog PAGE SCRIPT    ***/

// generate user-stories HTML
function generate_user_html(id_generat, title) {
  const htmluser = ` <div
  id="userStorie"
  class="users_storise_sprint w-100 rounded d-flex align-items-center justify-content-between border"
  draggable="true"
>
  <div
    class="title_userstori_sprint d-flex align-items-center w-75 p-2"
    data-bs-toggle="modal"
    data-bs-target="#${id_generat}"
  >
    <h6 class="storie pt-2 px-2 m-0">${title}</h6>
    <p class="pt-2 m-0 mx-4">user storie</p>
  </div>
  <div class="option_userstorie d-flex align-items-center w-25">
    <div
      class="select_userstorie align-items-center justify-content-center rounded"
    >
      <div class="all_status d-flex" onclick="vue_status(event)">
        <p class="fill m-0">status</p>
        <img src="./assets/icons/arrow-down-1.png" alt="" class="arrodown" />
        <img class="arrowup" src="./assets/icons/arrow-up-1.png" alt="" onclick = "closing_status(event)"/>
      </div>
      <div class="status_storie" >
        <div class="todo" onclick="choix(event)">
          <span class="hv"></span>
          <p class="todo2 px-2 m-0">to do</p>
        </div>
        <div class="todo" onclick="choix(event)">
          <span class="hv"></span>
          <p class="todo2 px-2 m-0">doing</p>
        </div>
        <div class="todo"onclick="choix(event)">
          <span class="hv"></span>
          <p class="todo2 px-2 m-0">done</p>
        </div>
      </div>
    </div>

    
    <div class="DD d-flex justify-content-center mx-4" >
    <span class="deadline_userstorie" id="deadline_user" onclick="entre_dedline(event)" >-</span>
    <input type="number" class="duration_userStorie">
    </div>

    <div class="user"><span>AA</span></div>
  </div>
</div>`;
  return htmluser;
}

function generate_modal_userstorie(id_generat) {
  const madalstorie = `<div class="modal fade" id="${id_generat}" tabindex="-1" role="dialog" aria-labelledby="modalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h3 class="modal-title" id="modalLabel">
              <input type="text" class="title_userstorie">
              </h3>
              <div class="modal-header-img">
                  <img src="./assets/icons/eye.png" alt="photo">
                  <img src="./assets/icons/share-alt-solid-24 (3) 1.png" alt="photo">
                  <img src="./assets/icons/like-regular-24 1.png" alt="photo">
                  <button type="button" class="close" data-bs-dismiss="modal" aria-label="Fermer">
                      <span aria-hidden="true"><img src="./assets/icons/x-02.png"></span>
                  </button>
              </div>
          </div>
          <div class="modal-body">
              <div class="row m-1">
                  <div class="col-sm-6 border">
                      <div class="h5">Description</div>
                   <textarea name="disctiption" id="Discription_userstorie" cols="30" rows="10" placeholder="discription to user storie"></textarea>
                  </div>
                  <div class="col-sm-6 border ">
                      <div class="h5">Détails</div>q
                      <div class="date_start_storie">
                        <input type="text" id="initialTimeDisplay" readonly>
                      </div>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary " data-bs-dismiss="modal">Fermer</button>
              <button type="button" class="btn btn-primary" onclick = "UpdateInfoModal(event)" data-bs-dismiss="modal">Sauvegarder les modifications</button>
          </div>
      </div>
  </div>
</div>`;
  return madalstorie;
}

// create new sprint

const inputHtml = `  <input type="text" class="create_name_userstorie" id="create_title" placeholder="Qu'est-ce qui doit etre fait ?">`;

/* === add users stories ===*/

/*=== sprint ===*/
function account_tickets_sprint() {
  const numberTicketsprint = document.querySelector(".account_ticket_sprint");
  NumberTicket_sprint++;
  numberTicketsprint.innerText = `${NumberTicket_sprint} - ticket`;
}

const container1 = document.getElementById("container");
let NumberTicket_sprint = 0;
const button = document.getElementById("add_backlog_btn");
function createNewDiv() {
  /* === disable the button for add the user storie === */
  button.disabled = true;
  button2.disabled = true;

  /* === show the input for creat the name user storie === */
  container1.insertAdjacentHTML("beforeend", inputHtml);
  const create_name_userstorie = document.querySelector(
    ".create_name_userstorie"
  );

  /* === focus input === */
  create_name_userstorie.focus();

  /* === creat user storie === */
  create_name_userstorie.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const creat_title_userstorie = document.getElementById("create_title");
      const thetitle_userstorie = creat_title_userstorie.value;
      const id_generat = `modal_${NumberTicket_sprint}`;
      account_tickets_sprint();
      container1.insertAdjacentHTML(
        "beforeend",
        generate_user_html(id_generat, thetitle_userstorie)
      );

      /* === generat new is for modal to new user storie === */
      container1.insertAdjacentHTML(
        "beforeend",
        generate_modal_userstorie(id_generat)
      );

      /* === remove input === */
      create_name_userstorie.remove();

      /* === show the button for add the user storie === */
      button.disabled = false;
      button2.disabled = false;
      addUserstorie(thetitle_userstorie, "sprints");
    }
  });
}

/* === backloge === */

function account_tickets_backlog() {
  const numberTicketbacklog = document.querySelector(".account_ticket");
  NumberTicket_backlog++;
  numberTicketbacklog.innerText = `${NumberTicket_backlog} - ticket`;
}

const container2 = document.getElementById("container2");
let accordion = document.querySelector("#tickets_backlog");
let NumberTicket_backlog = 0;
const button2 = document.getElementById("add_backlog_btn2");

function createNewDiv2() {
  /* === disable the button for add the user storie === */
  button.disabled = true;
  button2.disabled = true;

  /* === show the input for creat the name user storie === */
  container2.insertAdjacentHTML("beforeend", inputHtml);
  const create_name_userstorie = document.querySelector(
    ".create_name_userstorie"
  );

  /* === focus input === */
  create_name_userstorie.focus();

  /* === creat user storie === */
  create_name_userstorie.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const creat_title_userstorie = document.getElementById("create_title");
      const thetitle_userstorie = creat_title_userstorie.value;
      const id_generat = `modal_${NumberTicket_backlog + 100}`;
      account_tickets_backlog();

      container2.insertAdjacentHTML(
        "beforeend",
        generate_user_html(id_generat, thetitle_userstorie)
      );

      /* === generat new is for modal to new user storie === */
      container2.insertAdjacentHTML(
        "beforeend",
        generate_modal_userstorie(id_generat)
      );

      /* === remove input === */
      create_name_userstorie.remove();

      /* === show the button for add the user storie === */
      button.disabled = false;
      button2.disabled = false;
      addUserstorie(thetitle_userstorie, "backlog");
    }
  });
}
/* =================================UPDATE USERS STORIES DANS LES OBJECTS========================================================= */
function addUserstorie(name, dadstorie) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  projectData[dadstorie].push({
    name,
    status: "to do",
    description: "",
    start: `${year}-${month}-${day}`,
    duration: 0,
  });
}

function UpdateInfoModal(event) {
  const modal_id = event.currentTarget
    .closest(".modal")
    .getAttribute("id")
    .split("_")[1];
  let userstorie, dadstorie;
  if (modal_id >= 100) {
    userstorie = document.querySelectorAll("#container2 .users_storise_sprint")[
      modal_id - 100
    ];
    dadstorie = `backlog`;
  } else {
    userstorie = document.querySelectorAll("#container .users_storise_sprint")[
      modal_id
    ];
    dadstorie = `sprints`;
  }
  const titreuserstorie = userstorie.querySelector(".storie").textContent;
  const newTitleUserstorie = event.currentTarget
    .closest(".modal-content")
    .querySelector(".title_userstorie").value;
  const newdescription = event.currentTarget
    .closest(".modal-content")
    .querySelector("#Discription_userstorie").value;
  if (newTitleUserstorie)
    UpdateUserstorie(titreuserstorie, "name", newTitleUserstorie, dadstorie);
  if (newdescription)
    UpdateUserstorie(titreuserstorie, "description", newdescription, dadstorie);
}
function UpdateUserstorie(namestorie, property, newValue, dadtuser) {
  console.log(namestorie, property, newValue, dadtuser);
  const currStoryIndex = projectData[dadtuser].findIndex(
    (storie) => storie.name === namestorie
  );
  switch (property) {
    case "name":
      projectData[dadtuser][currStoryIndex].name = newValue;
      // console.log(projectData);
      break;
    case "status":
      projectData[dadtuser][currStoryIndex].status = newValue;
      break;
    case "description":
      console.log(projectData);
      projectData[dadtuser][currStoryIndex].description = newValue;
      break;
    default:
      console.log("Incorrect Property");
      break;
  }
}
/* ================================================================================================================================ */
/* ==== controle the status for user storie ==== */

function vue_status(event) {
  event.currentTarget.nextElementSibling.style.display = "block";
  event.currentTarget.querySelector(".arrowup").style.display = "block";
  event.currentTarget.querySelector(".arrodown").style.display = "none";
}

function closing_status(event) {
  event.currentTarget
    .closest(".option_userstorie")
    .querySelector(".status_storie").style.display = "none";

  event.currentTarget.previousElementSibling.style.display = "block";

  event.target.style.display = "none";

  event.stopPropagation();
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////

/* ==== choix status user storie ==== */

function choix(event) {
  event.currentTarget
    .closest(".option_userstorie")
    .querySelector(".fill").textContent =
    event.currentTarget.querySelector(".todo2").textContent;

  const nameUserStorie = event.currentTarget
    .closest(".users_storise_sprint")
    .querySelector(".storie").textContent;

  const dadtouserstorie = event.currentTarget.closest("#container2")
    ? `backlog`
    : `sprints`;

  UpdateUserstorie(
    nameUserStorie,
    "status",
    event.currentTarget.querySelector(".todo2").textContent,
    dadtouserstorie
  );

  event.currentTarget
    .closest(".option_userstorie")
    .querySelector(".status_storie").style.display = "none";

  event.currentTarget
    .closest(".option_userstorie")
    .querySelector(".arrodown").style.display = "block";

  event.currentTarget
    .closest(".option_userstorie")
    .querySelector(".arrowup").style.display = "none";
}

/* ================================= dedline to user storie ================================= */

function entre_dedline(event) {
  event.target.style.display = "none";
  event.currentTarget.nextElementSibling.style.display = "block";
  event.currentTarget.nextElementSibling.focus();
  event.currentTarget.nextElementSibling.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        event.currentTarget.previousElementSibling.innerHTML =
          event.currentTarget.value;
        event.currentTarget.previousElementSibling.style.display = "flex";
        event.currentTarget.style.display = "none";
      }
    }
  );
}

/***  settings PAGE STYLES    ***/
/***  settings PAGE STYLES    ***/

/***  USER_SECTION STYLES    ***/

function add_user() {
  const rowHTML = `
    <tr class="tabRow" onclick="actionEvent(event)" >
      <th><input class="inputtab" type="text" name="nameUser" placeholder="User_name" onfocus="addButtonEvent(event)"></th>
      <th><input class="inputtab" type="email" name="emailUser" placeholder="User_email" onfocus="addButtonEvent(event)"></th>
      <th>
        <div class="btn-modsup">
          <button class="btn-modif" onclick="actionEvent(event)">
            <img src="./assets/icons/modif.svg" alt="">
          </button>
          <button class="btn-sup" onclick="actionEvent(event)">
            <img src="./assets/icons/delete.svg" alt="">
          </button>
          <button class="btn-add" type="button" onclick="validateForm(event)"><span>save</span></button>
        </div>
      </th>
    </tr>
  `;
  document.querySelector("table tbody").insertAdjacentHTML("beforeend", rowHTML);
}
//actionEvent
function actionEvent(event) {
  // deleteUser
  if (event.target.parentElement.classList.contains("btn-sup")) {
    event.currentTarget.remove();
  }

  // modifInfo
  else if (event.target.parentElement.classList.contains("btn-modif")) {
    event.currentTarget
      .closest(".tabRow").querySelector(".btn-add").style.display = "block";
    let modifInfo = event.currentTarget
      .closest(".tabRow").querySelectorAll(".inputtab");
    
    modifInfo[0].disabled = false;
    modifInfo[1].disabled = false;
  }
}
//validationInfo
function addButtonEvent(event) {
  event.currentTarget.closest(".tabRow").querySelector(".btn-add").style.display = "block";
}

function validateName(name) {
  // ValidName

  const nameParts = name.split(" ");
  return nameParts.length === 2;
}

function validateForm(event) {
  const nameInput = event.currentTarget
    .closest(".tabRow")
    .querySelector('input[name="nameUser"]');
  const emailInput = event.currentTarget
    .closest(".tabRow")
    .querySelector('input[name="emailUser"]');

  if (!validateName(nameInput.value)) {
    alert("Please enter a valid name (First Name Last Name).");
    return false;
  }

  // validEmail
  const emailRegex = /^[a-zA-Z0-9._-]+@(gmail|outlook|hotmail)\.[a-z]{2,4}$/;
  if (!emailRegex.test(emailInput.value)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // If all validations pass
  alert("Saved successfully!");

  let saveInfo = event.currentTarget.closest(".tabRow").querySelectorAll(".inputtab");
  saveInfo[0].disabled = true;
  saveInfo[1].disabled = true;
  event.currentTarget
    .closest(".tabRow")
    .querySelector(".btn-add").style.display = "none";
}

/***  INFO_SECTION STYLES    ***/

let image = document.getElementById("output");
let file = document.getElementById("file");
let btn = document.querySelector(".btn");

file?.addEventListener("change", function (event) {
  image.src = URL.createObjectURL(event.target.files[0]);
  console.log(image.getAttribute("src"));
  localStorage.setItem("nvImage", image.getAttribute("src"));
});

//  localStorage //

let nameInput = document.querySelector(".input1 input");
let descInput = document.querySelector(".input2 textarea");
let btnEregister = document.querySelector(".btn2");

function addNameInfo() {
  localStorage.setItem("nameInfo", nameInput.value);
}

function antiRefresh() {
  let nameInfo = localStorage.getItem("nameInfo");
  if (nameInfo) {
    nameInput.value = nameInfo;
  }
}
antiRefresh();

function addDescInfo() {
  localStorage.setItem("descInfo", descInput.value);
}

function antiRefresh2() {
  let descInfo = localStorage.getItem("descInfo");
  if (descInfo) {
    descInput.value = descInfo;
  }
}

antiRefresh2();

btnEregister?.addEventListener("click", () => {
  addNameInfo();
  addDescInfo();
});

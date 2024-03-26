"use strict";
// Object to store application data
const appData = {
  noteStorage: [], // includes all note objects
  noteIndex: [], // stores active note index
  sortedNotes: [], // stores sorted notes
  deletedNotes: [], // stores deleted notes
};
// Key for local storage
const localStorageKey = "notonAppData";
// When the window is loaded, initialize the application
window.onload = function () {
  inputTitle.value = "";
  inputNote.value = "";
  const storedData = localStorage.getItem(localStorageKey);

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    Object.assign(appData, parsedData);
  }
  updateSidebar();
};

const rootStyles = getComputedStyle(document.documentElement);
const borderColor = rootStyles.getPropertyValue("--color-border-main");
console.log(borderColor);
// Selectors
const headerDate = document.querySelector(".header-date");
const btnSave = document.querySelector(".btn-save");
const btnEdit = document.querySelector(".btn-edit");
const btnAdd = document.querySelector(".btn-add");
const sidebarOl = document.getElementById("sidebar-ol");
const inputNote = document.querySelector(".input-note");
const inputTitle = document.querySelector(".input-title");
const inputContainer = document.querySelector(".input-container");
const readContainer = document.querySelector(".read-container");
const readZone = document.querySelector(".read-zone");
// const readNote = document.querySelector(".read-note");

const readTitle = document.querySelector(".read-title");
const sidebarOlFlex = document.querySelector(".sidebar-li-flex");
const btnSidebar = document.querySelector(".btn-trash-menu");
const btnSidebarClose = document.querySelector(".btn-trash-close");
const trashMenu = document.querySelector(".trash-menu");
const emptyTrash = document.querySelector(".btn-empty-trash"); // Selector for the empty trash button

// Getting Localtime
const localTimeI = function () {
  const date = new Date();
  const dates = {
    milisecond: date.getMilliseconds(),
    second: date.getSeconds(),
    minute: date.getMinutes(),
    hour: date.getHours(),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
  return dates;
};
localTimeI();
let dateOutput = localTimeI();
let dateModified = `New Note ${dateOutput.day}.${dateOutput.month}.${dateOutput.year} `;
headerDate.textContent = `${dateOutput.day}/${dateOutput.month}/${dateOutput.year}`;
// Function to save application data to local storage
const saveToLocalStorage = function () {
  const stringifiedData = JSON.stringify(appData);
  localStorage.setItem(localStorageKey, stringifiedData);
};
// Function to get current date and time
const currentDate = function (option) {
  // getting localtime. converted string with toISOString() method;
  const selector = option;

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const dateString = date.toISOString();
  if (selector === `string`) {
    return dateString;
  }
  if (selector === "object") {
    return formattedDate;
  }
};
// Event listener for adding a new note
btnAdd.addEventListener("click", function () {
  addNoteWindow();
});
// Event listener for saving a note
btnSave.addEventListener("click", function () {
  const title = inputTitle.value.trim();
  const note = inputNote.value.trim();

  if (!(note === "")) {
    // error check. runs if input field isnt empty.
    if (appData.noteIndex.length < 1) {
      appData.noteIndex.push(1);
      const newData = createNote(inputTitle, inputNote);
      appData.noteStorage.push(newData);
      console.log(appData.noteStorage);
      elementInjectorTitle(newData);
      clearInputField();
      addNoteWindow();
    } else {
      const index = appData.noteIndex[0];
      editNote(index);
      showNoteWindow(index);
      elementModifierTitle(index);
      console.log(appData.noteStorage[index].dateCreated);
      console.log(`index:${appData.noteIndex}zex`); // [DEBUG] track note index
    }
    updateSidebar();
    saveToLocalStorage();
  }
});
// Event listener for editing a note
btnEdit.addEventListener("click", function () {
  editNoteWindow(appData.noteIndex);
  updateSidebar();
  saveToLocalStorage();
  console.log(`index:${appData.noteIndex}xex`); // [DEBUG] track note index
});
// Event listener for clicking on a note in the sidebar
sidebarOl.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    const index = Array.from(sidebarOl.children).indexOf(
      event.target.parentElement
    );
    Array.from(sidebarOl.children).forEach(function (child) {
      child.classList.remove("sidebar-li-active-note");
    });
    event.target.parentElement.classList.add("sidebar-li-active-note");
    showNoteWindow(index);
    appData.noteIndex = [index];
    console.log(`index:${appData.noteIndex}xxx`); // [DEBUG] track note index
  }
});
// Event listener for clicking on the trash icon in the sidebar
sidebarOl.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-trash")) {
    const dataIndex = event.target.getAttribute("data-index");
    console.log(`data-index: ${dataIndex}`); // [DEBUG] track btn-trash HTML data-index
    moveToTrash(dataIndex);
    updateSidebar();
    saveToLocalStorage();
    addNoteWindow();
  }
});
const dateSort = function (location) {
  location.sort((a, b) => {
    const dateA = a.dateModified || a.dateCreated;
    const dateB = b.dateModified || b.dateCreated;
    // Önce bookmark durumuna göre sıralama yapılıyor
    const bookmarkComparison = (b.bookmark ? 1 : 0) - (a.bookmark ? 1 : 0);
    if (bookmarkComparison !== 0) {
      return bookmarkComparison;
    }
    return new Date(dateB) - new Date(dateA);
  });
};

// Mark an active element
const markActiveElement = function (index) {
  sidebarOl.children[index].style;
};
// Event listener for input title change
inputTitle.addEventListener("input", function () {});
// Function to inject title element into the sidebar
const elementInjectorTitle = function (arr, index) {
  // HTML element injector.
  const div = document.createElement("div"); // create a <div> includes 2 child elements <li> & <button>
  div.classList.add("sidebar-li-flex");
  const newLi = document.createElement("li");
  const bookmarkButton = document.createElement("button");
  const trashButton = document.createElement("button");
  bookmarkButton.classList.add("btn-bookmark");
  bookmarkButton.setAttribute("data-index", index);
  trashButton.classList.add("btn-trash");
  trashButton.setAttribute("data-index", index);
  newLi.innerHTML = arr.title; // if created notes title element is empty add current date
  sidebarOl.appendChild(div);
  div.appendChild(newLi);
  div.appendChild(trashButton);
  div.appendChild(bookmarkButton);
};
// Update the sidebar by sorting the notes and injecting them into the DOM.
const updateSidebar = function () {
  appData.sortedNotes = appData.noteStorage
    .slice()
    .filter((status) => status.active === true);
  appData.deletedNotes = appData.noteStorage
    .slice()
    .filter((status) => status.active === false);
  dateSort(appData.sortedNotes);
  dateSort(appData.deletedNotes);
  sidebarOl.innerHTML = "";
  trashListOl.innerHTML = "";
  appData.sortedNotes.forEach(function (note, i) {
    elementInjectorTitle(note, appData.noteStorage.indexOf(note));
    // console.log(`i:${i} title:${note.title} note:${note.note}`); // [DEBUG]
  });
  appData.deletedNotes.forEach(function (note, i) {
    elementInjectorTrash(note, appData.noteStorage.indexOf(note));
    // console.log(`i:${i} title:${note.title} note:${note.note}`); // [DEBUG]
  });
  highlightBookmarkedElements();
};
// Event listener for clicking on the trash icon in the sidebar
btnSidebar.addEventListener("click", function () {
  trashMenu.classList.toggle("open");
});

// Event listener for closing the trash menu
btnSidebarClose.addEventListener("click", function () {
  trashMenu.classList.toggle("open");
});

// Function to modify the title of an element in the sidebar.
const elementModifierTitle = function (index) {
  sidebarOl.getElementsByTagName("li")[index].innerHTML =
    appData.noteStorage[index].title;
};
const createNote = function (title, note) {
  // Create a new note object.
  const titleValue = title.value.trim();
  const titleCheck = titleValue !== "" ? titleValue : dateModified;
  const noteValue = note.value.trim();
  const newData = {
    title: titleCheck,
    note: noteValue,
    active: true,
    bookmark: false,
    bookmarkDate: "",
    dateCreated: currentDate("string"),
    dateCreatedObject: currentDate("object"),
    // dateObject: currentDate("object"),
  };
  return newData;
};
const editNote = function (index) {
  // Edit an existing note.
  const newTitle = inputTitle.value.trim();
  const newNote = inputNote.value.trim();
  if (
    appData.sortedNotes[index].title === newTitle &&
    appData.sortedNotes[index].note === newNote
  ) {
    console.log("No changes to date"); // [DEBUG] Track date changes
  } else {
    appData.sortedNotes[index].title = newTitle;
    appData.sortedNotes[index].note = newNote;
    appData.sortedNotes[index].dateModified = currentDate("string");
    appData.sortedNotes[index].dateModifiedObject = currentDate("object");
    console.log("Date modified"); // [DEBUG] Track date changes
    console.log(appData.sortedNotes[index].dateModified); // [DEBUG] Track date changes
  }
};
// Show the window for adding a new note.
const addNoteWindow = function () {
  readContainer.style.display = "none";
  inputContainer.style.display = "flex";
  clearInputField();
  appData.noteIndex.shift();
};
const dateWindowCreated = document.querySelector(".date-created-text");
const dateWindowModified = document.querySelector(".date-modified-text");
// Show the note created & note modified datas.
const dateInfo = function (index, option) {
  let selector = option;
  let output = "";

  if (selector === "created") {
    output = `Note Created: ${appData.sortedNotes[index].dateCreatedObject}`;
  } else if (selector === "modified") {
    if (appData.sortedNotes[index].dateModifiedObject !== undefined) {
      output = `Last Modified: ${appData.sortedNotes[index].dateModifiedObject}`;
    }
  }
  return output;
};

// Show the window for an existing note.
const showNoteWindow = function (index) {
  dateWindowCreated.innerHTML = dateInfo(index, "created");
  dateWindowModified.innerHTML = dateInfo(index, "modified");
  readZone.textContent = appData.sortedNotes[index].note;
  readTitle.textContent = appData.sortedNotes[index].title;
  readContainer.style.display = "flex";
  inputContainer.style.display = "none";
};
// Show the window for editing an existing note.
const editNoteWindow = function (index) {
  inputNote.value = appData.sortedNotes[index].note;
  inputTitle.value = appData.sortedNotes[index].title;
  readContainer.style.display = "none";
  inputContainer.style.display = "flex";
  inputNote.focus(); // focus edit window after pressing the edit button.
};
// Move a note to the trash
const moveToTrash = function (i) {
  appData.noteStorage[i].active = false;
  console.log(appData.noteStorage[i].active);
};
// Clear input fields.
const clearInputField = function () {
  inputTitle.value = "";
  inputNote.value = "";
};

///////////////////////////////// Test Data Injector
// Generate random text
function generateRandomText(number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let output = "";
  for (let i = 0; i < number; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    output += characters.charAt(randomIndex);
  }
  return output;
}
// Function to add random notes
function addRandomNotes(number) {
  for (let i = 0; i < number; i++) {
    const randomTitle = generateRandomText(10);
    const randomNote = generateRandomText(20);

    const newNote = createNote({ value: randomTitle }, { value: randomNote });

    appData.noteStorage.push(newNote);
    elementInjectorTitle(newNote);
  }
}
// Interval to add random notes
const injector = setInterval(function () {
  addRandomNotes(1);
}, 100);
// Clear the interval after 600 milliseconds
setTimeout(function () {
  clearInterval(injector);
  updateSidebar();
  highlightBookmarkedElements();
  console.log(appData.sortedNotes);
}, 600);

const trashListOl = document.querySelector(".trash-list");
// Function to inject elements into the trash list
const elementInjectorTrash = function (arr, index) {
  // HTML element injector.
  const div = document.createElement("div"); // create a <div> includes 2 child elements <li> & <button>
  div.classList.add("trash-flex");
  const newLi = document.createElement("li");
  const btnRestore = document.createElement("button");
  btnRestore.classList.add("btn-restore");
  btnRestore.setAttribute("data-index", index);
  newLi.innerHTML = arr.title;
  trashListOl.appendChild(div);
  div.appendChild(newLi);
  div.appendChild(btnRestore);
};
// Function to restore a note from the trash
const restoreNote = function (i) {
  appData.noteStorage[i].active = true;
  console.log(appData.noteStorage[i].active);
};
// Event listener for restoring a note
trashListOl.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-restore")) {
    const dataIndex = event.target.getAttribute("data-index");
    console.log(`data-index: ${dataIndex}`); // [DEBUG] track btn-trash HTML data-index
    restoreNote(dataIndex);
    updateSidebar();
    addNoteWindow();
  }
});

// Event listener for emptying the trash
emptyTrash.addEventListener("click", function () {
  const warning = window.confirm(
    "All messages will be deleted. Do you want to proceed?"
  );
  if (warning) {
    appData.noteStorage = appData.noteStorage.filter(
      (status) => status.active === true
    );
    updateSidebar();
    saveToLocalStorage();
    trashMenu.classList.toggle("open");
    console.log("Deleted");
    trashListOl.innerHTML = "";
  } else {
    console.log("Deletion canceled");
  }
});
// Function the change themes
const themeChanger = function () {
  document.documentElement.style.setProperty("--color-border-main", "#4fe4bf");
  document.documentElement.style.setProperty("--color-scrollbar", "#4fe4bf");
  document.documentElement.style.setProperty("--color-border-btn", "#f7748a");
  document.documentElement.style.setProperty(
    "--color-background-main",
    "#212121"
  );
  document.documentElement.style.setProperty("--color-text-main", "#dedede");
  document.documentElement.style.setProperty(
    "--color-text-trash-header",
    "#302f2adc"
  );
  document.documentElement.style.setProperty("--color-box-main", "#2f2f2f");
  document.documentElement.style.setProperty("--color-scrollbar-2", "#ffc635");
  document.documentElement.style.setProperty("--color-list-hover", "#ffc635");
};
// Function to change the theme to dark mode
const themeChangerDark = function () {};
const btnSettingsClose = document.querySelector(".btn-settings-close");
const btnSettingsMenu = document.querySelector(".btn-settings");
const settingsMenu = document.querySelector(".settings-menu");

const themes = {
  default: {
    "--color-border-main": "#aa3434",
    "--color-scrollbar": "#aa3434",
    "--color-border-btn": "#f7748a",
    "--color-background-main": "#67828f85",
    "--color-text-main": "#3b3a34dc",
    "--color-text-trash-header": "#302f2adc",
    "--color-text-header": "#3b3a34dc",
    "--color-box-main": "#fff6de",
    "--color-scrollbar-2": "#ffc635",
    "--color-list-hover": "#ffc635",
    "--color-background-btn": "#fff6de",
  },
  dark: {
    "--color-border-main": "#c18fff",
    "--color-scrollbar": "#602f9b",
    "--color-border-btn": "#bb86fc",
    "--color-background-main": "#0b0b0b",
    "--color-text-main": "#e6e6e6",
    "--color-text-trash-header": "#e6e6e6",
    "--color-text-header": "#2a353d",
    "--color-box-main": "#202020",
    "--color-scrollbar-2": "#c391ff",
    "--color-list-hover": "#602f9b",
    "--color-background-btn": "#c290ff",
  },
};

const changeTheme = function (themeName) {
  const theme = themes[themeName];
  if (theme) {
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  } else {
    console.error(`tema bulunamadı.`);
  }
};

// Tema değiştirme fonksiyonunu kullanarak örnek bir tema değiştirme
// changeTheme("dark");

const btnThemeI = document.querySelector(".btn-themeI");
const btnThemeII = document.querySelector(".btn-themeII");
btnThemeI.addEventListener("click", function () {
  changeTheme("default");
  highlightBookmarkedElements();
});
btnThemeII.addEventListener("click", function () {
  changeTheme("dark");
  highlightBookmarkedElements();
});
////////////// NEW LINES //////////////////////////
const bookmark = function (index) {
  let bookmarked = appData.noteStorage[index].bookmark;
  if (bookmarked === false) {
    appData.noteStorage[index].bookmark = true;
  } else {
    appData.noteStorage[index].bookmark = false;
  }
  console.log(appData.noteStorage[index].bookmark);
  updateSidebar();
  addNoteWindow();
};
const btnBookmark = document.querySelector(".btn-bookmark");
sidebarOl.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-bookmark")) {
    const btnBookmark = event.target; // Tıklanan butona erişim sağlanıyor
    console.log(btnBookmark);
    const dataIndex = btnBookmark.getAttribute("data-index");
    const index = parseInt(dataIndex);
    btnBookmark.classList.toggle("active");
    bookmark(index);
    updateSidebar();
    saveToLocalStorage();
  }
});

function highlightBookmarkedElements() {
  const sidebarItems = document.querySelectorAll(".sidebar-li-flex"); // Sidebar elemanlarını seç

  const rootStyles = getComputedStyle(document.documentElement); // Kök öğenin stilini al

  sidebarItems.forEach(function (item) {
    const bookmarkButton = item.querySelector(".btn-bookmark");
    const dataIndex = bookmarkButton.getAttribute("data-index");
    const index = parseInt(dataIndex);

    const borderColor = rootStyles.getPropertyValue("--color-border-main");

    if (appData.noteStorage[index].bookmark) {
      bookmarkButton.style.backgroundColor = borderColor;
      bookmarkButton.style.display = "block";
      bookmarkButton.style.opacity = "1";
    } else {
      bookmarkButton.style.backgroundColor = "";
      bookmarkButton.style.display = "";
      bookmarkButton.style.opacity = "";
    }
  });
}

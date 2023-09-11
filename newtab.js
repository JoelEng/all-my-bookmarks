const body = document.getElementById("main");
let openFolder = null;
let colors = null;

const addBookmark = (obj, parent) => {
  const bm = document.createElement("a");
  bm.classList.add("bookmark", "item");
  bm.textContent = obj.title;
  bm.href = obj.url;
  bm.prepend(getIcon(obj.url));

  bm.style.background = "rgba(255, 255, 255, 0.94)";

  parent.appendChild(bm);
  return bm;
};

const addFolder = (obj, parent) => {
  // folder item visible in the bookmark grid
  const folderItem = document.createElement("div");
  folderItem.classList.add("folderItem", "item");
  folderItem.textContent = obj.title;
  parent.appendChild(folderItem);

  // icon representation of a folder
  const folderIcon = document.createElement("img");
  folderIcon.src = "icons/folder.svg";
  folderIcon.classList.add("img");
  folderItem.prepend(folderIcon);

  // container
  const folderContainer = document.createElement("div");
  folderContainer.classList.add("folderContainer");
  body.appendChild(folderContainer);

  // click the folder to open it
  folderItem.onclick = () => {
    if (openFolder) {
      openFolder.style.display = "none";
    }
    folderContainer.style.display = "flex";
    openFolder = folderContainer;
  };

  // the contents of the folder
  const folder = document.createElement("div");
  folder.classList.add("folder", "grid");
  folderContainer.appendChild(folder);

  // dark background when folder is open
  const darkBackground = document.createElement("div");
  darkBackground.classList.add("darkBackground");
  folderContainer.appendChild(darkBackground);
  darkBackground.onclick = () => {
    folderContainer.style.display = "none";
  };

  // folder theming
  folder.style.background = colors.ntp_background;

  return folder;
};

function appendItem(bmObj, parent) {
  let item;
  if (bmObj.url) {
    item = addBookmark(bmObj, parent);
  } else {
    item = addFolder(bmObj, parent);
  }

  if (bmObj.children) {
    for (const child of bmObj.children) {
      appendItem(child, item);
    }
  }
}

const getIcon = (url) => {
  const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    url
  )}&sz=64`;
  const img = document.createElement("img");
  img.src = src;
  img.classList.add("img");
  return img;
};

const getTheme = async () => {
  const theme = await browser.theme.getCurrent();
  colors = theme.colors;
  console.log(colors);

  const html = document.documentElement;
  html.style.background = colors.ntp_background;
};

document.addEventListener("keydown", (event) => {
  if (event.key == "Escape") {
    openFolder.style.display = "none";
  }
});

const init = async () => {
  await getTheme();
  let treeRoot = await browser.bookmarks.getSubTree("toolbar_____");
  for (const item of treeRoot[0].children) {
    appendItem(item, body);
  }
};
init();

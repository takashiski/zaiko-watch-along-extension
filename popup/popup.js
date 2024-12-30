const textElement = document.getElementById("textElement");
const popupButtonElement = document.getElementById("popupButton");
const playButtonElement = document.getElementById("playButton");
const pauseButtonElement = document.getElementById("pauseButton");
const showhideButtonElement = document.getElementById("showhideButton");
const bodyElement = document.getElementsByTagName("body")[0];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    textElement.textContent = message.time;
});

//クリップボードにtimeText.textContentをコピーする
bodyElement.addEventListener("copy", (e) => {
    e.clipboardData.setData('text/plain', textElement.textContent);
    e.preventDefault();
});
//クリップボードから取得した値をパースし、video.currentTimeにセットする
bodyElement.addEventListener("paste", async (e) => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const sec = convertHHMMSSToSec(e.clipboardData.getData('text/plain'));
    console.log(e.clipboardData.getData('text/plain'));
    console.log(sec);
    await chrome.tabs.sendMessage(tab.id, {action: "seek", currentTime: sec});
});


popupButtonElement.addEventListener("click", () => {
    chrome.windows.create({url: "window/window.html", type: "popup", width: 350, height: 300});
    // chrome.tabs.create({url: "window/window.html"});
});


playButtonElement.addEventListener("click", async() => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    await chrome.tabs.sendMessage(tab.id, {action: "play"});
});

pauseButtonElement.addEventListener("click", async() => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    await chrome.tabs.sendMessage(tab.id, {action: "pause"});
});

showhideButtonElement.addEventListener("click", async() => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    await chrome.tabs.sendMessage(tab.id, {action: "showhide"});
});


function convertHHMMSSToSec(hhmmss) {
    const splited = hhmmss.split(":");
    let currentTime = 0;
    if (splited.length === 3) {
        currentTime = Number(splited[0]) * 60 * 60 + Number(splited[1]) * 60 + Number(splited[2]);
    } else if (splited.length === 2) {
        currentTime = Number(splited[0]) * 60 + Number(splited[1]);
    } else {
        currentTime = Number(splited[0]);
    }
    return currentTime;
}

function convertSecToHHMMSS(sec) {
    const hour = Math.floor(sec / 3600);
    const minute = Math.floor((sec % 3600) / 60);
    const second = sec % 60;
    return `${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}:${second.toString().padStart(2,"0")}`;
}
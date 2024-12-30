const textElement = document.getElementById("textElement");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    textElement.textContent = ` ${message.time} -${convertSecToHHMMSS(message.duration-message.currentTime)}`;
});

const backgroundColorInput = document.getElementById("backgroundColor");
const textColorInput = document.getElementById("textColor");
const textStrokeColorInput = document.getElementById("textStrokeColor");
const fontSizeInput = document.getElementById("fontSize");

backgroundColorInput.addEventListener("change", async() => {
    textElement.style.backgroundColor = backgroundColorInput.value;
});
textColorInput.addEventListener("change", async() => {
    textElement.style.color = textColorInput.value;
});
fontSizeInput.addEventListener("change", async() => {
    textElement.style.fontSize = `${fontSizeInput.value}px`;
});

function convertHHMMSSToSec(hhmmss) {
    const splited = hhmmss.split(" ")[0].split(":");
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
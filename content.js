const timeText = document.createElement("h1");
timeText.value = "ここに時間が表示されます";
timeText.textContent = "ここに時間が表示されます";
timeText.style.position = "fixed";
timeText.style.top = "0";
timeText.style.left = "0";
timeText.style.display = "none";
document.body.appendChild(timeText);

const body = document.getElementsByTagName("body")[0];
const video = document.querySelector('video');
video.addEventListener("timeupdate", (e) => {
    const time = Math.round(video.currentTime);
    const hhmmss = convertSecToHHMMSS(time);
    chrome.runtime.sendMessage({ time: hhmmss, currentTime: time, duration: video.duration });
    timeText.textContent = hhmmss;

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "play") {
        video.play();
    } else if (message.action === "pause") {
        video.pause();
    } else if (message.action === "seek") {
        video.currentTime = Number(message.currentTime);
    } else if (message.action === "showhide") {
        if (timeText.style.display === "none") {
            timeText.style.display = "block";
        } else {
            timeText.style.display = "none";
        }
    }
});

//クリップボードにtimeText.textContentをコピーする
body.addEventListener("copy", (e) => {
    e.clipboardData.setData('text/plain', timeText.textContent);
    e.preventDefault();
});
//クリップボードから取得した値をパースし、video.currentTimeにセットする
body.addEventListener("paste", (e) => {
    const currentTime = convertHHMMSSToSec(e.clipboardData.getData('text/plain'));
    video.currentTime = currentTime;
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
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
}
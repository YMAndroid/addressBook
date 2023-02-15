const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

function humandate(beginTime, endTime) {
    let msTime = new Date(endTime) - new Date(beginTime);
    console.log("msTime===>", msTime)
    let time = msTime / 1000;
    let hour = Math.floor(time / 60 / 60);
    hour = hour.toString().padStart(2, "0");
    let minute = Math.floor(time / 60) % 60;
    minute = minute.toString().padStart(2, "0");
    let second = Math.floor(time) % 60;
    second = second.toString().padStart(2, "0");
    return `${hour !== '00' ? hour + ':' : ''}${minute}:${second}`;
}

module.exports = {
    formatTime,
    humandate
}

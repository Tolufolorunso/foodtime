// "use strict";
const hour = document.querySelector("#hour");
const minute = document.querySelector("#min");
const second = document.querySelector("#sec");
const todayDateUI = document.querySelector("#today-date");

function timeSetUP() {
  const now = new Date();
  let hrs = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  let todayDate = now.toDateString();

  let ap = "AM";
  if (hrs > 11) ap = "PM";
  if (hrs > 12) hrs = hrs - 12;
  if (hrs === 0) hrs = 12;
  // if (hrs < 10) hrs = 12;
  return {
    hrs,
    ap,
    min,
    sec,
    todayDate,
  };
}

const form = document.querySelector("#food-detail");
form.addEventListener("submit", getDataFromUI);

function getDataFromUI(e) {
  e.preventDefault();
  let timeToEat = +document.querySelector("#time-to-eat").value;
  console.log(isNaN(timeToEat));
  let foodName = document.querySelector("#food-name").value;
  let foodType = form.querySelector("#food-type").value;
  if (
    foodName === "" ||
    foodType === "" ||
    timeToEat === "" ||
    isNaN(timeToEat)
  ) {
    alert("You need to add all fields or invalid time input");
    return;
  }
  let foodTimeTable = { foodName, foodType, timeToEat };
  addFoodTimeTableToStorage(foodTimeTable);
  document.querySelector("#food-name").value = "";
}

const getTime = () => {
  let { hrs, min, sec, ap, todayDate } = timeSetUP();
  sec = sec < 10 ? "0" + sec : sec;
  min = min < 10 ? "0" + min : min;
  hour.innerHTML = `${hrs} <span>HRS</span>`;
  minute.innerHTML = `${min} <span>MIN</span>`;
  second.innerHTML = `${sec} <span>SEC</span>`;
  todayDateUI.innerHTML = `${todayDate}`;
};

const timeToEat = () => {
  const dataFromDB = getFoodTimeTablefromStorage();
  showFoodTable(dataFromDB);
  let { hrs, ap } = timeSetUP();
  let imgUrl;
  let foodType;
  let foodName;
  const dbData = dataFromDB.filter((item) => {
    if (hrs == item.timeToEat && ap == "AM" && item.foodType == "Breakfast") {
      foodType = item.foodType;
      foodName = item.foodName;
      imgUrl = "images/bg.jpg";
      return { foodType, foodName, imgUrl };
    } else if (
      hrs == item.timeToEat &&
      ap == "PM" &&
      item.foodType == "Lunch"
    ) {
      foodType = item.foodType;
      foodName = item.foodName;
      return { foodType, foodName };
    } else if (
      hrs == item.timeToEat &&
      ap == "PM" &&
      item.foodType == "Dinner"
    ) {
      foodType = item.foodType;
      foodName = item.foodName;
      return { foodType, foodName };
    }
  });

  htmlTemplate(dbData);
};

const htmlTemplate = (dbData) => {
  let imgUrl;
  let foodType;
  let foodName;
  if (dbData.length) {
    foodType = dbData[0].foodType;
    foodName = dbData[0].foodName;
    if (foodType === "Breakfast") {
      imgUrl = "images/bg.jpg";
    }
    if (foodType === "Lunch") {
      imgUrl = "images/wedding.jpg";
    }
    if (foodType === "Dinner") {
      imgUrl = "images/picture-136.png";
    }
  }

  const altForFoodType = "Coding";
  const altForFoodName = "nothing for now. I'm on my Laptop, coding";
  const baseImgUrl = "images/npmissue.png";

  const result = document.querySelector(".image-container");
  const div = document.createElement("div");
  div.innerHTML = `
       <h3>${foodType || altForFoodType} Time</h3>
       <p><b>I am eating ${foodName || altForFoodName}</b></p>
       <img src="${imgUrl || baseImgUrl}" alt="">
    `;
  return result.appendChild(div);
};

//Local storage
const addFoodTimeTableToStorage = (obj) => {
  const timeTableDB = getFoodTimeTablefromStorage();

  for (let i = 0; i < timeTableDB.length; i++) {
    if (timeTableDB[i].foodType === obj.foodType) {
      alert(`${obj.foodType} is already exists in DB`);
      return "hello";
    }
  }

  timeTableDB.push(obj);

  localStorage.setItem("foodObj", JSON.stringify(timeTableDB));
  alert(`${obj.foodType} successfully added`);
  location.reload();
  return false;
};

//Get Food time table from storage
const getFoodTimeTablefromStorage = () => {
  let foodObj;
  const LS = localStorage.getItem("foodObj");

  if (LS === null) {
    foodObj = [];
  } else {
    foodObj = JSON.parse(LS);
  }
  return foodObj;
};

//Clear Storage
document.querySelector("#clear-storage").addEventListener("click", () => {
  const clear = confirm("Are you sure you want to clear LocalStorage");
  if (clear == true) {
    localStorage.clear("foodObj");
    location.reload();
    return false;
  } else {
    return;
  }
});

const showFoodTable = (data) => {
  const messageBox = document.querySelector("#message");

  let htmlTemplate = "";

  data.forEach((item) => {
    htmlTemplate += `
     <tr>
          <td>${item.foodType}</td>
          <td>${item.foodName}</td>
          <td>${item.timeToEat}</td>
    </tr>`;
  });

  messageBox.innerHTML = htmlTemplate;
};

//Checking the time every hour
setInterval(() => {
  location.reload();
}, 1000 * 60 * 60);

timeToEat();
setInterval(getTime, 1000);

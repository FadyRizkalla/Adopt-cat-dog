function setTime() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = monthsOfYear[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const min = currentDate.getMinutes();
    const sec = currentDate.getSeconds();

    document.getElementById("date").innerHTML = `${dayOfWeek}, ${month} ${day}, ${year} 
    <br>${hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}

function validateForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernamePattern.test(username)) {
        errorMessage.textContent = "Invalid username. It must contain only letters and digits.";
        return false;
    }

    if (!passwordPattern.test(password)) {
        errorMessage.textContent = "Invalid password. It must be at least 4 characters long, contain at least one letter, and one digit.";
        return false;
    }

    return true;
}

function checkfind(event) {
    event.preventDefault();

    const breed = document.getElementById("breed");
    const age = document.getElementById("age");
    const along = document.getElementById("get-along");
    const res = document.getElementById("result");

    if (breed.value.trim() === "" || age.value.trim() === "" || along.value.trim() === "") {
        res.textContent = "Error: Some of the required fields are empty.";
        res.classList.add("error");
    } else {
        res.textContent = "";
        res.classList.remove("error");
    }
}
function setTime() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = monthsOfYear[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const min = currentDate.getMinutes();
    const sec = currentDate.getSeconds();

    document.getElementById("date").innerHTML = `${dayOfWeek}, ${month} ${day}, ${year} 
    <br>${hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
}

function checkGiveAway(event) {
    event.preventDefault();

    const animal = document.getElementById("animal");
    const breed = document.getElementById("breed");
    const age = document.getElementById("age");
    const ownerName = document.getElementById("owner-name");
    const ownerEmail = document.getElementById("owner-email");
    const result = document.getElementById("giveAwayResult");

    if (breed.value.trim() === "" || age.value.trim() === "" || ownerName.value.trim() === "" || ownerEmail.value.trim() === "") {
        result.textContent = "Error: All required fields must be filled.";
        result.classList.add("error");
    } else {
        result.textContent = "";
        result.classList.remove("error");
    }
}

// Set the interval for the clock
setInterval(setTime, 1000);

// Add event listener for form submission
document.querySelector("form").addEventListener("submit", checkGiveAway);


// Set the interval for the clock
setInterval(setTime, 1000);

// Add event listener for form submission
document.querySelector("form").addEventListener("submit", checkfind);

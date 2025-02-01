let courses = JSON.parse(localStorage.getItem("courses")) || {};

function saveCourses() {
    localStorage.setItem("courses", JSON.stringify(courses));
}

function addCourse() {
    let courseName = document.getElementById("courseName").value.trim();
    if (courseName === "" || courses[courseName]) {
        alert("Invalid or duplicate course name.");
        return;
    }
    courses[courseName] = {};
    saveCourses();
    updateCourseDropdown();
}

function removeCourse() {
    let course = document.getElementById("courseList").value;
    if (!course) return;
    delete courses[course];
    saveCourses();
    updateCourseDropdown();
}

function updateCourseDropdown() {
    let courseList = document.getElementById("courseList");
    courseList.innerHTML = "";
    for (let course in courses) {
        let option = document.createElement("option");
        option.text = course;
        courseList.add(option);
    }
    updateCategories();
}

function addCategory() {
    let course = document.getElementById("courseList").value;
    let categoryName = document.getElementById("categoryName").value.trim();
    let weight = parseFloat(document.getElementById("categoryWeight").value);
    let dropLowestN = parseInt(document.getElementById("dropLowestN").value);

    if (!course || !categoryName || isNaN(weight) || weight <= 0 || weight > 1 || isNaN(dropLowestN) || dropLowestN < 0) {
        alert("Invalid category input.");
        return;
    }

    courses[course][categoryName] = { weight, dropLowestN, assignments: [] };
    saveCourses();
    updateCategoryDropdown();
}

function removeCategory() {
    let course = document.getElementById("courseList").value;
    let category = document.getElementById("categoryList").value;
    if (!course || !category) return;
    delete courses[course][category];
    saveCourses();
    updateCategoryDropdown();
}

function updateCategories() {
    updateCategoryDropdown();
}

function updateCategoryDropdown() {
    let course = document.getElementById("courseList").value;
    let categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = "";
    if (!course || !courses[course]) return;

    for (let category in courses[course]) {
        let option = document.createElement("option");
        option.text = category;
        categoryList.add(option);
    }
}

function addAssignment() {
    let course = document.getElementById("courseList").value;
    let category = document.getElementById("categoryList").value;
    let assignmentName = document.getElementById("assignmentName").value.trim();
    let score = parseFloat(document.getElementById("assignmentScore").value);

    if (!course || !category || !assignmentName || isNaN(score)) {
        alert("Invalid assignment input.");
        return;
    }

    courses[course][category].assignments.push(score);
    saveCourses();
}

function removeAssignment() {
    let course = document.getElementById("courseList").value;
    let category = document.getElementById("categoryList").value;
    if (!course || !category || courses[course][category].assignments.length === 0) return;
    courses[course][category].assignments.pop();
    saveCourses();
}

function calculateFinalGrade() {
    let course = document.getElementById("courseList").value;
    if (!course) return;

    let totalGrade = 0;
    for (let category in courses[course]) {
        let { weight, dropLowestN, assignments } = courses[course][category];
        assignments.sort((a, b) => a - b);

        let validScores = assignments.slice(dropLowestN); // Drop lowest N
        let avgScore = validScores.length ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
        
        totalGrade += avgScore * weight;
    }

    document.getElementById("finalGrade").innerText = `Final grade: ${(totalGrade * 100).toFixed(2)}%`;
}

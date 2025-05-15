document.addEventListener("DOMContentLoaded", () => {
    const courseList = document.getElementById("course-list");
    const courseContainer = document.getElementById("course-buttons");
    const filterButtons = document.querySelectorAll(".filter-buttons button");
    const creditsSummary = document.getElementById("credits-summary");

    function displayBulletPoints(count) {
        courseList.innerHTML = "";
        for (let i = 0; i < count; i++) {
            const li = document.createElement("li");
            li.innerHTML = "&nbsp;";
            courseList.appendChild(li);
        }
    }

    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: [
                'Python'
            ],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
            technology: [
                'HTML',
                'CSS'
            ],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
            technology: [
                'Python'
            ],
            completed: true 
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
            technology: [
                'C#'
            ],
            completed: true
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
            technology: [
                'HTML',
                'CSS',
                'JavaScript'
            ],
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
            technology: [
                'HTML',
                'CSS',
                'JavaScript'
            ],
            completed: false
        }
    ];


    function updateCreditsSummary(courseList) {
        const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
        const completedCredits = courseList
            .filter(course => course.completed)
            .reduce((sum, course) => sum + course.credits, 0);

        if (creditsSummary) {
            creditsSummary.innerHTML = `
                <p><strong>Total Credits:</strong> ${totalCredits}</p>
                <p><strong>Completed Credits:</strong> ${completedCredits}</p>
            `;
        }
    }

    function renderCourses(courseList) {
        courseContainer.innerHTML = "";

        courseList.forEach(course => {
            const button = document.createElement("button");
            button.classList.add("course-button");
            if (course.completed) {
                button.classList.add("completed");
            }
            button.innerHTML = `${course.subject} ${course.number}${course.completed ? ' ✔️' : ''}`;
            courseContainer.appendChild(button);
        });

        updateCreditsSummary(courseList);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");
            const filteredCourses = (filter === "all") ? courses : courses.filter(course => course.subject === filter);
            renderCourses(filteredCourses);
        });
    });

    // Initial render
    renderCourses(courses);
    displayBulletPoints(3);
});

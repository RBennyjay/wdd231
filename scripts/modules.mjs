import { byuiCourse } from "./course.mjs";
import { enrollStudent, dropStudent } from "./sections.mjs";
import { setTitle, renderSections, setSectionSelection } from "./output.mjs";

document.querySelector("#enrollStudent").addEventListener("click", () => {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  enrollStudent(sectionNum);
});

document.querySelector("#dropStudent").addEventListener("click", () => {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  dropStudent(sectionNum);
});

// Initialize UI
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

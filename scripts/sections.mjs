import { byuiCourse } from "./course.mjs";
import { renderSections } from "./output.mjs";

export function enrollStudent(sectionNumber) {
  byuiCourse.changeEnrollment(sectionNumber, true);
  renderSections(byuiCourse.sections);
}

export function dropStudent(sectionNumber) {
  byuiCourse.changeEnrollment(sectionNumber, false);
  renderSections(byuiCourse.sections);
}

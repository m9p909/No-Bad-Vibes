export default (els) => (id, checked) => {
  const box = els.input({ type: "checkbox", id, checked });
  const label = els.label(
    { htmlFor: id, tabIndex: 0 },
    { "aria-checked": box.checked, role: "checkbox" }
  );
  label.appendChild(els.div());

  label.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  });

  label.addEventListener("keyup", (e) => {
    if (e.key === " ") {
      box.checked = !box.checked;
      box.dispatchEvent(new Event("change", { bubbles: true }));
      return false;
    }
  });
  box.addEventListener("change", () => {
    label.ariaChecked = box.checked;
  });

  return [box, label];
};

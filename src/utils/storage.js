const LS_KEY_FORM = "qrproject_form";
const LS_KEY_HISTORY = "qrproject_history";

export const loadForm = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(LS_KEY_FORM)) || {
        title: "",
        link: "",
        date: "",
        place: "",
        desc: "",
      }
    );
  } catch {
    return { title: "", link: "", date: "", place: "", desc: "" };
  }
};

export const saveForm = (form) => {
  localStorage.setItem(LS_KEY_FORM, JSON.stringify(form));
};

export const pushHistory = (form) => {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(LS_KEY_HISTORY)) || [];
  } catch {
    // intentionally ignore JSON parse errors
  }
  list.unshift({ ...form, ts: Date.now() });
  if (list.length > 6) list = list.slice(0, 6);
  localStorage.setItem(LS_KEY_HISTORY, JSON.stringify(list));
  return list;
};

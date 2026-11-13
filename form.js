function init() {
  const form = document.querySelector("form");
  const fields = [...form.querySelectorAll("#name, #email, #comments")];
  const comments = document.querySelector("#comments");
  const errorArea = document.querySelector("#error-area");
  const infoArea = document.querySelector("#info-area");
  form.querySelector('[name="possible_bot"]').value = "false";
  form.noValidate = true;
  const form_errors = [];
  errorArea.hidden = false;
  infoArea.hidden = false;

  const touched = new Set();
  let submitted = false;

  function validateField(field) {
    // Clear previous custom validation errors
    field.setCustomValidity("");

    const validity = field.validity;
    let message = "";

    if (validity.valueMissing) {
      message = `${field.name} is required.`;
    } else if (validity.typeMismatch) {
      message = "Enter a valid email address.";
    } else if (
      validity.tooShort ||
      (field.value.length > 0 && field.value.length < field.minLength)
    ) {
      message = `${field.name} must have at least ${field.minLength} characters.`;
    }

    field.setCustomValidity(message);
    field.setAttribute("aria-invalid", String(!!message));

    return message;
  }

  function updateErrors() {
    const errors = [];

    fields.forEach((field) => {
      if (submitted || touched.has(field)) {
        const message = validateField(field);

        if (message) {
          errors.push(message);
        }
      }
    });

    errorArea.replaceChildren();

    if (errors.length > 0) {
      const list = document.createElement("ul");

      errors.forEach((message) => {
        const item = document.createElement("li");
        item.textContent = message;
        list.appendChild(item);
      });

      errorArea.appendChild(list);
    }
  }

  function updateCharacterCount() {
    const remaining = comments.maxLength - comments.value.length;
    const needed = comments.minLength - comments.value.length;

    infoArea.classList.remove("warning");

    if (remaining === 0) {
      infoArea.textContent = "Character limit reached (0 remaining).";
      infoArea.classList.add("warning");
    } else if (remaining <= 100) {
      infoArea.textContent = `Warning: Only ${remaining} characters remaining.`;
      infoArea.classList.add("warning");
    } else {
      infoArea.textContent = `${remaining} characters remaining.`;

      if (needed > 0 && comments.value.length > 0) {
        infoArea.textContent += ` Enter ${needed} more characters to meet the minimum.`;
      }
    }
  }

  fields.forEach((field) => {
    let edited = false;

    field.addEventListener("input", () => {
      edited = true;

      if (submitted || touched.has(field)) {
        updateErrors();
      }

      if (field === comments) {
        updateCharacterCount();
      }
    });

    field.addEventListener("blur", () => {
      if (edited) {
        touched.add(field);
        updateErrors();
      }
    });
  });

  form.addEventListener("submit", (event) => {
    submitted = true;
    updateErrors();

    let hasErrors = false;

    fields.forEach((field) => {
      if (!field.validity.valid) {
        hasErrors = true;

        form_errors.push({
          field: field.name,
          error: field.validationMessage,
        });
      }
    });

    if (hasErrors) {
      event.preventDefault();
    } else {
      document.querySelector("#form-errors").value =
        JSON.stringify(form_errors);
    }
  });

  updateCharacterCount();
}

document.addEventListener("DOMContentLoaded", init);

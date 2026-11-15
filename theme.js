function initTheme() {
  const button = document.querySelector("#theme-toggle");

  // Default theme is dark
  let theme = "dark";

  // Restore saved preference
  try {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
    }
  } catch (error) {
    console.log("Could not read saved theme.");
  }

  // Sets the theme color and switches button text
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);

    if (button) {
      button.textContent =
        theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
  }

  // Apply saved theme when page loads
  applyTheme();

  if (button) {
    button.hidden = false;

    // Switch themes when clicked
    button.addEventListener("click", () => {
      if (theme === "dark") {
        theme = "light";
      } else {
        theme = "dark";
      }

      // Theme transition
      if (
        document.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        document.startViewTransition(() => {
          applyTheme();
        });
      } else {
        applyTheme();
      }

      try {
        localStorage.setItem("theme", theme);
      } catch (error) {
        console.log("Could not save theme.");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initTheme);

const themeSwitcher = document.getElementById("themeSwitcher");
const themeSwitcherButton = document.querySelector(".themeSwitcher");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Automatically set the theme based on user settings
document.documentElement.setAttribute("data-theme", prefersDarkScheme.matches ? "dark" : "light");
themeSwitcherButton.textContent = prefersDarkScheme.matches ? "Dark Mode" : "Light Mode";

// Add event listener for manual theme switching
themeSwitcher.addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeSwitcherButton.textContent = "Dark Mode";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeSwitcherButton.textContent = "Light Mode";
    }
});

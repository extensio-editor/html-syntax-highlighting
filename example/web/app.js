let syntaxHighlight = (a, b) => {};
import("https://www.unpkg.com/@extensio/html-syntax-highlighting@latest/dist/index.js").then(({default: a}) => {
    syntaxHighlight = a;
});

function highlight() {
    // Hide headers to make more space
    document.getElementById("headers").style.display = "none";

    // Get the code
    const code = document.getElementById("code").value;

    // Create the config
    const config = {
        language: "JS",
    }

    // Highlight the code
    // This is the module that is imported at the top of this file
    const highlighted = syntaxHighlight(code, config)

    // place the highlighted text in the container
    document.getElementById("highlightedContainer").innerHTML = highlighted;
}
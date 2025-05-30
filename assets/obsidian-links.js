document.addEventListener('DOMContentLoaded', function () {
    // Function to convert Obsidian-style links
    function convertObsidianLinks() {
        // Get all text nodes in the content area
        const content = document.querySelector('.book-article');
        if (!content) return;

        // Regular expressions for different types of links
        const docLinkRegex = /\[\[([^\]]+)\]\]/g;
        const sectionLinkRegex = /\[\[#([^\]]+)\]\]/g;

        // Function to process text nodes
        function processTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                let modified = false;

                const regex = /\[\[#\[(?<title>.+?)\]\((?<url>.+?)\)\|(?<display>.+?)\]\]/g;
                for (const match of text.matchAll(regex)) {
                    const { title, url, display } = match.groups;
                    console.log("Title:", title);
                    console.log("URL:", url);
                    console.log("Display:", display);
                    console.log("----");
                }
                // Replace section links
                text = text.replace(sectionLinkRegex, function (match, sectionName) {
                    modified = true;
                    const sectionId = sectionName.toLowerCase().replace(/\s+/g, '-');
                    const name = sectionId.split('|').at(-1);
                    const href = sectionId.split('|').at(0);
                    return `<a href="#${href}" class="obsidian-link">${name}</a>`;
                });

                // Replace document links
                text = text.replace(docLinkRegex, function (match, docName) {
                    modified = true;
                    const name = docName.split('|').at(-1);
                    const href = docName.split('|').at(0);
                    return `<a href="/${href.toLowerCase().replace(/\s+/g, '-')}" class="obsidian-link">${name}</a>`;
                });

                if (modified) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = text;
                    while (tempDiv.firstChild) {
                        node.parentNode.insertBefore(tempDiv.firstChild, node);
                    }
                    node.parentNode.removeChild(node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Skip processing for certain elements
                if (node.tagName === 'A' || node.tagName === 'CODE' || node.tagName === 'PRE') {
                    return;
                }
                // console.log(node.childNodes);
                // Process child nodes
                Array.from(node.childNodes).forEach(processTextNodes);
            }
        }

        // Process all text nodes in the content
        Array.from(content.childNodes).forEach(processTextNodes);
    }

    // Run the conversion
    convertObsidianLinks();
}); 
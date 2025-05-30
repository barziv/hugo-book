document.addEventListener('DOMContentLoaded', function () {
    // Function to convert Obsidian-style links
    function convertObsidianLinks() {
        // Get all text nodes in the content area
        const content = document.querySelector('.book-article');
        if (!content) return;

        // const hashtags = [...content.textContent.matchAll(/^#\w+/g)];

        const calloutTypes = {
            note: { class: "callout-note", label: "Note" },
            info: { class: "callout-info", label: "Info" },
            warning: { class: "callout-warning", label: "Warning" },
            tip: { class: "callout-tip", label: "Tip" },
            error: { class: "callout-error", label: "Error" },
        };

        document.querySelectorAll("p").forEach(p => {
            p.innerHTML = p.textContent.replace(/(?<=^|\s)#\S+/g, match => {
                console.log(match);
                return ` <span class="hashtag-label">${match}</span>`;
            })
        })

        document.querySelectorAll("blockquote").forEach(block => {
            const p = block.querySelector("p");
            if (!p) return;

            const match = p.textContent.trim().match(/^\[!(\w+)\](.*)/);
            if (!match) return;

            const [, typeRaw, content] = match;
            const type = typeRaw.toLowerCase();
            const config = calloutTypes[type];

            if (!config) return;

            const wrapper = document.createElement("div");
            wrapper.className = `callout ${config.class}`;

            const title = document.createElement("div");
            title.className = "callout-title";
            title.textContent = config.label;

            const body = document.createElement("div");
            body.innerHTML = p.innerHTML.replace(/^\[!\w+\]/, "").trim();

            wrapper.appendChild(title);
            wrapper.appendChild(body);

            block.replaceWith(wrapper);
        });

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
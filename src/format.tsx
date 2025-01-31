// Function to remove texts enclosed in square brackets (e.g., [doc1])
const removeBracketedContent = (content: string): string => {
    // Use a regular expression to match and remove text enclosed in square brackets
    return content.replace(/\[.*?\]/g, "").trim();
  };
  
  // Function to format explanation content, converting markdown-like structures into HTML
  export const formatExplanationContent = (content: string): string => {
    // Remove bracketed content before processing
    content = removeBracketedContent(content);
  
    // Split the content into lines by newline characters
    const lines = content.split("\n");
  
    // Map over each line to format it based on specific rules
    const formattedLines = lines
      .map((line) => {
        // Check if the line starts with '###' (used for headings)
        if (line.startsWith("###")) {
          line = line.replace("###", "").trim();
          return `<p style="font-size: 1.2em; font-weight: bold;">${line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
        }
  
        // Check if the line starts with '- ' (used for list items)
        if (line.startsWith("- ")) {
          const iconMatch = line.match(/^- ([\u{1F300}-\u{1FAFF}])/u);
          const icon = iconMatch ? iconMatch[1] : "";
          const text = line.replace(/^- [\u{1F300}-\u{1FAFF}]\s*/u, "");
          return `<li><span>${icon}</span> ${text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</li>`;
        }
  
        // For lines not matching above patterns, just replace bold markdown '**text**' with <strong>text</strong>
        return line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      })
      // Filter out empty or unnecessary lines
      .filter((line) => line.trim() !== "");
  
    // Join the formatted lines into an unordered list (<ul>) with line breaks between list items
    return `<ul>${formattedLines.join("</li><br><li>")}</ul>`;
  };
  
  // Function to add a new point (list item) to the existing content
  export const addPointToContent = (content: string, newPoint: string): string => {
    return `${content}\n- ${newPoint}`;
  };
  
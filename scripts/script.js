document.addEventListener('DOMContentLoaded', function() {

    // We no longer need the 'nodeDocs' object here!

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            // Nodes (td)
            { data: { id: 'pressure', label: 'Schedule pressure', color: '#555555' } },
            { data: { id: 'deadline', label: 'Deadline', color: '#555555' } },
            { data: { id: 'lacktechnology', label: 'Lack of knowledge about technology', color: '#555555' } },
            { data: { id: 'lackexperience', label: 'Lack of experience', color: '#555555' } },
            { data: { id: 'lackdesignprinciples', label: 'Lack of application of design principles', color: '#555555' } },
            { data: { id: 'lackrefactoring', label: 'Lack of awareness of design smells and refactoring', color: '#555555' } },
            { data: { id: 'oversight', label: 'Programmer Oversight', color: '#555555' } },
            { data: { id: 'postponement', label: 'Postponement of problem resolution', color: '#555555' } },

            // Nodes (dx)
            { data: { id: 'deployment', label: 'Ease of deploying changes to production', color: '#90ee90' } },
            { data: { id: 'codequality', label: 'Code Quality', color: '#90ee90' } },
            { data: { id: 'usability', label: 'Usability or Usefulness Support for Tools or Techniques or APIs', color: '#90ee90' } },
            // Edges
            { data: { source: 'deadline', target: 'deployment' } },
            { data: { source: 'pressure', target: 'deployment' } },
            { data: { source: 'oversight', target: 'codequality' } },
            { data: { source: 'postponement', target: 'codequality' } },
            { data: { source: 'lackdesignprinciples', target: 'codequality' } },
            { data: { source: 'lackrefactoring', target: 'codequality' } },
            { data: { source: 'lacktechnology', target: 'usability' } },
            { data: { source: 'lackexperience', target: 'usability' } }
        ],
        style: [
            // ... your style rules remain the same
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'text-valign': 'center',
                    'font-size': '10px',
                    'background-color': 'data(color)',
                    'color': '#fff',
                    'text-outline-color': 'data(color)',
                    'text-outline-width': 2
                }
            },
            {
                selector: 'node[color="#90ee90"]',
                style: { 'color': '#000', 'text-outline-color': '#fff' }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': '#ccc',
                    'curve-style': 'bezier'
                }
            }
        ],
        minZoom: 0.5,
        maxZoom: 2,
        layout: {
            name: 'cose',
            idealEdgeLength: 100,
            nodeRepulsion: 400000,
            padding: 30,
            fit: true
        },
    });

    const infoPanel = document.getElementById('info');

    // ---- THIS IS THE UPDATED PART ----
    // Show documentation when a node is clicked
    cy.on('tap', 'node', function(evt) {
        const nodeId = evt.target.id();
        const filePath = `docs/${nodeId}.md`; // Construct the file path

        // Use the fetch API to get the content of the markdown file
        fetch(filePath)
            .then(response => {
                if (!response.ok) { // Check if the file was found
                    throw new Error(`Could not find file: ${filePath}`);
                }
                return response.text(); // Get the content as a string
            })
            .then(markdownContent => {
                // Parse the markdown string into HTML and display it
                infoPanel.innerHTML = marked.parse(markdownContent);
                // Add the 'visible' class to make the panel slide in
                infoPanel.classList.add('visible'); 
            })
            .catch(error => {
                console.error('Error fetching documentation:', error);
                infoPanel.innerHTML = `<p>Could not load documentation for "${nodeId}".</p>`;
            });
    });

    // Clear documentation panel when clicking on the background
    cy.on('tap', function(evt) {
    if (evt.target === cy) {
        // Remove the 'visible' class to make the panel slide out
        infoPanel.classList.remove('visible');
        }
    });
});
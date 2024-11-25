const templates = {
    blank: {
        name: 'Blank Document',
        content: ''
    },
    resume: {
        name: 'Resume',
        content: `
            <h1>Your Name</h1>
            <p>Email: your.email@example.com | Phone: (123) 456-7890</p>
            <hr>
            <h2>Professional Summary</h2>
            <p>[Your professional summary here]</p>
            <h2>Experience</h2>
            <h3>Job Title - Company Name</h3>
            <p>Date - Date</p>
            <ul>
                <li>Achievement 1</li>
                <li>Achievement 2</li>
            </ul>
            <h2>Education</h2>
            <h3>Degree - Institution</h3>
            <p>Graduation Date</p>
            <h2>Skills</h2>
            <ul>
                <li>Skill 1</li>
                <li>Skill 2</li>
            </ul>
        `
    },
    letter: {
        name: 'Business Letter',
        content: `
            <p>[Your Name]</p>
            <p>[Your Address]</p>
            <p>[City, State ZIP]</p>
            <p>[Date]</p>
            <br>
            <p>[Recipient Name]</p>
            <p>[Company Name]</p>
            <p>[Address]</p>
            <p>[City, State ZIP]</p>
            <br>
            <p>Dear [Recipient Name],</p>
            <br>
            <p>[Letter content goes here]</p>
            <br>
            <p>Sincerely,</p>
            <br>
            <p>[Your Name]</p>
        `
    },
    report: {
        name: 'Report',
        content: `
            <h1>Report Title</h1>
            <p>Prepared by: [Your Name]</p>
            <p>Date: [Date]</p>
            <hr>
            <h2>Executive Summary</h2>
            <p>[Summary goes here]</p>
            <h2>Introduction</h2>
            <p>[Introduction goes here]</p>
            <h2>Findings</h2>
            <ul>
                <li>Finding 1</li>
                <li>Finding 2</li>
            </ul>
            <h2>Recommendations</h2>
            <ul>
                <li>Recommendation 1</li>
                <li>Recommendation 2</li>
            </ul>
            <h2>Conclusion</h2>
            <p>[Conclusion goes here]</p>
        `
    }
};
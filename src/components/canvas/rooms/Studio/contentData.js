/**
 * Technical Skills Content Data
 * 
 * This file contains data for the Technical Skills room (formerly Studio).
 */

export const EXPERIENCE_DATA = {
    title: 'Tester Intern',
    company: 'AndAI',
    period: 'November 2025 – February 2026',
    description: 'Contributed to live backend systems, supporting development and testing in production environments.',
    boldDescription: 'Worked extensively on backend development using FastAPI and MCP concepts, including building, testing, maintaining and integrating LLM-based services.',
    detailedDescription: 'Performed backend testing and prototyping, building dummy backends with Supabase, experimenting with vector databases, and creating automation workflows using n8n / Flow Enterprise, gaining a solid understanding of backend workflows and system integration.'
};

export const SKILLS_DATA = [
    {
        category: 'Languages',
        skills: [
            { name: 'Python', short: 'Python' },
            { name: 'Java', short: 'Java' },
            { name: 'C/C++', short: 'C/C++' },
            { name: 'JavaScript', short: 'JS' },
            { name: 'PHP', short: 'PHP' },
            { name: 'R', short: 'R' }
        ]
    },
    {
        category: 'Backend & APIs',
        skills: [
            { name: 'FastAPI', short: 'FastAPI' },
            { name: 'API Integration', short: 'API Int.' },
            { name: 'MCP', short: 'MCP' },
            { name: 'REST APIs', short: 'REST' }
        ]
    },
    {
        category: 'AI & LLMs',
        skills: [
            { name: 'Chatbots', short: 'Chatbots' },
            { name: 'AI Agents', short: 'AI Agents' },
            { name: 'RAG', short: 'RAG' },
            { name: 'Prompt Engineering', short: 'Prompt' },
            { name: 'LangChain', short: 'LangChain' },
            { name: 'Function Calling', short: 'FuncCall' }
        ]
    },
    {
        category: 'Databases & Tools',
        skills: [
            { name: 'SQL', short: 'SQL' },
            { name: 'Supabase', short: 'Supabase' },
            { name: 'PostgreSQL', short: 'Postgres' },
            { name: 'Vector Databases', short: 'VD' },
            { name: 'n8n', short: 'n8n' },
            { name: 'Docker', short: 'Docker' },
            { name: 'Postman', short: 'Postman' },
            { name: 'Git/GitHub', short: 'Git' }
        ]
    },
    {
        category: 'Cloud & Web',
        skills: [
            { name: 'AWS (Basics)', short: 'AWS' },
            { name: 'HTML', short: 'HTML' },
            { name: 'CSS', short: 'CSS' }
        ]
    },
    {
        category: 'Data & Workflow',
        skills: [
            { name: 'EDA', short: 'EDA' },
            { name: 'Feature Engineering', short: 'Feature' },
            { name: 'Workflow Automation', short: 'Automation' }
        ]
    },
    {
        category: 'Soft Skills',
        skills: [
            { name: 'Backend Problem-Solving', short: 'Problem solving' },
            { name: 'Analytical Thinking', short: 'Analytical' },
            { name: 'Adaptability in Fast-Paced Environments', short: 'adaptability' }
        ]
    }
];

export const getLatestContent = () => {
    return EXPERIENCE_DATA;
};

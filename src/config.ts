export const config = {
    developer: {
        name: "Abhishek",
        fullName: "Abhishek Rai",
        title: "Full-Stack Software Engineer",
        avatar: "https://github.com/Abhishekrai-1127.png",
        description: "Full-time Full-Stack Software Engineer specializing in React.js, Next.js, NestJS, React Native, and TypeScript. Ships production features for a platform with 65M+ monthly unique visitors and a mobile app with 10M+ downloads."
    },
    social: {
        github: "Abhishekrai-1127",
        email: "abhishekrai1878@gmail.com",
        location: "India"
    },
    about: {
        title: "About Me",
        description: "Full-time Full-Stack Software Engineer specializing in React.js, Next.js, NestJS, React Native, and TypeScript. I ship production features for a platform with 65M+ monthly unique visitors and a mobile app with 10M+ downloads. B.Tech in Computer Science and Engineering from Galgotias University (2026), focused on scalable backend architectures, Core Web Vitals, and high-performance web & mobile experiences."
    },
    experiences: [
        {
            position: "Software Engineer (Full-Time)",
            company: "Amar Ujala Webservices (AUW)",
            period: "Sept 2025 - Present",
            location: "India",
            description: "Led PHP-to-Next.js migration of key pages serving ~19M monthly visitors, lifting mobile Lighthouse performance from 33 to 65 (+32 points). Engineered features in React Native and Next.js for a 10M+ downloads app using JWT auth and Redis caching.",
            responsibilities: [
                "Led PHP-to-Next.js migration of key pages serving ~19M monthly visitors (+32 Lighthouse score)",
                "Engineered features in React Native and Next.js for an app with 10M+ downloads using JWT and Redis",
                "Designed reusable TypeScript components and REST API integrations backed by Jest & RTL tests",
                "Executed front-end modernization using SSR, lazy loading, and on-page SEO"
            ],
            technologies: ["Next.js", "React Native", "TypeScript", "Redis", "JWT", "Jest", "SSR"]
        },
        {
            position: "React Native Developer Intern",
            company: "Amar Ujala Webservices (AUW)",
            period: "Jun 2025 - Aug 2025",
            location: "India",
            description: "Developed reusable components and REST API integrations for mobile (React Native) and web (Next.js), optimizing rendering and runtime performance across both platforms.",
            responsibilities: [
                "Developed reusable components for mobile (React Native) and web (Next.js)",
                "Integrated backend APIs and optimized performance across platforms"
            ],
            technologies: ["React Native", "Next.js", "TypeScript", "REST APIs"]
        },
        {
            position: "Web Developer",
            company: "Koshish Family",
            period: "Oct 2023 - Oct 2025",
            location: "India",
            description: "Designed and developed 6+ responsive micro pages with React.js and CodeIgniter 4, cutting page load time by 30% and integrating CI4 backend APIs.",
            responsibilities: [
                "Designed and developed 6+ responsive micro pages with React.js and CodeIgniter 4",
                "Reduced page load time by 30% and integrated CodeIgniter 4 backend APIs"
            ],
            technologies: ["React.js", "CodeIgniter 4", "JavaScript", "REST APIs"]
        },
        {
            position: "B.Tech in Computer Science & Engineering",
            company: "Galgotias University",
            period: "2022 - 2026",
            location: "India",
            description: "Bachelor of Technology in Computer Science and Engineering with coursework and practice in Data Structures & Algorithms, Competitive Programming, and Full-Stack Software Engineering.",
            responsibilities: [
                "Data Structures & Algorithms and Competitive Programming",
                "Full-Stack Web & Mobile Application Development"
            ],
            technologies: ["Computer Science", "DSA", "Competitive Programming", "Software Engineering"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "SMS Panel (AdServices)",
            category: "Full-Stack / SaaS",
            technologies: "Next.js, Express.js, PostgreSQL, Redis, Docker",
            image: "/images/sms-panel.svg",
            description: "Engineered a high-throughput bulk SMS platform on Next.js, Express, PostgreSQL, Redis, and Docker, processing 50K+ messages/day with scheduling, templates, delivery reports, and a client API panel.",
            link: "https://github.com/Abhishekrai-1127"
        },
        {
            id: 2,
            title: "ERP System (Suraj Enterprises)",
            category: "Enterprise SaaS",
            technologies: "NestJS, PostgreSQL, TypeScript, Microservices, React",
            image: "/images/erp-system.svg",
            description: "Designed a multi-module SaaS ERP with modular NestJS services and PostgreSQL across 8 modules: sales, purchase, inventory, billing, accounting, CRM, HR/payroll, and reporting.",
            link: "https://github.com/Abhishekrai-1127"
        },
        {
            id: 3,
            title: "Inventory Management System",
            category: "Full-Stack Web",
            technologies: "Next.js, Node.js, Express, PostgreSQL, JWT Auth",
            image: "/images/inventory-system.svg",
            description: "Developed a stock-tracking backend with secure JWT-protected REST APIs and an interactive Next.js management dashboard.",
            link: "https://github.com/Abhishekrai-1127"
        },
        {
            id: 4,
            title: "Health Monitoring App",
            category: "Mobile & Web App",
            technologies: "React Native, React.js, Node.js, MongoDB",
            image: "/images/health-app.svg",
            description: "Engineered a cross-platform React Native and web application featuring real-time health tracking, secure user authentication, and MongoDB cloud storage.",
            link: "https://github.com/Abhishekrai-1127"
        }
    ],
    contact: {
        email: "abhishekrai1878@gmail.com",
        phone: "+91 9315958067",
        github: "https://github.com/Abhishekrai-1127",
        linkedin: "https://www.linkedin.com/in/abhishek-rai-337876264/",
        twitter: "",
        facebook: "",
        instagram: "",
        resume: "/Abhishek_Rai_CV.pdf"
    },
    skills: {
        develop: {
            title: "FRONTEND & MOBILE",
            description: "High-performance web & cross-platform mobile apps",
            details: "Building fast, accessible, and SEO-optimized applications with React.js, Next.js (SSR/SSG), and React Native. Focused on Core Web Vitals, Lighthouse optimization, and reusable TypeScript components tested with Jest and React Testing Library.",
            tools: ["React.js", "Next.js", "React Native", "TypeScript", "JavaScript (ES6+)", "Redux", "Tailwind CSS", "Bootstrap", "Jest & RTL", "Core Web Vitals / SEO"]
        },
        design: {
            title: "BACKEND & INFRA",
            description: "Scalable APIs, microservices & databases",
            details: "Architecting modular backend services and RESTful APIs using NestJS, Node.js, and Express.js. Experienced with PostgreSQL, MongoDB, Redis caching, JWT authentication, Docker, and Jenkins CI/CD pipelines.",
            tools: ["Node.js", "NestJS", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Docker", "Jenkins (CI/CD)", "Azure OpenAI API"]
        }
    }
};

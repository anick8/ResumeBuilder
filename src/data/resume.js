/**
 * Resume content, seeded from Aniketh_Keshava_Resume_2026_march.pdf.
 * This is the single source of truth for what renders in the template
 * and what gets tailored against a job description.
 */
export const resume = {
  name: "Aniketh A Keshava",
  title: "Software Engineer",
  contact: {
    address: "Bangalore, Karnataka 560092",
    phone: "900-894-4908",
    email: "anick8ak@gmail.com",
    www: "Bold Profile",
    linkedin: "https://www.linkedin.com/in/aniketh-ak",
  },
  // Skill chips used by the "modern" template.
  tags: [
    "Node.js",
    "React",
    "React Native",
    "Python",
    "Apache Cordova",
    "MongoDB",
    "MySQL",
    "Cassandra",
    "Angular",
    "Meta",
    "SEO optimization",
    "IOT",
    "PostgreSQL",
    "Payment Gateways",
    "Apple iOS",
    "Android",
    "Linux",
    "Git",
    "AWS Certified",
  ],
  // Spoken/programming languages with a 1–5 proficiency, used by the "modern" template.
  languages: [
    { name: "JavaScript", level: "Native", dots: 5 },
    { name: "Python", level: "Proficient", dots: 4 },
  ],
  skills: [
    { label: "Languages: JavaScript, Python, C++", level: 90 },
    { label: "Frontend: React, React Native, Angular, Vue", level: 90 },
    { label: "Backend: Node.js", level: 85 },
    { label: "Databases: PostgreSQL, MySQL, MongoDB, Cassandra", level: 75 },
    { label: "Mobile: React Native, Apache Cordova, Expo", level: 90 },
    {
      label:
        "Tools & Platforms: Linux, Git, Firebase, GA4, Google Search Console",
      level: 80,
    },
    {
      label: "Concepts: REST APIs, Microservices, SEO, Automation, IoT Systems",
      level: 80,
    },
  ],
  summary:
    "Software Engineer with 7+ years of experience building web, backend, and cross-platform mobile applications. Skilled in Node.js, React, React Native, and Python, with experience in microservices, hybrid mobile development, IoT, and automation. Led mobile development at StoreHippo and developed the mobile apps for major brands including Amul, Syngenta, and Dow.",
  workHistory: [
    {
      role: "Software Developer",
      company: "Storehippo, Gurgaon (Remote)",
      dates: "2022-05 - Current",
      location: "Gurgaon (Remote)",
      description:
        "A company focused on e-commerce solutions, creating robust applications for its clients",
      bullets: [
        "Led end-to-end development of a **React Native**–based automated mobile app generator, supporting multiple client apps.",
        "Migrated legacy **Apache Cordova** apps to **React Native**, improving performance and maintainability.",
        "Integrated e-commerce features and third-party services across **React Native, Angular, and Vue** applications.",
        "Implemented analytics and event tracking using **GA4, Facebook Pixel, Firebase**, ensuring accurate reporting.",
        "Improved SEO via sitemap management, structured data, Google Search Console, and optimized Google Merchant feeds.",
        "Built and maintained **Node.js** backend services for push notifications (Firebase, APNs, Expo), Google login, and payment gateways.",
        "Managed **Android and iOS release cycles**, version upgrades, and production deployments.",
        "Mentored a junior developer and delegated tasks during migration efforts.",
      ],
    },
    {
      role: "Backend Developer",
      company: "Hashx, Bengaluru",
      dates: "2021-08 - 2022-01",
      location: "Bengaluru",
      description:
        "A tech company specializing in blockchain solutions and consulting",
      bullets: [
        "Developed **RESTful APIs** using **Node.js, Express, and PostgreSQL** in a distributed system.",
        "Contributed to **microservices architecture design** and entity modeling.",
        "Optimized PostgreSQL queries to improve performance and reliability.",
      ],
    },
    {
      role: "Systems Engineer",
      company: "Intellicar Telematics, Bangalore",
      dates: "2018-07 - 2021-07",
      location: "Bangalore",
      description:
        "A company providing IoT solutions for the automotive industry",
      bullets: [
        "Reverse-engineered vehicle ECU data across multiple automobile manufacturers.",
        "Configured and tested **IoT telematics devices**, optimizing data frequency and accuracy.",
        "Automated debugging and data validation using **Python scripts**.",
        "Monitored system performance and ensured telemetry data quality.",
      ],
    },
  ],
  education: [
    {
      degree: "B. E: Computer Science",
      school: "Reva Institute Of Technology And Management - Bangalore",
      dates: "2014-07 - 2018-07",
    },
  ],
  accomplishments: [
    "Attended Rajasthan hackathon, which was one of the largest hackathons in India where we presented my project IRIS.",
    "Bagged the consolation prize at AWS deep learning Hackathon held in IIT Madras, where we built an IOT glove that helps the blind differentiate between Indian currency notes using deep learning.",
    "Bagged the first place and an Internship via interview at Intellicar Telematics at the Makeathon held by Atria Institute of Technology, for presenting the idea of Green income, a home automation system coupled with an interactive system that helps the user reduce their carbon footprint.",
    "Completed a 6 month Internship at Intellicar Telematics.",
  ],
  references: [
    {
      name: "Shunmuga Krishnan - CTO",
      company: "Intellicar Telematics, Bangalore",
      contact: "+91-9731188998, shunmugakrishnan@intellicar.in",
    },
    {
      name: "Rajarshi Prattipati - Co-Founder",
      company: "Hashx, Somadisha Consultants and Solutions Pvt. Ltd, Bangalore",
      contact: "+91-8861183024, rishiprattipati@gmail.com",
    },
    {
      name: "Rajiv Kumar Aggarwal - Co-Founder & CEO",
      company: "StoreHippo & Mystore, Gurgaon",
      contact: "+91-8800503232, rajiv@hippoinnovations.com",
    },
  ],
};

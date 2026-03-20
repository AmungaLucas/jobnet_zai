export const organizationType = [
    { value: "PRIVATE", label: "Private Sector Companies" },
    { value: "SMALL_BUSINESS", label: "Small & Medium Businesses (SMEs)" },
    { value: "STARTUP", label: "Startups & Emerging Companies" },
    { value: "NGO", label: "Non-Governmental Organizations (NGOs)" },
    { value: "INTERNATIONAL_ORG", label: "International Organizations & UN Agencies" },
    { value: "NATIONAL_GOV", label: "National Government" },
    { value: "COUNTY_GOV", label: "County Governments" },
    { value: "STATE_CORPORATION", label: "State Corporations & Parastatals" },
    { value: "EDUCATION", label: "Universities & Academic Institutions" },
    { value: "FOUNDATION", label: "Foundations & Philanthropic Organizations" },
    { value: "RELIGIOUS_ORG", label: "Religious Organizations" }
];

export const organizationIndustry = [
    { value: "AGRICULTURE", label: "Agriculture, Forestry & Fishing" },
    { value: "AUTOMOTIVE", label: "Automotive & Vehicle Manufacturing" },
    { value: "AVIATION", label: "Aviation & Aerospace" },
    { value: "BANKING", label: "Banking & Financial Services" },
    { value: "CONSTRUCTION", label: "Construction & Civil Engineering" },
    { value: "CONSULTING", label: "Consulting & Professional Services" },
    { value: "CONSUMER_GOODS", label: "Consumer Goods & Manufacturing" },
    { value: "EDUCATION", label: "Education & Training" },
    { value: "ENERGY", label: "Energy, Power & Utilities" },
    { value: "ENVIRONMENT", label: "Environment & Sustainability" },
    { value: "FINTECH", label: "Financial Technology (FinTech)" },
    { value: "FOOD_BEVERAGE", label: "Food & Beverage Production" },
    { value: "GOVERNMENT_PUBLIC_ADMIN", label: "Government & Public Administration" },
    { value: "HEALTHCARE", label: "Healthcare & Medical Services" },
    { value: "HOSPITALITY_TOURISM", label: "Hospitality, Travel & Tourism" },
    { value: "HUMAN_RESOURCES", label: "Human Resources & Recruitment" },
    { value: "INFORMATION_TECHNOLOGY", label: "Information Technology & Software" },
    { value: "INSURANCE", label: "Insurance" },
    { value: "INTERNATIONAL_DEVELOPMENT", label: "International Development & Humanitarian Aid" },
    { value: "LEGAL", label: "Legal Services" },
    { value: "LOGISTICS_SUPPLY_CHAIN", label: "Logistics, Transport & Supply Chain" },
    { value: "MANUFACTURING", label: "Manufacturing & Industrial Production" },
    { value: "MARKETING_ADVERTISING", label: "Marketing, Advertising & Media" },
    { value: "MEDIA_ENTERTAINMENT", label: "Media, Entertainment & Broadcasting" },
    { value: "MINING", label: "Mining & Natural Resources" },
    { value: "NON_PROFIT", label: "Non-Profit & Social Impact" },
    { value: "PHARMACEUTICAL", label: "Pharmaceuticals & Biotechnology" },
    { value: "REAL_ESTATE", label: "Real Estate & Property Management" },
    { value: "RESEARCH", label: "Research & Scientific Institutions" },
    { value: "RETAIL", label: "Retail & E-Commerce" },
    { value: "SECURITY_DEFENSE", label: "Security & Defense" },
    { value: "SPORTS", label: "Sports & Recreation" },
    { value: "TELECOMMUNICATIONS", label: "Telecommunications" },
    { value: "TEXTILES_APPAREL", label: "Textiles, Apparel & Fashion" },
    { value: "WATER_SANITATION", label: "Water, Sanitation & Waste Management" }
];

export const organizationLocation = [
    {
        name: "Kenya",
        code: "KE",
        dialCode: "254",
        flag: "🇰🇪",
        regions: [
            // Former Central Province (5)
            "Kiambu", "Kirinyaga", "Murang'a", "Nyandarua", "Nyeri",

            // Former Coast Province (6)
            "Kilifi", "Kwale", "Lamu", "Mombasa", "Taita Taveta", "Tana River",

            // Former Eastern Province (8)
            "Embu", "Isiolo", "Kitui", "Machakos", "Makueni", "Marsabit", "Meru", "Tharaka Nithi",

            // Former Nairobi Province (1)
            "Nairobi",

            // Former North Eastern Province (3)
            "Garissa", "Mandera", "Wajir",

            // Former Nyanza Province (6)
            "Homa Bay", "Kisii", "Kisumu", "Migori", "Nyamira", "Siaya",

            // Former Rift Valley Province (14)
            "Baringo", "Bomet", "Elgeyo Marakwet", "Kajiado", "Kericho", "Laikipia",
            "Nakuru", "Nandi", "Narok", "Samburu", "Trans Nzoia", "Turkana",
            "Uasin Gishu", "West Pokot",

            // Former Western Province (4)
            "Bungoma", "Busia", "Kakamega", "Vihiga"
        ]
    },
    {
        name: "Uganda",
        code: "UG",
        dialCode: "256",
        flag: "🇺🇬",
        regions: [
            "Kampala", "Entebbe", "Jinja", "Mbale", "Gulu",
            "Mbarara", "Masaka", "Fort Portal", "Arua", "Lira"
        ]
    },
    {
        name: "Tanzania",
        code: "TZ",
        dialCode: "255",
        flag: "🇹🇿",
        regions: [
            "Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar City",
            "Mbeya", "Morogoro", "Tanga", "Kigoma", "Mtwara"
        ]
    },
    {
        name: "Rwanda",
        code: "RW",
        dialCode: "250",
        flag: "🇷🇼",
        regions: [
            "Kigali", "Butare", "Gisenyi", "Ruhengeri", "Cyangugu",
            "Byumba", "Kibuye", "Gitarama"
        ]
    },
    {
        name: "Ethiopia",
        code: "ET",
        dialCode: "251",
        flag: "🇪🇹",
        regions: [
            "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar",
            "Hawassa", "Jimma", "Adama", "Harar"
        ]
    },
    {
        name: "Nigeria",
        code: "NG",
        dialCode: "234",
        flag: "🇳🇬",
        regions: [
            "Lagos", "Abuja", "Kano", "Ibadan", "Kaduna",
            "Port Harcourt", "Benin City", "Maiduguri", "Zaria", "Jos"
        ]
    },
    {
        name: "South Africa",
        code: "ZA",
        dialCode: "27",
        flag: "🇿🇦",
        regions: [
            "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth",
            "Bloemfontein", "East London", "Pietermaritzburg", "Kimberley", "Nelspruit"
        ]
    },
    {
        name: "Ghana",
        code: "GH",
        dialCode: "233",
        flag: "🇬🇭",
        regions: [
            "Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Cape Coast",
            "Tema", "Sunyani", "Wa", "Bolgatanga"
        ]
    },
    {
        name: "United States",
        code: "US",
        dialCode: "1",
        flag: "🇺🇸",
        regions: [
            "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
            "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
        ]
    },
    {
        name: "United Kingdom",
        code: "GB",
        dialCode: "44",
        flag: "🇬🇧",
        regions: [
            "London", "Manchester", "Birmingham", "Leeds", "Glasgow",
            "Liverpool", "Newcastle", "Sheffield", "Bristol", "Edinburgh"
        ]
    },
    {
        name: "Canada",
        code: "CA",
        dialCode: "1",
        flag: "🇨🇦",
        regions: [
            "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton",
            "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Halifax"
        ]
    }
];

export const jobCategory = [
    {
        value: "TECHNOLOGY",
        label: "Technology & IT",
        subcategories: [
            { value: "SOFTWARE_ENGINEERING", label: "Software Engineering" },
            { value: "WEB_DEVELOPMENT", label: "Web Development" },
            { value: "MOBILE_DEVELOPMENT", label: "Mobile Development" },
            { value: "DATA_SCIENCE", label: "Data Science & Analytics" },
            { value: "CYBER_SECURITY", label: "Cybersecurity" },
            { value: "DEVOPS_CLOUD", label: "DevOps & Cloud Infrastructure" },
            { value: "IT_SUPPORT", label: "IT Support & Helpdesk" },
            { value: "NETWORK_ADMIN", label: "Network Administration" },
            { value: "QA_TESTING", label: "Quality Assurance & Testing" },
            { value: "DATABASE_ADMIN", label: "Database Administration" },
            { value: "SYSTEMS_ARCHITECTURE", label: "Systems Architecture" },
            { value: "AI_MACHINE_LEARNING", label: "AI & Machine Learning" },
            { value: "BLOCKCHAIN", label: "Blockchain Development" },
            { value: "GAME_DEVELOPMENT", label: "Game Development" },
            { value: "EMBEDDED_SYSTEMS", label: "Embedded Systems" },
            { value: "TECH_PROJECT_MANAGEMENT", label: "Technical Project Management" },
            { value: "IT_AUDIT", label: "IT Audit" },
            { value: "TECH_SUPPORT_ENGINEER", label: "Technical Support Engineering" }
        ]
    },

    {
        value: "FINANCE_ACCOUNTING",
        label: "Finance & Accounting",
        subcategories: [
            { value: "ACCOUNTING", label: "Accounting" },
            { value: "FINANCIAL_ANALYSIS", label: "Financial Analysis" },
            { value: "AUDIT", label: "Audit" },
            { value: "TAX", label: "Taxation" },
            { value: "TREASURY", label: "Treasury Management" },
            { value: "RISK_COMPLIANCE", label: "Risk & Compliance" },
            { value: "INVESTMENT_BANKING", label: "Investment Banking" },
            { value: "WEALTH_MANAGEMENT", label: "Wealth Management" },
            { value: "FINANCIAL_PLANNING", label: "Financial Planning" },
            { value: "PAYROLL", label: "Payroll Management" },
            { value: "CORPORATE_FINANCE", label: "Corporate Finance" },
            { value: "HEDGE_FUNDS", label: "Hedge Funds" },
            { value: "PRIVATE_EQUITY", label: "Private Equity" },
            { value: "VENTURE_CAPITAL", label: "Venture Capital" },
            { value: "FINANCIAL_REPORTING", label: "Financial Reporting" },
            { value: "CREDIT_ANALYSIS", label: "Credit Analysis" },
            { value: "MERCHANT_BANKING", label: "Merchant Banking" }
        ]
    },

    {
        value: "SALES_BUSINESS",
        label: "Sales & Business Development",
        subcategories: [
            { value: "BUSINESS_DEVELOPMENT", label: "Business Development" },
            { value: "ACCOUNT_MANAGEMENT", label: "Account Management" },
            { value: "SALES_REPRESENTATIVE", label: "Sales Representative" },
            { value: "CHANNEL_SALES", label: "Channel Sales" },
            { value: "CUSTOMER_SUCCESS", label: "Customer Success" },
            { value: "CORPORATE_SALES", label: "Corporate Sales" },
            { value: "RETAIL_SALES", label: "Retail Sales" },
            { value: "SALES_OPERATIONS", label: "Sales Operations" },
            { value: "SALES_TRAINING", label: "Sales Training" },
            { value: "KEY_ACCOUNT_MANAGEMENT", label: "Key Account Management" },
            { value: "TECHNICAL_SALES", label: "Technical Sales" },
            { value: "SALES_ENGINEERING", label: "Sales Engineering" },
            { value: "INSIDE_SALES", label: "Inside Sales" },
            { value: "FIELD_SALES", label: "Field Sales" },
            { value: "B2B_SALES", label: "B2B Sales" },
            { value: "B2C_SALES", label: "B2C Sales" },
            { value: "SALES_MANAGEMENT", label: "Sales Management" },
            { value: "SALES_ENABLEMENT", label: "Sales Enablement" }
        ]
    },

    {
        value: "MARKETING_COMMUNICATIONS",
        label: "Marketing & Communications",
        subcategories: [
            { value: "DIGITAL_MARKETING", label: "Digital Marketing" },
            { value: "CONTENT_MARKETING", label: "Content Marketing" },
            { value: "BRAND_MANAGEMENT", label: "Brand Management" },
            { value: "PUBLIC_RELATIONS", label: "Public Relations" },
            { value: "SOCIAL_MEDIA", label: "Social Media Management" },
            { value: "SEO_SEM", label: "SEO & Search Marketing" },
            { value: "MARKET_RESEARCH", label: "Market Research" },
            { value: "PRODUCT_MARKETING", label: "Product Marketing" },
            { value: "EVENT_MARKETING", label: "Event Marketing" },
            { value: "AFFILIATE_MARKETING", label: "Affiliate Marketing" },
            { value: "MARKETING_AUTOMATION", label: "Marketing Automation" },
            { value: "COPYWRITING", label: "Copywriting" },
            { value: "INFLUENCER_MARKETING", label: "Influencer Marketing" },
            { value: "EMAIL_MARKETING", label: "Email Marketing" },
            { value: "VIDEO_MARKETING", label: "Video Marketing" },
            { value: "GUERRILLA_MARKETING", label: "Guerrilla Marketing" },
            { value: "GROWTH_MARKETING", label: "Growth Marketing" },
            { value: "PERFORMANCE_MARKETING", label: "Performance Marketing" }
        ]
    },

    {
        value: "HUMAN_RESOURCES",
        label: "Human Resources",
        subcategories: [
            { value: "RECRUITMENT", label: "Recruitment & Talent Acquisition" },
            { value: "HR_GENERALIST", label: "HR Generalist" },
            { value: "PAYROLL", label: "Payroll & Compensation" },
            { value: "LEARNING_DEVELOPMENT", label: "Learning & Development" },
            { value: "HR_ANALYTICS", label: "HR Analytics" },
            { value: "EMPLOYEE_RELATIONS", label: "Employee Relations" },
            { value: "HR_OPERATIONS", label: "HR Operations" },
            { value: "TALENT_MANAGEMENT", label: "Talent Management" },
            { value: "ORGANIZATIONAL_DEVELOPMENT", label: "Organizational Development" },
            { value: "HRIS", label: "HR Information Systems" },
            { value: "COMPENSATION_BENEFITS", label: "Compensation & Benefits" },
            { value: "DIVERSITY_INCLUSION", label: "Diversity & Inclusion" },
            { value: "EMPLOYER_BRANDING", label: "Employer Branding" },
            { value: "HR_CONSULTING", label: "HR Consulting" },
            { value: "LABOR_RELATIONS", label: "Labor Relations" },
            { value: "HR_COMPLIANCE", label: "HR Compliance" },
            { value: "WORKPLACE_SAFETY", label: "Workplace Safety" }
        ]
    },

    {
        value: "ENGINEERING",
        label: "Engineering",
        subcategories: [
            { value: "CIVIL_ENGINEERING", label: "Civil Engineering" },
            { value: "MECHANICAL_ENGINEERING", label: "Mechanical Engineering" },
            { value: "ELECTRICAL_ENGINEERING", label: "Electrical Engineering" },
            { value: "INDUSTRIAL_ENGINEERING", label: "Industrial Engineering" },
            { value: "PROJECT_ENGINEERING", label: "Project Engineering" },
            { value: "CHEMICAL_ENGINEERING", label: "Chemical Engineering" },
            { value: "AEROSPACE_ENGINEERING", label: "Aerospace Engineering" },
            { value: "BIOMEDICAL_ENGINEERING", label: "Biomedical Engineering" },
            { value: "ENVIRONMENTAL_ENGINEERING", label: "Environmental Engineering" },
            { value: "MATERIALS_ENGINEERING", label: "Materials Engineering" },
            { value: "STRUCTURAL_ENGINEERING", label: "Structural Engineering" },
            { value: "GEOTECHNICAL_ENGINEERING", label: "Geotechnical Engineering" },
            { value: "PETROLEUM_ENGINEERING", label: "Petroleum Engineering" },
            { value: "MARINE_ENGINEERING", label: "Marine Engineering" },
            { value: "AUTOMOTIVE_ENGINEERING", label: "Automotive Engineering" },
            { value: "NUCLEAR_ENGINEERING", label: "Nuclear Engineering" },
            { value: "MECHATRONICS", label: "Mechatronics" }
        ]
    },

    {
        value: "HEALTHCARE",
        label: "Healthcare & Medical",
        subcategories: [
            { value: "NURSING", label: "Nursing" },
            { value: "PHARMACY", label: "Pharmacy" },
            { value: "MEDICAL_DOCTOR", label: "Medical Doctor" },
            { value: "LAB_TECHNOLOGY", label: "Laboratory Technology" },
            { value: "PUBLIC_HEALTH", label: "Public Health" },
            { value: "HEALTH_ADMIN", label: "Healthcare Administration" },
            { value: "PHYSIOTHERAPY", label: "Physiotherapy" },
            { value: "OCCUPATIONAL_THERAPY", label: "Occupational Therapy" },
            { value: "RADIOLOGY", label: "Radiology & Imaging" },
            { value: "MEDICAL_RESEARCH", label: "Medical Research" },
            { value: "HEALTH_INFORMATICS", label: "Health Informatics" },
            { value: "CARDIOLOGY", label: "Cardiology" },
            { value: "NEUROLOGY", label: "Neurology" },
            { value: "PEDIATRICS", label: "Pediatrics" },
            { value: "ONCOLOGY", label: "Oncology" },
            { value: "EMERGENCY_MEDICINE", label: "Emergency Medicine" },
            { value: "ANESTHESIOLOGY", label: "Anesthesiology" },
            { value: "PSYCHIATRY", label: "Psychiatry" }
        ]
    },

    {
        value: "EDUCATION",
        label: "Education & Training",
        subcategories: [
            { value: "TEACHING", label: "Teaching" },
            { value: "LECTURING", label: "Lecturing" },
            { value: "EDUCATION_ADMIN", label: "Education Administration" },
            { value: "CURRICULUM_DEVELOPMENT", label: "Curriculum Development" },
            { value: "TRAINING", label: "Training & Facilitation" },
            { value: "E_LEARNING", label: "E-Learning & Instructional Design" },
            { value: "SPECIAL_EDUCATION", label: "Special Education" },
            { value: "EDUCATIONAL_TECHNOLOGY", label: "Educational Technology" },
            { value: "STUDENT_COUNSELING", label: "Student Counseling" },
            { value: "ACADEMIC_RESEARCH", label: "Academic Research" },
            { value: "EARLY_CHILDHOOD", label: "Early Childhood Education" },
            { value: "PRIMARY_EDUCATION", label: "Primary Education" },
            { value: "SECONDARY_EDUCATION", label: "Secondary Education" },
            { value: "HIGHER_EDUCATION", label: "Higher Education" },
            { value: "VOCATIONAL_TRAINING", label: "Vocational Training" },
            { value: "LANGUAGE_TEACHING", label: "Language Teaching" },
            { value: "EDUCATIONAL_PSYCHOLOGY", label: "Educational Psychology" }
        ]
    },

    {
        value: "OPERATIONS_ADMIN",
        label: "Operations & Administration",
        subcategories: [
            { value: "OFFICE_ADMIN", label: "Office Administration" },
            { value: "OPERATIONS_MANAGEMENT", label: "Operations Management" },
            { value: "PROJECT_MANAGEMENT", label: "Project Management" },
            { value: "EXECUTIVE_ASSISTANT", label: "Executive Assistant" },
            { value: "PROGRAM_MANAGEMENT", label: "Program Management" },
            { value: "BUSINESS_OPERATIONS", label: "Business Operations" },
            { value: "FACILITIES_MANAGEMENT", label: "Facilities Management" },
            { value: "ADMINISTRATIVE_SUPPORT", label: "Administrative Support" },
            { value: "DATA_ENTRY", label: "Data Entry" },
            { value: "PROCESS_IMPROVEMENT", label: "Process Improvement" },
            { value: "OFFICE_MANAGER", label: "Office Manager" },
            { value: "ADMINISTRATIVE_COORDINATOR", label: "Administrative Coordinator" },
            { value: "RECEPTIONIST", label: "Receptionist" },
            { value: "PROJECT_COORDINATION", label: "Project Coordination" },
            { value: "BUSINESS_SUPPORT", label: "Business Support" },
            { value: "ADMINISTRATIVE_MANAGEMENT", label: "Administrative Management" }
        ]
    },

    {
        value: "SUPPLY_CHAIN",
        label: "Logistics & Supply Chain",
        subcategories: [
            { value: "PROCUREMENT", label: "Procurement" },
            { value: "WAREHOUSING", label: "Warehousing" },
            { value: "DISTRIBUTION", label: "Distribution & Logistics" },
            { value: "INVENTORY_MANAGEMENT", label: "Inventory Management" },
            { value: "TRANSPORT_COORDINATION", label: "Transport Coordination" },
            { value: "SUPPLY_CHAIN_PLANNING", label: "Supply Chain Planning" },
            { value: "FREIGHT_FORWARDING", label: "Freight Forwarding" },
            { value: "CUSTOMS_BROKERAGE", label: "Customs Brokerage" },
            { value: "DEMAND_PLANNING", label: "Demand Planning" },
            { value: "LOGISTICS_ANALYTICS", label: "Logistics Analytics" },
            { value: "FLEET_MANAGEMENT", label: "Fleet Management" },
            { value: "RETURN_LOGISTICS", label: "Return Logistics" },
            { value: "WAREHOUSE_OPERATIONS", label: "Warehouse Operations" },
            { value: "MATERIALS_MANAGEMENT", label: "Materials Management" },
            { value: "GLOBAL_LOGISTICS", label: "Global Logistics" },
            { value: "SHIPPING_RECEIVING", label: "Shipping & Receiving" }
        ]
    },

    {
        value: "HOSPITALITY",
        label: "Hospitality & Tourism",
        subcategories: [
            { value: "HOTEL_MANAGEMENT", label: "Hotel Management" },
            { value: "CHEF_COOKING", label: "Chef & Culinary" },
            { value: "TOURISM_OPERATIONS", label: "Tourism Operations" },
            { value: "FRONT_OFFICE", label: "Front Office" },
            { value: "HOUSEKEEPING", label: "Housekeeping" },
            { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
            { value: "EVENT_PLANNING", label: "Event Planning" },
            { value: "TRAVEL_AGENCY", label: "Travel Agency" },
            { value: "CASINO_GAMING", label: "Casino & Gaming" },
            { value: "RESORT_MANAGEMENT", label: "Resort Management" },
            { value: "CONCIERGE", label: "Concierge Services" },
            { value: "BARTENDING", label: "Bartending" },
            { value: "RESTAURANT_MANAGEMENT", label: "Restaurant Management" },
            { value: "CATERING", label: "Catering" },
            { value: "SPA_MANAGEMENT", label: "Spa Management" },
            { value: "CRUISE_SHIP_STAFF", label: "Cruise Ship Staff" }
        ]
    },

    {
        value: "SPECIALISED_SERVICES",
        label: "Specialised Services",
        subcategories: [
            { value: "PROJECT_MANAGEMENT", label: "Project Management" },
            { value: "OPERATIONS_MANAGER", label: "Operations Manager" },
            { value: "TECHNICAL_PROJECT_MANAGER", label: "Technical Project Manager" },
            { value: "TRANSLATION_INTERPRETATION", label: "Translation & Interpretation" },
        ]
    },

    {
        value: "AGRICULTURE",
        label: "Agriculture & Agribusiness",
        subcategories: [
            { value: "AGRONOMY", label: "Agronomy" },
            { value: "FARM_MANAGEMENT", label: "Farm Management" },
            { value: "AGRICULTURAL_EXTENSION", label: "Agricultural Extension" },
            { value: "LIVESTOCK_MANAGEMENT", label: "Livestock Management" },
            { value: "CROP_SCIENCE", label: "Crop Science" },
            { value: "AGRICULTURAL_ENGINEERING", label: "Agricultural Engineering" },
            { value: "FOOD_SCIENCE", label: "Food Science" },
            { value: "AGRIBUSINESS", label: "Agribusiness" },
            { value: "HORTICULTURE", label: "Horticulture" },
            { value: "SUSTAINABLE_AGRICULTURE", label: "Sustainable Agriculture" },
            { value: "PRECISION_AGRICULTURE", label: "Precision Agriculture" },
            { value: "AGRICULTURAL_ECONOMICS", label: "Agricultural Economics" },
            { value: "PEST_MANAGEMENT", label: "Pest Management" },
            { value: "SOIL_SCIENCE", label: "Soil Science" },
            { value: "FORESTRY", label: "Forestry" }
        ]
    },

    {
        value: "LEGAL",
        label: "Legal & Compliance",
        subcategories: [
            { value: "CORPORATE_LAW", label: "Corporate Law" },
            { value: "LEGAL_ADVISORY", label: "Legal Advisory" },
            { value: "CONTRACT_MANAGEMENT", label: "Contract Management" },
            { value: "COMPLIANCE_OFFICER", label: "Compliance" },
            { value: "PARALEGAL", label: "Paralegal Services" },
            { value: "INTELLECTUAL_PROPERTY", label: "Intellectual Property" },
            { value: "LITIGATION", label: "Litigation" },
            { value: "LABOR_LAW", label: "Labor Law" },
            { value: "TAX_LAW", label: "Tax Law" },
            { value: "REAL_ESTATE_LAW", label: "Real Estate Law" },
            { value: "REGULATORY_AFFAIRS", label: "Regulatory Affairs" },
            { value: "INTERNATIONAL_LAW", label: "International Law" },
            { value: "ENVIRONMENTAL_LAW", label: "Environmental Law" },
            { value: "HEALTHCARE_LAW", label: "Healthcare Law" },
            { value: "CRIMINAL_LAW", label: "Criminal Law" },
            { value: "FAMILY_LAW", label: "Family Law" },
            { value: "LEGAL_RESEARCH", label: "Legal Research" }
        ]
    },

    {
        value: "CREATIVE_DESIGN",
        label: "Creative Arts & Design",
        subcategories: [
            { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
            { value: "UX_UI_DESIGN", label: "UX/UI Design" },
            { value: "MULTIMEDIA_DESIGN", label: "Multimedia Design" },
            { value: "PHOTOGRAPHY", label: "Photography" },
            { value: "VIDEO_EDITING", label: "Video Editing & Production" },
            { value: "ANIMATION", label: "Animation" },
            { value: "ART_DIRECTION", label: "Art Direction" },
            { value: "ILLUSTRATION", label: "Illustration" },
            { value: "INTERIOR_DESIGN", label: "Interior Design" },
            { value: "FASHION_DESIGN", label: "Fashion Design" },
            { value: "PRODUCT_DESIGN", label: "Product Design" },
            { value: "MOTION_GRAPHICS", label: "Motion Graphics" },
            { value: "3D_MODELING", label: "3D Modeling" },
            { value: "VISUAL_ARTS", label: "Visual Arts" },
            { value: "INDUSTRIAL_DESIGN", label: "Industrial Design" },
            { value: "JEWELRY_DESIGN", label: "Jewelry Design" },
            { value: "TEXTILE_DESIGN", label: "Textile Design" },
            { value: "CERAMIC_DESIGN", label: "Ceramic Design" }
        ]
    },

    {
        value: "ARCHITECTURE_CONSTRUCTION",
        label: "Architecture & Construction",
        subcategories: [
            { value: "ARCHITECTURE", label: "Architecture" },
            { value: "CONSTRUCTION_MANAGEMENT", label: "Construction Management" },
            { value: "QUANTITY_SURVEYING", label: "Quantity Surveying" },
            { value: "SITE_SUPERVISION", label: "Site Supervision" },
            { value: "URBAN_PLANNING", label: "Urban Planning" },
            { value: "LANDSCAPE_ARCHITECTURE", label: "Landscape Architecture" },
            { value: "BUILDING_SURVEYING", label: "Building Surveying" },
            { value: "CONSTRUCTION_SAFETY", label: "Construction Safety" },
            { value: "ESTIMATING", label: "Estimating" },
            { value: "PROJECT_COORDINATION", label: "Project Coordination" },
            { value: "INTERIOR_ARCHITECTURE", label: "Interior Architecture" },
            { value: "STRUCTURAL_ENGINEERING_CONSTRUCTION", label: "Structural Engineering" },
            { value: "CONSTRUCTION_EQUIPMENT", label: "Construction Equipment Operation" },
            { value: "BUILDING_INSPECTION", label: "Building Inspection" },
            { value: "GREEN_BUILDING", label: "Green Building" },
            { value: "CONSTRUCTION_ESTIMATING", label: "Construction Estimating" }
        ]
    },

    {
        value: "SCIENCE_RESEARCH",
        label: "Science & Research",
        subcategories: [
            { value: "LAB_RESEARCH", label: "Laboratory Research" },
            { value: "CHEMISTRY", label: "Chemistry" },
            { value: "BIOLOGY", label: "Biology" },
            { value: "ENVIRONMENTAL_SCIENCE", label: "Environmental Science" },
            { value: "PHYSICS", label: "Physics" },
            { value: "R_AND_D", label: "Research & Development" },
            { value: "BIOTECHNOLOGY", label: "Biotechnology" },
            { value: "CLINICAL_RESEARCH", label: "Clinical Research" },
            { value: "GEOLOGY", label: "Geology" },
            { value: "FORENSIC_SCIENCE", label: "Forensic Science" },
            { value: "MARINE_BIOLOGY", label: "Marine Biology" },
            { value: "ASTRONOMY", label: "Astronomy" },
            { value: "NEUROSCIENCE", label: "Neuroscience" },
            { value: "GENETICS", label: "Genetics" },
            { value: "MICROBIOLOGY", label: "Microbiology" },
            { value: "BIOCHEMISTRY", label: "Biochemistry" }
        ]
    },

    {
        value: "CUSTOMER_SERVICE",
        label: "Customer Service",
        subcategories: [
            { value: "CALL_CENTER", label: "Call Center" },
            { value: "CUSTOMER_SUPPORT", label: "Customer Support" },
            { value: "CLIENT_RELATIONS", label: "Client Relations" },
            { value: "HELPDESK", label: "Helpdesk" },
            { value: "CUSTOMER_EXPERIENCE", label: "Customer Experience" },
            { value: "TECHNICAL_SUPPORT", label: "Technical Support" },
            { value: "CHAT_SUPPORT", label: "Chat Support" },
            { value: "CUSTOMER_SERVICE_MANAGEMENT", label: "Customer Service Management" },
            { value: "COMPLAINT_RESOLUTION", label: "Complaint Resolution" },
            { value: "OMNICHANNEL_SUPPORT", label: "Omnichannel Support" },
            { value: "CUSTOMER_SUCCESS_SPECIALIST", label: "Customer Success Specialist" },
            { value: "SERVICE_DELIVERY", label: "Service Delivery" },
            { value: "CUSTOMER_SUPPORT_ENGINEER", label: "Customer Support Engineer" },
            { value: "CALL_CENTER_MANAGER", label: "Call Center Manager" },
            { value: "CLIENT_SERVICES", label: "Client Services" },
            { value: "CUSTOMER_CARE", label: "Customer Care" }
        ]
    },

    {
        value: "SKILLED_TRADES",
        label: "Skilled Trades & Manual Work",
        subcategories: [
            { value: "ELECTRICIAN", label: "Electrical Installation" },
            { value: "PLUMBING", label: "Plumbing" },
            { value: "WELDING", label: "Welding & Fabrication" },
            { value: "CARPENTRY", label: "Carpentry" },
            { value: "MAINTENANCE", label: "Maintenance & Repair" },
            { value: "MACHINERY_OPERATION", label: "Machinery Operation" },
            { value: "HVAC", label: "HVAC Installation & Repair" },
            { value: "PAINTING", label: "Painting & Finishing" },
            { value: "MASONRY", label: "Masonry" },
            { value: "AUTO_MECHANIC", label: "Automotive Mechanics" },
            { value: "TOOL_MAKING", label: "Tool Making" },
            { value: "CABINET_MAKING", label: "Cabinet Making" },
            { value: "FLOORING", label: "Flooring Installation" },
            { value: "ROOFING", label: "Roofing" },
            { value: "GLAZING", label: "Glazing" },
            { value: "LOCKSMITH", label: "Locksmith" },
            { value: "BOILERMAKER", label: "Boilermaking" }
        ]
    },

    {
        value: "MEDIA_PUBLISHING",
        label: "Media & Publishing",
        subcategories: [
            { value: "JOURNALISM", label: "Journalism" },
            { value: "EDITING", label: "Editing & Proofreading" },
            { value: "PUBLISHING", label: "Publishing" },
            { value: "BROADCASTING", label: "Broadcasting" },
            { value: "CONTENT_CREATION", label: "Content Creation" },
            { value: "COPYWRITING", label: "Copywriting" },
            { value: "TECHNICAL_WRITING", label: "Technical Writing" },
            { value: "RADIO_PRODUCTION", label: "Radio Production" },
            { value: "TV_PRODUCTION", label: "Television Production" },
            { value: "DIGITAL_PUBLISHING", label: "Digital Publishing" },
            { value: "NEWS_REPORTING", label: "News Reporting" },
            { value: "MAGAZINE_PUBLISHING", label: "Magazine Publishing" },
            { value: "BOOK_PUBLISHING", label: "Book Publishing" },
            { value: "COPY_EDITING", label: "Copy Editing" },
            { value: "PROOFREADING", label: "Proofreading" },
            { value: "ACQUISITIONS_EDITOR", label: "Acquisitions Editor" }
        ]
    },

    {
        value: "NONPROFIT",
        label: "Nonprofit & Social Services",
        subcategories: [
            { value: "SOCIAL_WORK", label: "Social Work" },
            { value: "COMMUNITY_OUTREACH", label: "Community Outreach" },
            { value: "FUNDRAISING", label: "Fundraising" },
            { value: "GRANT_WRITING", label: "Grant Writing" },
            { value: "VOLUNTEER_COORDINATION", label: "Volunteer Coordination" },
            { value: "NGO_MANAGEMENT", label: "NGO Management" },
            { value: "PROGRAM_DEVELOPMENT", label: "Program Development" },
            { value: "ADVOCACY", label: "Advocacy" },
            { value: "HUMANITARIAN_AID", label: "Humanitarian Aid" },
            { value: "COUNSELING", label: "Counseling" },
            { value: "CASE_MANAGEMENT", label: "Case Management" },
            { value: "COMMUNITY_ORGANIZING", label: "Community Organizing" },
            { value: "PHILANTHROPY", label: "Philanthropy" },
            { value: "FOUNDATION_MANAGEMENT", label: "Foundation Management" },
            { value: "SOCIAL_ENTERPRISE", label: "Social Enterprise" },
            { value: "DISASTER_RELIEF", label: "Disaster Relief" }
        ]
    },

    {
        value: "REAL_ESTATE",
        label: "Real Estate",
        subcategories: [
            { value: "PROPERTY_MANAGEMENT", label: "Property Management" },
            { value: "REAL_ESTATE_AGENT", label: "Real Estate Agent" },
            { value: "REAL_ESTATE_DEVELOPMENT", label: "Real Estate Development" },
            { value: "FACILITIES_MANAGEMENT", label: "Facilities Management" },
            { value: "VALUATION", label: "Valuation & Appraisal" },
            { value: "COMMERCIAL_REAL_ESTATE", label: "Commercial Real Estate" },
            { value: "RESIDENTIAL_REAL_ESTATE", label: "Residential Real Estate" },
            { value: "REAL_ESTATE_INVESTMENT", label: "Real Estate Investment" },
            { value: "PROPERTY_ACQUISITION", label: "Property Acquisition" },
            { value: "LEASING", label: "Leasing" },
            { value: "REAL_ESTATE_BROKER", label: "Real Estate Broker" },
            { value: "ASSET_MANAGEMENT_REAL_ESTATE", label: "Asset Management" },
            { value: "REAL_ESTATE_MARKETING", label: "Real Estate Marketing" },
            { value: "PROPERTY_SALES", label: "Property Sales" },
            { value: "REAL_ESTATE_CONSULTING", label: "Real Estate Consulting" },
            { value: "TITLE_SEARCH", label: "Title Search" }
        ]
    },

    {
        value: "FITNESS_WELLNESS",
        label: "Fitness & Wellness",
        subcategories: [
            { value: "PERSONAL_TRAINING", label: "Personal Training" },
            { value: "GYM_MANAGEMENT", label: "Gym Management" },
            { value: "NUTRITION", label: "Nutrition & Dietetics" },
            { value: "YOGA_INSTRUCTION", label: "Yoga Instruction" },
            { value: "WELLNESS_COACHING", label: "Wellness Coaching" },
            { value: "GROUP_FITNESS", label: "Group Fitness Instruction" },
            { value: "SPORTS_COACHING", label: "Sports Coaching" },
            { value: "PHYSICAL_THERAPY", label: "Physical Therapy" },
            { value: "MASSAGE_THERAPY", label: "Massage Therapy" },
            { value: "SPORTS_MEDICINE", label: "Sports Medicine" },
            { value: "PILATES_INSTRUCTION", label: "Pilates Instruction" },
            { value: "CROSSFIT_TRAINING", label: "CrossFit Training" },
            { value: "WELLNESS_PROGRAMMING", label: "Wellness Programming" },
            { value: "HEALTH_COACHING", label: "Health Coaching" },
            { value: "FITNESS_CONSULTING", label: "Fitness Consulting" }
        ]
    },

    {
        value: "GOVERNMENT_PUBLIC_SECTOR",
        label: "Government & Public Sector",
        subcategories: [
            { value: "PUBLIC_ADMINISTRATION", label: "Public Administration" },
            { value: "POLICY_ANALYSIS", label: "Policy Analysis" },
            { value: "GOVERNMENT_RELATIONS", label: "Government Relations" },
            { value: "PUBLIC_AFFAIRS", label: "Public Affairs" },
            { value: "DIPLOMACY", label: "Diplomacy" },
            { value: "PUBLIC_POLICY", label: "Public Policy" },
            { value: "CIVIL_SERVICE", label: "Civil Service" },
            { value: "URBAN_DEVELOPMENT", label: "Urban Development" },
            { value: "PUBLIC_SAFETY", label: "Public Safety" },
            { value: "EMERGENCY_MANAGEMENT", label: "Emergency Management" },
            { value: "FOREIGN_SERVICE", label: "Foreign Service" },
            { value: "LEGISLATIVE_AFFAIRS", label: "Legislative Affairs" },
            { value: "PUBLIC_FINANCE", label: "Public Finance" },
            { value: "GOVERNMENT_PROGRAMS", label: "Government Programs" },
            { value: "REGULATORY_ENFORCEMENT", label: "Regulatory Enforcement" }
        ]
    },

    {
        value: "CONSULTING",
        label: "Consulting",
        subcategories: [
            { value: "MANAGEMENT_CONSULTING", label: "Management Consulting" },
            { value: "STRATEGY_CONSULTING", label: "Strategy Consulting" },
            { value: "IT_CONSULTING", label: "IT Consulting" },
            { value: "HR_CONSULTING", label: "HR Consulting" },
            { value: "FINANCIAL_CONSULTING", label: "Financial Consulting" },
            { value: "OPERATIONS_CONSULTING", label: "Operations Consulting" },
            { value: "BUSINESS_ANALYSIS", label: "Business Analysis" },
            { value: "ORGANIZATIONAL_CONSULTING", label: "Organizational Consulting" },
            { value: "SUSTAINABILITY_CONSULTING", label: "Sustainability Consulting" },
            { value: "RISK_CONSULTING", label: "Risk Consulting" },
            { value: "MARKETING_CONSULTING", label: "Marketing Consulting" },
            { value: "SALES_CONSULTING", label: "Sales Consulting" },
            { value: "SUPPLY_CHAIN_CONSULTING", label: "Supply Chain Consulting" },
            { value: "TECHNOLOGY_CONSULTING", label: "Technology Consulting" },
            { value: "STRATEGIC_PLANNING", label: "Strategic Planning" },
            { value: "BUSINESS_TRANSFORMATION", label: "Business Transformation" }
        ]
    },

    {
        value: "INSURANCE",
        label: "Insurance",
        subcategories: [
            { value: "UNDERWRITING", label: "Underwriting" },
            { value: "CLAIMS_ADJUSTMENT", label: "Claims Adjustment" },
            { value: "INSURANCE_SALES", label: "Insurance Sales" },
            { value: "RISK_ASSESSMENT", label: "Risk Assessment" },
            { value: "INSURANCE_BROKER", label: "Insurance Broker" },
            { value: "ACTUARIAL_SCIENCE", label: "Actuarial Science" },
            { value: "POLICY_ADMINISTRATION", label: "Policy Administration" },
            { value: "LOSS_CONTROL", label: "Loss Control" },
            { value: "REINSURANCE", label: "Reinsurance" },
            { value: "INSURANCE_ANALYTICS", label: "Insurance Analytics" },
            { value: "LIFE_INSURANCE", label: "Life Insurance" },
            { value: "HEALTH_INSURANCE", label: "Health Insurance" },
            { value: "PROPERTY_INSURANCE", label: "Property Insurance" },
            { value: "CASUALTY_INSURANCE", label: "Casualty Insurance" },
            { value: "INSURANCE_UNDERWRITING", label: "Insurance Underwriting" }
        ]
    },

    {
        value: "TRANSPORTATION",
        label: "Transportation",
        subcategories: [
            { value: "TRUCK_DRIVING", label: "Truck Driving" },
            { value: "FLEET_MANAGEMENT", label: "Fleet Management" },
            { value: "DISPATCHING", label: "Dispatching" },
            { value: "PILOT", label: "Pilot" },
            { value: "MARITIME", label: "Maritime" },
            { value: "RAILROAD", label: "Railroad Operations" },
            { value: "DELIVERY_SERVICES", label: "Delivery Services" },
            { value: "TRANSPORTATION_PLANNING", label: "Transportation Planning" },
            { value: "ROUTE_OPTIMIZATION", label: "Route Optimization" },
            { value: "LOGISTICS_COORDINATION", label: "Logistics Coordination" },
            { value: "AIR_TRAFFIC_CONTROL", label: "Air Traffic Control" },
            { value: "SHIPPING_COORDINATION", label: "Shipping Coordination" },
            { value: "PUBLIC_TRANSPORTATION", label: "Public Transportation" },
            { value: "FREIGHT_BROKER", label: "Freight Broker" },
            { value: "TRANSPORTATION_SAFETY", label: "Transportation Safety" }
        ]
    },

    {
        value: "SECURITY_SERVICES",
        label: "Security Services",
        subcategories: [
            { value: "PHYSICAL_SECURITY", label: "Physical Security" },
            { value: "SURVEILLANCE", label: "Surveillance" },
            { value: "LOSS_PREVENTION", label: "Loss Prevention" },
            { value: "EXECUTIVE_PROTECTION", label: "Executive Protection" },
            { value: "SECURITY_MANAGEMENT", label: "Security Management" },
            { value: "ACCESS_CONTROL", label: "Access Control" },
            { value: "EMERGENCY_RESPONSE", label: "Emergency Response" },
            { value: "SECURITY_SYSTEMS", label: "Security Systems" },
            { value: "INVESTIGATIONS", label: "Investigations" },
            { value: "CYBER_PHYSICAL", label: "Cyber-Physical Security" },
            { value: "ARMORED_TRANSPORT", label: "Armored Transport" },
            { value: "K9_UNITS", label: "K9 Units" },
            { value: "EVENT_SECURITY", label: "Event Security" },
            { value: "CORPORATE_SECURITY", label: "Corporate Security" },
            { value: "RESIDENTIAL_SECURITY", label: "Residential Security" }
        ]
    },

    {
        value: "ENVIRONMENTAL_SUSTAINABILITY",
        label: "Environmental & Sustainability",
        subcategories: [
            { value: "ENVIRONMENTAL_MANAGEMENT", label: "Environmental Management" },
            { value: "SUSTAINABILITY", label: "Sustainability" },
            { value: "ENVIRONMENTAL_COMPLIANCE", label: "Environmental Compliance" },
            { value: "RENEWABLE_ENERGY", label: "Renewable Energy" },
            { value: "WASTE_MANAGEMENT", label: "Waste Management" },
            { value: "CONSERVATION", label: "Conservation" },
            { value: "ENVIRONMENTAL_IMPACT", label: "Environmental Impact Assessment" },
            { value: "CARBON_MANAGEMENT", label: "Carbon Management" },
            { value: "WATER_RESOURCES", label: "Water Resources" },
            { value: "CLIMATE_CHANGE", label: "Climate Change" },
            { value: "ENVIRONMENTAL_EDUCATION", label: "Environmental Education" },
            { value: "GREEN_TECHNOLOGY", label: "Green Technology" },
            { value: "SUSTAINABLE_DESIGN", label: "Sustainable Design" },
            { value: "ENVIRONMENTAL_POLICY", label: "Environmental Policy" },
            { value: "ECOLOGY", label: "Ecology" }
        ]
    },

    {
        value: "INTERNATIONAL_DEVELOPMENT",
        label: "International Development",
        subcategories: [
            { value: "DEVELOPMENT_PROGRAMS", label: "Development Programs" },
            { value: "HUMANITARIAN_AID", label: "Humanitarian Aid" },
            { value: "PROJECT_MANAGEMENT_DEV", label: "Project Management" },
            { value: "MONITORING_EVALUATION", label: "Monitoring & Evaluation" },
            { value: "COMMUNITY_DEVELOPMENT", label: "Community Development" },
            { value: "ECONOMIC_DEVELOPMENT", label: "Economic Development" },
            { value: "GLOBAL_HEALTH", label: "Global Health" },
            { value: "FOOD_SECURITY", label: "Food Security" },
            { value: "GENDER_EQUALITY", label: "Gender Equality" },
            { value: "CAPACITY_BUILDING", label: "Capacity Building" },
            { value: "DISASTER_RISK_REDUCTION", label: "Disaster Risk Reduction" },
            { value: "WATER_SANITATION", label: "Water & Sanitation" },
            { value: "LIVELIHOODS", label: "Livelihoods" },
            { value: "REFUGEE_SUPPORT", label: "Refugee Support" },
            { value: "MICROFINANCE", label: "Microfinance" }
        ]
    },

    {
        value: "ENTERTAINMENT",
        label: "Entertainment",
        subcategories: [
            { value: "EVENTS_MANAGEMENT", label: "Events Management" },
            { value: "MUSIC_PRODUCTION", label: "Music Production" },
            { value: "FILM_PRODUCTION", label: "Film Production" },
            { value: "THEATRE", label: "Theatre" },
            { value: "TALENT_MANAGEMENT", label: "Talent Management" },
            { value: "CONCERT_PROMOTION", label: "Concert Promotion" },
            { value: "VENUE_MANAGEMENT", label: "Venue Management" },
            { value: "STAGE_PRODUCTION", label: "Stage Production" },
            { value: "PERFORMING_ARTS", label: "Performing Arts" },
            { value: "ENTERTAINMENT_LAW", label: "Entertainment Law" },
            { value: "CASTING", label: "Casting" },
            { value: "SOUND_ENGINEERING", label: "Sound Engineering" },
            { value: "LIGHTING_DESIGN", label: "Lighting Design" },
            { value: "CHOREOGRAPHY", label: "Choreography" },
            { value: "CIRCUS_ARTS", label: "Circus Arts" }
        ]
    },

    {
        value: "VETERINARY",
        label: "Veterinary",
        subcategories: [
            { value: "VETERINARY_MEDICINE", label: "Veterinary Medicine" },
            { value: "VETERINARY_SURGERY", label: "Veterinary Surgery" },
            { value: "ANIMAL_CARE", label: "Animal Care" },
            { value: "VETERINARY_TECHNICIAN", label: "Veterinary Technician" },
            { value: "VETERINARY_RESEARCH", label: "Veterinary Research" },
            { value: "ZOOLOGY", label: "Zoology" },
            { value: "WILDLIFE_CARE", label: "Wildlife Care" },
            { value: "VETERINARY_PUBLIC_HEALTH", label: "Veterinary Public Health" },
            { value: "ANIMAL_NUTRITION", label: "Animal Nutrition" },
            { value: "VETERINARY_PHARMACOLOGY", label: "Veterinary Pharmacology" },
            { value: "EQUINE_MEDICINE", label: "Equine Medicine" },
            { value: "EXOTIC_ANIMAL_CARE", label: "Exotic Animal Care" },
            { value: "VETERINARY_DENTISTRY", label: "Veterinary Dentistry" },
            { value: "ANIMAL_BEHAVIOR", label: "Animal Behavior" }
        ]
    },

    {
        value: "DENTAL",
        label: "Dental Healthcare",
        subcategories: [
            { value: "DENTISTRY", label: "Dentistry" },
            { value: "DENTAL_HYGIENE", label: "Dental Hygiene" },
            { value: "DENTAL_ASSISTING", label: "Dental Assisting" },
            { value: "ORTHODONTICS", label: "Orthodontics" },
            { value: "ORAL_SURGERY", label: "Oral Surgery" },
            { value: "PEDIATRIC_DENTISTRY", label: "Pediatric Dentistry" },
            { value: "PERIODONTICS", label: "Periodontics" },
            { value: "ENDODONTICS", label: "Endodontics" },
            { value: "DENTAL_LABORATORY", label: "Dental Laboratory" },
            { value: "DENTAL_RESEARCH", label: "Dental Research" },
            { value: "PROSTHODONTICS", label: "Prosthodontics" },
            { value: "DENTAL_RADIOLOGY", label: "Dental Radiology" },
            { value: "ORAL_PATHOLOGY", label: "Oral Pathology" },
            { value: "DENTAL_PUBLIC_HEALTH", label: "Dental Public Health" }
        ]
    },

    {
        value: "SPORTS_RECREATION",
        label: "Sports & Recreation",
        subcategories: [
            { value: "SPORTS_COACHING", label: "Sports Coaching" },
            { value: "ATHLETIC_TRAINING", label: "Athletic Training" },
            { value: "SPORTS_MANAGEMENT", label: "Sports Management" },
            { value: "RECREATION_MANAGEMENT", label: "Recreation Management" },
            { value: "SPORTS_MEDICINE", label: "Sports Medicine" },
            { value: "SPORTS_PSYCHOLOGY", label: "Sports Psychology" },
            { value: "SPORTS_BROADCASTING", label: "Sports Broadcasting" },
            { value: "SPORTS_JOURNALISM", label: "Sports Journalism" },
            { value: "PROFESSIONAL_ATHLETE", label: "Professional Athlete" },
            { value: "REFEREE_OFFICIATING", label: "Referee & Officiating" },
            { value: "OUTDOOR_RECREATION", label: "Outdoor Recreation" },
            { value: "CAMP_MANAGEMENT", label: "Camp Management" },
            { value: "SPORTS_FACILITY_MANAGEMENT", label: "Sports Facility Management" }
        ]
    },

    {
        value: "TELECOMMUNICATIONS",
        label: "Telecommunications",
        subcategories: [
            { value: "NETWORK_ENGINEERING_TELECOM", label: "Network Engineering" },
            { value: "TELECOM_SALES", label: "Telecom Sales" },
            { value: "WIRELESS_COMMUNICATIONS", label: "Wireless Communications" },
            { value: "FIBER_OPTICS", label: "Fiber Optics" },
            { value: "SATELLITE_COMMUNICATIONS", label: "Satellite Communications" },
            { value: "VOIP_ENGINEERING", label: "VoIP Engineering" },
            { value: "TELECOM_INFRASTRUCTURE", label: "Telecom Infrastructure" },
            { value: "BROADBAND_TECHNOLOGY", label: "Broadband Technology" },
            { value: "TELECOM_REGULATORY", label: "Telecom Regulatory Affairs" },
            { value: "5G_TECHNOLOGY", label: "5G Technology" },
            { value: "TELECOM_PROJECT_MANAGEMENT", label: "Telecom Project Management" },
            { value: "RADIO_FREQUENCY_ENGINEERING", label: "Radio Frequency Engineering" }
        ]
    },

    {
        value: "ENERGY_UTILITIES",
        label: "Energy & Utilities",
        subcategories: [
            { value: "POWER_GENERATION", label: "Power Generation" },
            { value: "RENEWABLE_ENERGY_UTILITIES", label: "Renewable Energy" },
            { value: "NUCLEAR_ENERGY", label: "Nuclear Energy" },
            { value: "OIL_GAS", label: "Oil & Gas" },
            { value: "UTILITY_MANAGEMENT", label: "Utility Management" },
            { value: "ENERGY_TRADING", label: "Energy Trading" },
            { value: "POWER_DISTRIBUTION", label: "Power Distribution" },
            { value: "ELECTRIC_GRID", label: "Electric Grid Management" },
            { value: "WATER_UTILITIES", label: "Water Utilities" },
            { value: "ENERGY_EFFICIENCY", label: "Energy Efficiency" },
            { value: "SMART_GRID", label: "Smart Grid Technology" },
            { value: "ENVIRONMENTAL_COMPLIANCE_ENERGY", label: "Environmental Compliance" }
        ]
    },

    {
        value: "MINING_RESOURCES",
        label: "Mining & Natural Resources",
        subcategories: [
            { value: "MINING_ENGINEERING", label: "Mining Engineering" },
            { value: "GEOLOGY_MINING", label: "Geology" },
            { value: "MINE_OPERATIONS", label: "Mine Operations" },
            { value: "MINERAL_PROCESSING", label: "Mineral Processing" },
            { value: "EXPLORATION_GEOLOGY", label: "Exploration Geology" },
            { value: "MINE_SAFETY", label: "Mine Safety" },
            { value: "QUARRY_MANAGEMENT", label: "Quarry Management" },
            { value: "METALLURGY", label: "Metallurgy" },
            { value: "RESOURCE_ESTIMATION", label: "Resource Estimation" },
            { value: "ENVIRONMENTAL_RECLAMATION", label: "Environmental Reclamation" },
            { value: "MINING_EQUIPMENT", label: "Mining Equipment Operation" }
        ]
    },

    {
        value: "MANUFACTURING",
        label: "Manufacturing & Production",
        subcategories: [
            { value: "PRODUCTION_MANAGEMENT", label: "Production Management" },
            { value: "QUALITY_CONTROL", label: "Quality Control" },
            { value: "PROCESS_ENGINEERING", label: "Process Engineering" },
            { value: "ASSEMBLY_LINE", label: "Assembly Line Work" },
            { value: "PLANT_MANAGEMENT", label: "Plant Management" },
            { value: "LEAN_MANUFACTURING", label: "Lean Manufacturing" },
            { value: "SIX_SIGMA", label: "Six Sigma" },
            { value: "INDUSTRIAL_AUTOMATION", label: "Industrial Automation" },
            { value: "PRODUCT_ASSEMBLY", label: "Product Assembly" },
            { value: "MACHINE_OPERATION", label: "Machine Operation" },
            { value: "PRINTING_PRODUCTION", label: "Printing Production" },
            { value: "PACKAGING", label: "Packaging" }
        ]
    },

    {
        value: "RETAIL",
        label: "Retail & Consumer Goods",
        subcategories: [
            { value: "RETAIL_MANAGEMENT", label: "Retail Management" },
            { value: "MERCHANDISING", label: "Merchandising" },
            { value: "BUYING", label: "Buying & Procurement" },
            { value: "VISUAL_MERCHANDISING", label: "Visual Merchandising" },
            { value: "STORE_OPERATIONS", label: "Store Operations" },
            { value: "RETAIL_SALES", label: "Retail Sales" },
            { value: "INVENTORY_CONTROL", label: "Inventory Control" },
            { value: "CATEGORY_MANAGEMENT", label: "Category Management" },
            { value: "RETAIL_MARKETING", label: "Retail Marketing" },
            { value: "E_COMMERCE", label: "E-Commerce" },
            { value: "OMNICHANNEL_RETAIL", label: "Omnichannel Retail" },
            { value: "CUSTOMER_SERVICE_RETAIL", label: "Customer Service" }
        ]
    },

    {
        value: "AVIATION",
        label: "Aviation & Aerospace",
        subcategories: [
            { value: "COMMERCIAL_PILOT", label: "Commercial Pilot" },
            { value: "AIRCRAFT_MAINTENANCE", label: "Aircraft Maintenance" },
            { value: "AVIATION_MANAGEMENT", label: "Aviation Management" },
            { value: "AIR_TRAFFIC_CONTROL_AVIATION", label: "Air Traffic Control" },
            { value: "FLIGHT_ATTENDANT", label: "Flight Attendant" },
            { value: "AVIATION_SAFETY", label: "Aviation Safety" },
            { value: "AEROSPACE_ENGINEERING_AVIATION", label: "Aerospace Engineering" },
            { value: "AVIONICS", label: "Avionics" },
            { value: "AIRPORT_OPERATIONS", label: "Airport Operations" },
            { value: "GROUND_HANDLING", label: "Ground Handling" },
            { value: "AVIATION_SECURITY", label: "Aviation Security" }
        ]
    },

    {
        value: "FASHION_BEAUTY",
        label: "Fashion & Beauty",
        subcategories: [
            { value: "FASHION_DESIGN_BEAUTY", label: "Fashion Design" },
            { value: "COSMETOLOGY", label: "Cosmetology" },
            { value: "HAIR_STYLING", label: "Hair Styling" },
            { value: "MAKEUP_ARTISTRY", label: "Makeup Artistry" },
            { value: "FASHION_MERCHANDISING", label: "Fashion Merchandising" },
            { value: "FASHION_BUYING", label: "Fashion Buying" },
            { value: "MODELING", label: "Modeling" },
            { value: "FASHION_STYLING", label: "Fashion Styling" },
            { value: "SKIN_CARE", label: "Skin Care" },
            { value: "NAIL_TECHNOLOGY", label: "Nail Technology" },
            { value: "FASHION_PHOTOGRAPHY", label: "Fashion Photography" },
            { value: "BEAUTY_BRAND_MANAGEMENT", label: "Beauty Brand Management" }
        ]
    },

    {
        value: "MARITIME_SHIPPING",
        label: "Maritime & Shipping",
        subcategories: [
            { value: "DECK_OFFICER", label: "Deck Officer" },
            { value: "MARINE_ENGINEERING", label: "Marine Engineering" },
            { value: "SHIP_CAPTAIN", label: "Ship Captain" },
            { value: "PORT_OPERATIONS", label: "Port Operations" },
            { value: "SHIPPING_COORDINATION_MARITIME", label: "Shipping Coordination" },
            { value: "VESSEL_TRAFFIC", label: "Vessel Traffic Services" },
            { value: "MARITIME_SAFETY", label: "Maritime Safety" },
            { value: "SHIPBROKER", label: "Shipbroker" },
            { value: "MARINE_SURVEYOR", label: "Marine Surveyor" },
            { value: "OFFSHORE_DRILLING", label: "Offshore Drilling" },
            { value: "DIVING", label: "Commercial Diving" }
        ]
    },

    {
        value: "PSYCHOLOGY_COUNSELING",
        label: "Psychology & Counseling",
        subcategories: [
            { value: "CLINICAL_PSYCHOLOGY", label: "Clinical Psychology" },
            { value: "COUNSELING_PSYCHOLOGY", label: "Counseling Psychology" },
            { value: "SCHOOL_PSYCHOLOGY", label: "School Psychology" },
            { value: "INDUSTRIAL_PSYCHOLOGY", label: "Industrial Psychology" },
            { value: "FORENSIC_PSYCHOLOGY", label: "Forensic Psychology" },
            { value: "SPORTS_PSYCHOLOGY_COUNSELING", label: "Sports Psychology" },
            { value: "CHILD_PSYCHOLOGY", label: "Child Psychology" },
            { value: "ADDICTION_COUNSELING", label: "Addiction Counseling" },
            { value: "MARRIAGE_COUNSELING", label: "Marriage & Family Counseling" },
            { value: "REHABILITATION_COUNSELING", label: "Rehabilitation Counseling" },
            { value: "ART_THERAPY", label: "Art Therapy" }
        ]
    },

    {
        value: "LIBRARY_INFORMATION",
        label: "Library & Information Science",
        subcategories: [
            { value: "LIBRARIAN", label: "Librarian" },
            { value: "ARCHIVIST", label: "Archivist" },
            { value: "INFORMATION_SPECIALIST", label: "Information Specialist" },
            { value: "DIGITAL_ARCHIVING", label: "Digital Archiving" },
            { value: "CATALOGING", label: "Cataloging" },
            { value: "LIBRARY_MANAGEMENT", label: "Library Management" },
            { value: "RESEARCH_LIBRARIAN", label: "Research Librarian" },
            { value: "MEDICAL_LIBRARIAN", label: "Medical Librarian" },
            { value: "LAW_LIBRARIAN", label: "Law Librarian" },
            { value: "DIGITAL_LIBRARIES", label: "Digital Libraries" }
        ]
    },

    {
        value: "RELIGIOUS_SPIRITUAL",
        label: "Religious & Spiritual Services",
        subcategories: [
            { value: "CLERGY", label: "Clergy" },
            { value: "PASTORAL_COUNSELING", label: "Pastoral Counseling" },
            { value: "MISSIONARY", label: "Missionary Work" },
            { value: "RELIGIOUS_EDUCATION", label: "Religious Education" },
            { value: "CHAPLAINCY", label: "Chaplaincy" },
            { value: "WORSHIP_MUSIC", label: "Worship Music" },
            { value: "FAITH_BASED_PROGRAMS", label: "Faith-Based Programs" },
            { value: "SPIRITUAL_DIRECTION", label: "Spiritual Direction" },
            { value: "INTERFAITH_DIALOGUE", label: "Interfaith Dialogue" },
            { value: "RELIGIOUS_ADMINISTRATION", label: "Religious Administration" }
        ]
    },

    {
        value: "FUNERAL_SERVICES",
        label: "Funeral Services & Mortuary",
        subcategories: [
            { value: "FUNERAL_DIRECTOR", label: "Funeral Director" },
            { value: "MORTUARY_SCIENCE", label: "Mortuary Science" },
            { value: "EMBALMING", label: "Embalming" },
            { value: "CEMETERY_MANAGEMENT", label: "Cemetery Management" },
            { value: "CREMATORY_OPERATIONS", label: "Crematory Operations" },
            { value: "GRIEF_COUNSELING", label: "Grief Counseling" },
            { value: "FUNERAL_ARRANGEMENTS", label: "Funeral Arrangements" },
            { value: "MEMORIAL_DESIGN", label: "Memorial Design" },
            { value: "FUNERAL_SALES", label: "Funeral Sales" }
        ]
    },

    {
        value: "PERSONAL_SERVICES",
        label: "Personal Services",
        subcategories: [
            { value: "PERSONAL_CHEF", label: "Personal Chef" },
            { value: "PERSONAL_SHOPPER", label: "Personal Shopper" },
            { value: "BUTLER", label: "Butler Services" },
            { value: "CONCIERGE_PERSONAL", label: "Personal Concierge" },
            { value: "ELDER_CARE", label: "Elder Care" },
            { value: "CHILDCARE", label: "Childcare" },
            { value: "PET_CARE", label: "Pet Care" },
            { value: "HOUSE_SITTING", label: "House Sitting" },
            { value: "PERSONAL_ASSISTANT", label: "Personal Assistant" },
            { value: "LIFE_COACHING", label: "Life Coaching" }
        ]
    },

    {
        value: "LANGUAGE_SERVICES",
        label: "Language Services",
        subcategories: [
            { value: "INTERPRETATION", label: "Interpretation" },
            { value: "TRANSLATION", label: "Translation" },
            { value: "LOCALIZATION", label: "Localization" },
            { value: "LANGUAGE_TEACHING_SERVICES", label: "Language Teaching" },
            { value: "SIGN_LANGUAGE", label: "Sign Language Interpreting" },
            { value: "TRANSCRIPTION", label: "Transcription" },
            { value: "SUBTITLING", label: "Subtitling" },
            { value: "LINGUISTICS", label: "Linguistics" },
            { value: "EDITORIAL_SERVICES", label: "Editorial Services" }
        ]
    },

    {
        value: "SPACE_AEROSPACE",
        label: "Space & Aerospace",
        subcategories: [
            { value: "AEROSPACE_ENGINEERING_SPACE", label: "Aerospace Engineering" },
            { value: "SATELLITE_TECHNOLOGY", label: "Satellite Technology" },
            { value: "SPACE_SCIENCE", label: "Space Science" },
            { value: "ROCKET_SCIENCE", label: "Rocket Science" },
            { value: "SPACE_MISSION_PLANNING", label: "Space Mission Planning" },
            { value: "ASTRONAUTICS", label: "Astronautics" },
            { value: "SPACE_LAUNCH_OPERATIONS", label: "Space Launch Operations" },
            { value: "SPACE_COMMUNICATIONS", label: "Space Communications" },
            { value: "REMOTE_SENSING", label: "Remote Sensing" }
        ]
    }
];

export const experienceLevel = [
    { value: "ENTRY_LEVEL", label: "Entry Level" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "MID_LEVEL", label: "Mid Level" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEAD", label: "Lead" },
    { value: "MANAGER", label: "Manager" },
    { value: "DIRECTOR", label: "Director" },
    { value: "EXECUTIVE", label: "Executive" }
];

export const employmentType = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "TEMPORARY", label: "Temporary" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "VOLUNTEER", label: "Volunteer" }
];

export const opportunityType = [
    { value: "INTERNSHIP", label: "Internship" },
    { value: "SPONSORSHIP", label: "Sponsorship" },
    { value: "BURSARY", label: "Bursary" },
    { value: "SCHOLARSHIP", label: "Scholarship" },
    { value: "UNIVERSITY_ADMISSION", label: "University Admission" },
    { value: "VOLUNTEER", label: "Volunteer Opportunity" },
    { value: "TRAINING", label: "Training Program" },
    { value: "GRANT", label: "Grant" },
    { value: "CERTIFICATION", label: "Certification Program" },
    { value: "FUNDING", label: "Funding Opportunity" },
    { value: "FELLOWSHIP", label: "Fellowship" },
    { value: "APPRENTICESHIP", label: "Apprenticeship" },
    { value: "WORKSHOP", label: "Workshop" },
    { value: "CONFERENCE", label: "Conference" },
    { value: "COMPETITION", label: "Competition" },
    { value: "AWARD", label: "Award" },
    { value: "RESIDENCY", label: "Residency" },
    { value: "MENTORSHIP", label: "Mentorship Program" },
    { value: "ACCELERATOR", label: "Accelerator Program" },
    { value: "INCUBATOR", label: "Incubator Program" },
    { value: "BOOTCAMP", label: "Bootcamp" },
    { value: "EXCHANGE", label: "Exchange Program" },
    { value: "RESEARCH", label: "Research Opportunity" }
];

export const opportunityStatus = [
    { value: "ACTIVE", label: "Active" },
    { value: "CLOSED", label: "Closed" },
    { value: "DRAFT", label: "Draft" },
    { value: "EXPIRED", label: "Expired" },
    { value: "PAUSED", label: "Paused" }
];

export const opportunitySource = [
    { value: "DIRECT_CREATION", label: "Direct Creation" },
    { value: "WEB_SCRAPING", label: "Web Scraping" },
    { value: "API_IMPORT", label: "API Import" },
    { value: "USER_SUBMISSION", label: "User Submission" }
];

export const opportunityEligibility = [
    { value: "OPEN", label: "Open to All" },
    { value: "STUDENTS", label: "Students Only" },
    { value: "GRADUATES", label: "Recent Graduates" },
    { value: "PROFESSIONALS", label: "Professionals" },
    { value: "YOUTH", label: "Youth (Under 35)" },
    { value: "WOMEN", label: "Women Only" },
    { value: "RESIDENTS", label: "Country Residents" },
    { value: "MEMBERS", label: "Organization Members" }
];

export const currencies = [
    { value: "KES", label: "KES - Kenyan Shilling" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "UGX", label: "UGX - Ugandan Shilling" },
    { value: "TZS", label: "TZS - Tanzanian Shilling" },
    { value: "RWF", label: "RWF - Rwandan Franc" },
    { value: "ZAR", label: "ZAR - South African Rand" },
    { value: "NGN", label: "NGN - Nigerian Naira" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "CNY", label: "CNY - Chinese Yuan" }
];
export const organizationStatus = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "PENDING_VERIFICATION", label: "Pending Verification" }
];

export const jobStatus = [
    { value: "ACTIVE", label: "Active" },
    { value: "CLOSED", label: "Closed" },
    { value: "DRAFT", label: "Draft" },
    { value: "EXPIRED", label: "Expired" },
    { value: "PAUSED", label: "Paused" }
];

export const jobSource = [
    { value: "DIRECT_CREATION", label: "Direct Creation" },
    { value: "WEB_SCRAPING", label: "Web Scraping" },
    { value: "API_IMPORT", label: "API Import" },
    { value: "USER_SUBMISSION", label: "User Submission" }
];

// Helper function to get regions for a country
export function getRegionsForCountry(countryName) {
    const country = organizationLocation.find(c => c.name === countryName);
    return country ? country.regions : [];
}

// Helper function to get country by code
export function getCountryByCode(code) {
    return organizationLocation.find(c => c.code === code);
}

// Helper function to get country info
export function getCountryInfo(countryName) {
    return organizationLocation.find(c => c.name === countryName);
}

// Helper function to get subcategories for a job category
export function getSubcategoriesForCategory(categoryValue) {
    const category = jobCategory.find(c => c.value === categoryValue);
    return category ? category.subcategories : [];
}

// Helper function to get category info
export function getCategoryInfo(categoryValue) {
    return jobCategory.find(c => c.value === categoryValue);
}

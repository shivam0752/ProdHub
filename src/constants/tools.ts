export interface Tool {
  id: string
  category: 'PM Fundamentals' | 'Metrics' | 'Frameworks' | 'Prioritization' | 'Stakeholder Management'
  title: string
  definition: string
  example: string
  deep_dive?: string
}

export const CATEGORIES = [
  'PM Fundamentals',
  'Metrics',
  'Frameworks',
  'Prioritization',
  'Stakeholder Management'
] as const

export const SEEDED_TOOLS: Tool[] = [
  {
    "id": "rice-framework",
    "category": "Prioritization",
    "title": "RICE Framework",
    "definition": "A scoring system that ranks product ideas by multiplying how many people they reach, how much they help, and how sure you are, then dividing by the work required. It stops loudest-voice-in-the-room decisions by using simple math to find the highest-value features.",
    "example": "At Swiggy, a PM deciding between building 'Group Ordering' versus 'Instamart Gifting' uses RICE. Group Ordering has higher Reach (all food users) but lower Confidence, while Gifting has lower Reach but high Impact during Diwali, allowing the PM to mathematically justify which feature to build first for festive revenue.",
    "deep_dive": "Use RICE when you have a massive backlog and need an objective, defensible way to align cross-functional teams on the roadmap. It fails to account for strategic dependencies, meaning a low-scoring foundational tech item might get delayed indefinitely even if it is required for future high-scoring features. A common mistake is padding the 'Confidence' score to artificially inflate a pet project's overall rank."
  },
  {
    "id": "kano-model",
    "category": "Prioritization",
    "title": "Kano Model",
    "definition": "A way to map customer satisfaction against how fully a feature is built to sort ideas into basics, performance boosts, or unexpected delights. It helps you avoid spending time on features customers expect as standard while identifying what will actually make them happy.",
    "example": "At Zepto, a PM uses the Kano Model to evaluate delivery features: '10-minute delivery' is a basic expectation, 'live delivery partner tracking' is a performance booster, and 'free surprise snack samples in the bag' is a Delighter that drives massive retention spikes.",
    "deep_dive": "Choose the Kano Model when you are launching a new product version or trying to figure out why retention is dropping despite adding new features. It misses the actual engineering effort required to build these features, treating a hard-to-build delighter the same as an easy one. PMs often make the mistake of relying on one-time surveys, forgetting that today's 'Delighter' quickly degrades into tomorrow's basic expectation as competitors copy it."
  },
  {
    "id": "moscow-method",
    "category": "Prioritization",
    "title": "MoSCoW Method",
    "definition": "A method that labels project requirements as Must have, Should have, Could have, or Won't have right now. It helps engineering and product teams agree on what is absolutely mandatory for a launch versus what can wait.",
    "example": "For launching Flipkart Minutes (quick commerce), the PM categorized 'UPI payment checkout' as a Must-have, 'Scheduled next-day deliveries' as a Could-have, and 'International credit card support' as a Won't-have for the initial minimum launch.",
    "deep_dive": "Use this during tight timeline constraints like a major sales event launch to ruthlessly protect the release date. The framework fails because it lacks granular differentiation within categories, often leading teams to label 80% of items as 'Must-have' due to emotional attachment. PMs frequently fail by not explicitly defining what 'Won't-have' means, leading to scope creep as those features sneak back into the sprint."
  },
  {
    "id": "ice-scoring",
    "category": "Prioritization",
    "title": "ICE Scoring",
    "definition": "A quick framework that rates ideas from one to ten based on Impact, Confidence, and Ease of implementation. It is designed for fast-moving teams who need to make rapid decisions without spending days gathering deep data.",
    "example": "At Groww, a growth PM trying to optimize the mutual fund onboarding funnel uses ICE to prioritize quick growth hacks. Changing a button color to 'Invest Now' ranks high because it has high Ease (one day of development work) and high Confidence, beating a complex personalized quiz feature.",
    "deep_dive": "ICE is best for early-stage products or growth hacking teams where speed of execution beats perfect data accuracy. It completely misses the absolute volume of users affected, which can lead to over-indexing on niche features that are easy to build but only seen by a tiny fraction of your audience. The most common pitfall is treating the scores as absolute scientific truths rather than subjective team estimates, causing friction when experiments fail."
  },
  {
    "id": "north-star-metric",
    "category": "Metrics",
    "title": "North Star Metric",
    "definition": "The single key metric that best captures the core value your product delivers to its customers. It serves as the ultimate target that aligns all product, engineering, and design teams toward long-term business growth.",
    "example": "For CRED, the North Star Metric is not just app downloads, but 'Number of Monthly Active Users paying bills worth more than ₹10,000,' which reflects high-value user retention and direct ecosystem monetization.",
    "deep_dive": "Use a North Star Metric to break down silos across large product organizations so every squad understands how their micro-metrics feed into company success. It misses operational health and short-term financial realities, meaning a company can optimize its North Star while burning through cash unsustainably. PMs often pick a lagging financial indicator like 'Total Revenue' instead of a leading value-delivery indicator like active usage milestones."
  },
  {
    "id": "aarrr-pirate-metrics",
    "category": "Metrics",
    "title": "AARRR Pirate Metrics",
    "definition": "A framework that tracks the five stages of a customer's journey: Acquisition, Activation, Retention, Referral, and Revenue. It helps you pinpoint exactly where users are dropping out of your product funnel.",
    "example": "A PM at Razorpay uses AARRR to audit the payment gateway onboarding: Acquisition is website signups, Activation is the first successful sandboxed transaction, Retention is continuing to process weekly payouts, Referral is partner integrations, and Revenue is the transaction fee percentage.",
    "deep_dive": "Use AARRR when optimizing a growth funnel or conducting a diagnostic check on why your product isn't scaling as expected. It misses post-purchase customer satisfaction and customer support load, which can disguise a product that generates high initial revenue but suffers from massive backend operational failures. A common mistake is focusing heavily on top-of-funnel Acquisition while ignoring poor Retention, effectively pouring water into a leaky bucket."
  },
  {
    "id": "ltv-to-cac-ratio",
    "category": "Metrics",
    "title": "LTV to CAC Ratio",
    "definition": "A formula comparing the total money a customer will spend on your product over their lifetime against the money spent to acquire that customer. It tells you whether your business model is actually profitable and sustainable.",
    "example": "At Blinkit, the PM calculates the LTV:CAC ratio by analyzing the average grocery margin per user over 24 months against the Google and Meta ad spend needed to get that user to download the app and place their first order.",
    "deep_dive": "Use this metric when evaluating unit economics, pitching for capital, or determining whether to scale marketing spend on specific acquisition channels. It misses cash flow realities, as a high lifetime value that takes three years to materialize does not help a startup that will run out of cash in six months. PMs frequently make the mistake of underestimating acquisition costs by omitting organic traffic or overhead costs like customer support and refunds from the calculation."
  },
  {
    "id": "heart-framework",
    "category": "Metrics",
    "title": "HEART Framework",
    "definition": "A framework designed to measure user experience using five categories: Happiness, Engagement, Adoption, Retention, and Task Success. It helps teams measure the emotional and usability health of a product alongside pure business metrics.",
    "example": "A PM at Flipkart updating the checkout page tracks Task Success (time taken to complete payment) and Happiness (net promoter score after delivery) to ensure that a new design change doesn't confuse older, less tech-savvy users.",
    "deep_dive": "Use HEART when launching major UI or UX overhauls where tracking standard business metrics like clicks won't tell you if users are actually frustrated. It misses direct revenue impacts, meaning you can build a highly usable, delightful experience that fails to convert into monetization. PMs often fail by trying to track all five categories simultaneously across every minor feature, diluting team focus instead of picking the 2-3 categories that truly matter for the specific release."
  },
  {
    "id": "jobs-to-be-done-jtbd",
    "category": "Frameworks",
    "title": "Jobs-To-Be-Done (JTBD)",
    "definition": "A way of looking at products based on the core task or progress a customer is trying to achieve when they use your product. It shifts your focus away from user demographics toward the actual real-world situations and problems driving a purchase.",
    "example": "At Zepto, a PM uses JTBD to realize customers don't just want groceries; they are using Zepto to 'save me from embarrassment when guests arrive unannounced and I have no snacks.' This drives the prioritization of a 'Guest Treats' item category on the homepage.",
    "deep_dive": "Use JTBD during foundational product discovery or when entering a highly competitive market where matching competitors' feature lists won't give you an edge. It misses technical feasibility and cost constraints of solving that job, sometimes leading to ideal product ideas that are impossible to build profitably. PMs frequently make the mistake of defining the 'job' too broadly or too narrowly, making it useless for actual product scoping."
  },
  {
    "id": "hook-model",
    "category": "Frameworks",
    "title": "Hook Model",
    "definition": "A four-step process—Trigger, Action, Variable Reward, and Investment—designed to build habit-forming products. It helps you design experiences that users return to naturally without relying on expensive ads or constant notifications.",
    "example": "CRED applies the Hook Model: The Trigger is a credit card bill SMS, the Action is a single-tap payment, the Variable Reward is spinning a jackpot wheel for mysterious cashback or coins, and the Investment is linking multiple credit cards to track credit scores.",
    "deep_dive": "Apply this framework when building consumer apps that rely on high daily or weekly frequency to survive, like social, fintech, or gaming platforms. It misses the long-term utility of the product, meaning users can get hooked on the loop but eventually suffer from gamification fatigue and delete the app once the rewards lose novelty. A major trap for PMs is using unethical or annoying push triggers that create short-term engagement spikes but ruin brand trust."
  },
  {
    "id": "circles-method",
    "category": "Frameworks",
    "title": "Circles Method",
    "definition": "A seven-step guide that helps PMs design user-centered products by systematically defining the context, identifying personas, listing needs, prioritizing goals, and brainstorming creative solutions. It provides a structured path to ensure you never build a solution for the wrong problem.",
    "example": "A PM at Swiggy uses the Circles Method to design a food delivery solution for elderly users living alone, identifying their specific constraints (poor eyesight, complex UPI steps) before brainstorming a voice-assisted simplified checkout.",
    "deep_dive": "Use this during product design interviews or early-stage product brainstorming sessions to ensure you explore a broad problem space before anchoring on a solution. It misses business viability and operational mechanics entirely, which can result in highly empathetic designs that are operationally impossible to execute in the real world. PMs often rush through the initial step of defining the customer persona and end up brainstorming features for a generic, non-existent average user."
  },
  {
    "id": "working-backwards-pr-faq",
    "category": "Frameworks",
    "title": "Working Backwards (PR-FAQ)",
    "definition": "A product development process where you write the launch press release and internal frequently asked questions before a single line of code is written. It forces you to clearly articulate the value to the customer from day one before investing any engineering resources.",
    "example": "At Flipkart, before building 'Flipkart Plus Premium,' the PM drafts a mock press release detailing exactly what an Indian customer gets (extra discounts, faster shipping) and an FAQ answering tough questions like 'How does this impact regular Plus members?'",
    "deep_dive": "Use this for high-stakes, highly strategic new product launches where you need extreme clarity on the value proposition and buy-in from senior leadership. It misses the iterative learning of agile development, as committing to a fixed vision in a press release can make teams rigid and resistant to pivot based on early user testing data. The most common error is writing a fluff-filled press release that sounds good to executives but glosses over the actual technical or operational bottlenecks discovered during execution."
  },
  {
    "id": "product-requirement-document-prd",
    "category": "PM Fundamentals",
    "title": "Product Requirement Document (PRD)",
    "definition": "A central document that outlines a feature's purpose, what it must do, how it should behave, and how success will be measured. It acts as the single source of truth that keeps engineers, designers, and business stakeholders aligned throughout development.",
    "example": "A PM at Razorpay writes a PRD for 'Instant Refunds via UPI,' specifying the error handling states, the UI wireframe flows for merchants, and the target metric of reducing customer support tickets by 20%.",
    "deep_dive": "Use a PRD as your primary tool for kickstarting any product feature or major change to ensure all technical and design requirements are thought through before engineering work starts. It misses the dynamic changes that happen during live sprints, often becoming a stagnant document that doesn't match the actual code being shipped if not updated continuously. PMs routinely make the mistake of writing PRDs that specify how to build the solution technically instead of focusing on what problem to solve."
  },
  {
    "id": "user-personas",
    "category": "PM Fundamentals",
    "title": "User Personas",
    "definition": "Semi-fictional profiles that represent your ideal customers based on real data, behaviors, and motivations. They help the entire team build empathy and make design decisions centered around real user needs rather than personal opinions.",
    "example": "At Groww, PMs design for 'Beginner Rahul'—a 23-year-old IT professional in Bengaluru who has ₹5,000 to invest but is terrified of stock market volatility and needs extreme simplicity over complex analytical charts.",
    "deep_dive": "Use user personas when expanding your product to a new segment or aligning a multidisciplinary team on who exactly they are building for. It misses the situational context of the user, ignoring the fact that the same person behaves completely differently when they are stressed, in a hurry, or short on cash. PMs often create idealized, generic profiles based on demographic stereotypes rather than actual behavioral data collected from real customer interviews."
  },
  {
    "id": "customer-journey-mapping",
    "category": "PM Fundamentals",
    "title": "Customer Journey Mapping",
    "definition": "A visual timeline showing every step a customer takes when interacting with your product, from the moment they discover it to long-term usage. It highlights user emotions, pain points, and friction zones across different touchpoints.",
    "example": "A Zepto PM maps the journey of a user ordering late-night snacks, identifying a critical friction point where users drop off because their preferred late-night delivery slot shows 'Delayed due to rain' at the final checkout screen.",
    "deep_dive": "Use this framework when you notice high drop-off rates across multi-stage processes to understand the emotional friction points causing users to abandon the app. It misses internal system performance and operational constraints, mapping out a flawless user flow that might be completely unfeasible given your current logistics backend or API latency. The biggest mistake PMs make is mapping the ideal journey they want the user to take instead of mapping the actual, messy journey real users experience."
  },
  {
    "id": "ab-testing-experimentation",
    "category": "PM Fundamentals",
    "title": "A/B Testing / Experimentation",
    "definition": "A method of comparing two versions of a webpage or app feature against each other to see which one performs better based on data. It allows teams to test hypotheses with real user traffic before rolling out changes to everyone.",
    "example": "At Swiggy, the PM runs an A/B test showing Version A (default list of restaurants) to 50% of users and Version B (an AI-personalized carousel based on past orders) to the other 50% to see which drives a higher conversion to checkout.",
    "deep_dive": "Use A/B testing when optimizing conversion funnels, micro-interactions, or pricing strategies where you need mathematical proof of impact before scaling. It misses the 'why' behind user behavior, telling you which version won but giving zero insight into why users preferred it or if it caused frustration elsewhere. PMs often make the mistake of running tests with insufficient sample sizes or stopping experiments too early, leading to false positives."
  },
  {
    "id": "raci-matrix",
    "category": "Stakeholder Management",
    "title": "RACI Matrix",
    "definition": "A simple chart that clarifies team roles by labeling who is Responsible for doing the work, Accountable for the final outcome, Consulted for input, and Informed of progress. It eliminates confusion around ownership and speeds up cross-functional project execution.",
    "example": "For launching a co-branded credit card at CRED, the PM creates a RACI matrix: the PM is Accountable, the backend engineer is Responsible for API integration, the Risk Compliance team is Consulted, and the Customer Support leads are Informed.",
    "deep_dive": "Deploy a RACI matrix at the kickoff of large, complex cross-departmental projects where roles overlap and tasks risk slipping through the cracks. It misses the nuances of collaborative problem-solving, often creating rigid corporate walls where people refuse to help with a task simply because they are marked as 'Informed' rather than 'Responsible.' A critical failure mode is assigning multiple people as 'Accountable,' which inevitably leads to a lack of actual ownership when things go wrong."
  },
  {
    "id": "power-interest-grid",
    "category": "Stakeholder Management",
    "title": "Power-Interest Grid",
    "definition": "A two-by-two grid that classifies stakeholders based on how much authority they have and how much they care about your project. It helps PMs budget their limited communication time by identifying who needs daily management versus who just needs occasional status updates.",
    "example": "A PM at Razorpay building a new merchant lending product maps stakeholders: the RBI Compliance head has High Power/High Interest (Manage Closely), while the Internal Marketing team has Low Power/High Interest (Keep Informed).",
    "deep_dive": "Use this grid during annual planning or major product pivots when you have to navigate a complex corporate web with conflicting agendas. It misses the dynamic shifting of stakeholder sentiment, treating someone's alignment as static when an external event can suddenly turn a quiet stakeholder into an active blocker. PMs frequently fail by keeping this grid completely private and failing to validate whether their assessment of a stakeholder's power or interest is actually accurate."
  },
  {
    "id": "spade-framework",
    "category": "Stakeholder Management",
    "title": "SPADE Framework",
    "definition": "A decision-making framework consisting of Setting, People, Alternatives, Decide, and Explain. It is designed to bring transparency and speed to hard, high-impact product choices involving multiple teams.",
    "example": "A PM at Flipkart deciding whether to build an in-house delivery tracking system or partner with a third-party logistics firm uses SPADE to outline alternatives, assign the decision-maker, and hold an executive alignment meeting.",
    "deep_dive": "Use SPADE for high-stakes, irreversible decisions where a wrong choice will cost months of engineering time and spark intense cross-team political battles. It misses the agility needed for daily micro-decisions, acting as a heavy administrative process that can paralyze a team if applied to minor product choices. PMs often mistake the 'Consulted' stakeholders for the ultimate 'Decider,' leading to decision-by-committee gridlock where no real choice is made."
  },
  {
    "id": "working-agreement-sla-framework",
    "category": "Stakeholder Management",
    "title": "Working Agreement / SLA Framework",
    "definition": "A pact between the product team and external teams (like engineering, marketing, or support) that defines response times, handoff requirements, and quality standards. It sets clear expectations upfront to prevent friction and finger-pointing when bugs or delays happen.",
    "example": "A PM at Groww establishes an SLA with the Customer Support team: if a user reports a P1 bug (unable to withdraw money), the PM guarantees engineering triage within 30 minutes, while Support agrees to collect specific logs before escalating.",
    "deep_dive": "Implement SLAs when managing highly interdependent operations where delays in one department directly stall the shipping or fixing velocity of the product team. It misses the unpredictable reality of software development, where a deep architectural bug cannot be fixed by a rigid timeline without severely compromising code quality. PMs often treat SLAs as a stick to punish other teams rather than a collaborative tool, which completely destroys cross-functional psychological safety."
  }
];

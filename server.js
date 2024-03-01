import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 5000;

const credentials = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("wireframes"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("input.ejs");
});

app.post("/generate", (req, res) => {

  try {
    const rawuserInput = req.body.design.trim();
   
  {
    const wireframeimagepath = getWireframeData(rawuserInput);
    console.log("Wireframe Category:", wireframeimagepath);

    res.render("output.ejs", { wireframeimagepath });
  }

 } catch (error) {
    console.error("Error generating wireframe:", error.message);
    res.status(500).send("no data found");
  }
});

// Serve PNG file for download
app.get("/download/png/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = `wireframes/${filename}.png`;

    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    
    console.error("Error serving PNG file:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

const feedbackArray=[];

let feedbackSerial =1;

app.post("/feedback", (req, res) => {
  try {
    const userFeedback = req.body.feedback;
    const userRating = req.body.rating;
    console.log(userFeedback,userRating);

    const feedbackEntry = {
      serial: feedbackSerial,
      feedback: userFeedback,
      rating: userRating,
    }

    feedbackArray.push(feedbackEntry);

    feedbackSerial++;
    
    res.status(200).send("Feedback submitted successfully!");
  } catch (error) {
    console.error("Error processing feedback:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/feedbacks",(req,res)=>{
  try{
    res.status(200).json(feedbackArray);
  }catch(error){
    console.error("Error retrieving feedbacks:",error.message);
    res.status(500).send("Internal Server Error")
  }
})

// Serve SVG file for download
app.get("/download/svg/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = `wireframes/${filename}.svg`;

    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    
    console.error("Error serving SVG file:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


function getWireframeData(rawuserInput) {
  try {
    const matchingWireframes = [];
    const userInput = rawuserInput.toLowerCase();

    Object.keys(keywords).forEach((category) => {
      const categoryKeywords = keywords[category].map((keyword) => 
        keyword.toLowerCase()
        );
      
      if (categoryKeywords.some((keyword) => userInput.includes(keyword))) {
        matchingWireframes.push(category);
      } else 
      {
        // If no match with original keywords, check with combined keywords
        const combinedKeywords = categoryKeywords.map((keyword) => keyword.replace(/\s/g, ''));
      
        if (combinedKeywords.some((keyword) => userInput.includes(keyword))) {
          matchingWireframes.push(category);
        }
      }
    });



    if (matchingWireframes.length === 0) {
      return  "/Default";
    }

    const selectedcategory = matchingWireframes[0];
    console.log("selectedcategory: ", selectedcategory);

    const filepath = `/${selectedcategory}`;
    console.log(filepath);
    return filepath;
  } catch (error) {
    console.log("e3");
    console.error("Error in getWireframeData:", error.message);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



const keywords = {
  Aboutus: ["about us", "company information", "our story","my page","about","ones self"],
  AbroadConsultancy: ["abroad consultancy", "study abroad", "overseas education", "abroad", "consultancy"],
  AiComedian: ["AI comedian", "artificial intelligence humor", "robot comedian"],
  Astronomy_and_SpaceExploration: ["astronomy", "space exploration", "cosmic discovery"],
  AugmentedRealityApp: ["augmented reality app", "AR app", "AR experience"],
  Auction: ["auction", "bidding", "online auction"],
  Automotive: ["automotive", "car", "vehicle","vehicles"],
  BankingWebsite: ["banking website", "financial services", "online banking"],
  Blog: ["blog", "post", "article"],
  BlogPost: ["blog post", "article", "blog entry"],
  BookClub: ["book club", "literary group", "reading community"],
  Calendar: ["calendar", "schedule", "event planner"],
  ChatInterface: ["chat interface", "messaging", "conversation UI"],
  Checkout: ["checkout", "payment", "purchase"],
  CodeResourcingSite: ["code resourcing site", "coding resources", "programming tutorials"],
  Confirmation: ["confirmation", "confirmation page", "order confirmation"],
  ContactUs: ["contact us", "contact form", "support","contact","phone"],
  CryptocurrencyExchange: ["cryptocurrency exchange", "crypto trading", "digital currency platform"],
  CreativeAgency: ["creative agency", "design studio", "creative services"],
  DatingWebsite: ["dating website", "online dating", "relationship platform","dating","relationship",],
  Dashboard: ["dashboard", "admin panel", "user dashboard"],
  Default:["Default"],
  Ecommerce: ["ecommerce", "online store", "shopping platform"],
  EducationalWebsite: ["educational website", "learning resources", "academic platform"],
  ErrorPage: ["error page", "404 page", "error screen"],
  EventManagement: ["event management", "event planning", "event organization","management"],
  EventPage: ["event page", "event details", "event information"],
  EventRegistrationForm: ["event registration form", "event sign-up", "participant enrollment"],
  ErrorPage: ["error page", "404 page", "error screen"],
  Faq: ["faq", "frequently asked questions", "help center"],
  Feedback: ["feedback", "user feedback", "customer feedback"],
  FitnessWellness: ["fitness & wellness", "health and wellness", "fitness programs","fitness"],
  Form: ["forms", "input form", "data entry"],
  ForumThread: ["forum thread", "discussion forum", "community discussion"],
  FreelanceMarketplace: ["freelance marketplace", "gig platform", "freelancer network"],
  Gallery: ["gallery", "art gallery", "image collection","album","photos"],
  GovernmentServicePortal: ["government service portal", "public services", "official platform"],
  GameInterface: ["game interface", "gaming ui","gaming UI", "game controls"],
  GamingWebsite: ["gaming website","game","gaming","games"],
  HealthcareWebsite: ["healthcare", "medical services", "health information"],
  HistoricalResearchArchives: ["historical research archives", "history database", "archive collection"],
  Homepage: ["homepage", "landing page", "main page"],
  HomeRennovation: ["home renovation", "interior design","house rennovation","house"],
  Invoice: ["invoice", "billing", "payment receipt"],
  ItCompanyWebsite: ["IT company website", "technology firm", "software development","corporate company","corporate companies","corporate"],
  JobBoard: ["job board", "job platform", "employment portal"],
  JobListing: ["job listing", "employment opportunities", "job openings"],
  JobPortal:["onboarding","job searching","company","companies"],
  Knowledge: ["knowledge", "information", "learning resources"],
  LanguageLearning: ["language learning", "language education", "language courses"],
  LanguageTranslater: ["language translator", "translation tool", "language conversion"],
  LegalServices: ["legal services", "law services", "legal advice"],
  Login: ["login", "signin", "authentication"],
  MapInterface: ["map interface", "mapping", "location UI"],
  MediaPlayer: ["media player", "audio player", "video player"],
  MeetPlatform: ["meet platform", "virtual meeting", "online conferencing"],
  MobileApp: ["mobile app", "mobile application", "app development"],
  Music: ["music", "audio", "music streaming","listening","songs","spotify"],
  NicheCommunityPlatform: ["niche community platform", "specialized community", "exclusive group"],
  NewsFeed: ["news feed", "content feed", "information stream"],
  NewsWebsite: ["news website", "news portal", "news platform"],
  Notification: ["notification", "alert", "message alert"],
  OnboardingProcess: ["onboarding process", "user onboarding", "new user setup"],
  OnboardingTutorial: ["onboarding tutorial",  "guided setup"],
  OnlineGaming: ["online gaming", "gaming platform", "video games"],
  OnlineLearningPlatform:["learning platform","learning","online knowledge","online resources","course page","online course"],
  OutdoorAdventureBooking: ["outdoor booking", "booking platform", "reservation"],
  PaymentGateway: ["payment gateway", "payment processing", "payment system"],
  PetFashionAccessoriesMarketplace: ["pet fashion accessories marketplace", "pet fashion", "animal accessories"],
  PodcastingPlatform: ["podcasting platform", "audio content", "podcast hosting","podcasting"],
  Portfolio: ["portfolio", "projects", "work"],
  Privacypolicy: ["privacy policy", "data privacy", "privacy information"],
  ProductComparison: ["product comparison", "compare products", "product analysis"],
  ProductPage: ["product page", "item details", "product information"],
  ProfilePage: ["profile page", "user profile", "personal information"],
  ProjectManagementDashboard: ["project management dashboard", "PM dashboard", "project overview"],
  RealEstate: ["real estate", "property", "real estate listings"],
  Restaurent: ["restaurant", "dining", "food establishment","street food","food place"],
  ResponsiveDesign: ["responsive design", "responsive web", "adaptive layout"],
  Resume: ["resume", "CV", "job application"],
  SearchResults: ["search results", "search page", "search outcome"],
  Services: ["services", "offered services", "service catalog"],
  Settings: ["settings", "user settings", "configuration","repair"],
  Signup: ["sign up","register","account creating form"],
  SocialnetworkingApp: ["social networking app", "social media", "networking platform"],
  SocialnetworkingApp: ["social networking app", "social media", "networking platform"],
  StatisticsSection: ["statistics section", "data analytics", "performance metrics"],
  Survey: ["survey", "feedback survey", "questionnaire"],
  TeamCollaboration: ["team collaboration", "collaboration tools", "group work"],
  TechCompanyWebsite: ["tech company website", "technology firm", "software development"],
  TechNewsWebsite: ["tech news website", "technology blog", "IT news"],
  TechSupport: ["tech support", "technical assistance", "customer support"],
  TechnologyReview: ["technology review", "product review", "tech analysis"],
  TermsCondition: ["terms and conditions", "terms of service", "legal terms"],
  Testimonals: ["testimonials", "customer reviews", "user feedback"],
  Timeline: ["timeline", "chronology", "event timeline"],
  TravelAgency: ["travel agency", "tour agency", "travel services","travel"],
  UserManual: ["user manual", "instruction guide", "product manual"],
  UserGuide: ["user guide", "instruction manual", "product guide"],
  VideoStreaming: ["video streaming", "streaming platform", "online video","youtube","stream"],
  VideoTutorial: ["video tutorial", "educational video"],
  Weather: ["weather", "weather information", "climate","nature"],
  BookRecommendationPlatform: ["book recommendation platform", "reading suggestions", "literary recommendations"],
  DIYCraftandHobbiesHub: ["DIY craft and hobbies hub", "do-it-yourself crafts", "hobbies tutorials"],
  EcoFriendlyProductMarketplace: ["eco-friendly product marketplace", "sustainable products", "environmentally friendly goods"],
  EthicalTravelExperiences: ["ethical travel experiences", "responsible tourism", "sustainable travel"],
  GreeEnergyConsumptionTracker: ["green energy consumption tracker", "energy usage monitoring", "environmentally friendly energy"],
  HomeGardeningGuide: ["home gardening guide", "gardening tips", "gardening tutorials"],
  LanguageLearningPlatform: ["language learning platform", "language education", "language courses"],
  LocalFoodDiscovery: ["local food discovery", "culinary experiences", "food exploration"],
  LocalFarmersMarketDirectory: ["local farmers market directory", "farmers market guide", "local produce"],
  MentalHealthSupportCommunity: ["mental health support community", "emotional well-being", "mental health resources"],
  MinimalistLifestyleGuide: ["minimalist lifestyle guide", "minimalism tips", "simple living"],
  PersonalDevelopmentJournal: ["personal development journal", "self-improvement", "personal growth"],
  PersonalFinanceTracker: ["personal finance tracker", "budgeting tool", "financial management"],
  PersonalizedRecipeRecommender: ["personalized recipe recommender", "recipe suggestions", "customized cooking"],
  RemoteWorkCollaborationHub: ["remote work collaboration hub", "virtual collaboration", "remote team tools"],
  RenewableEnergySolutions: ["renewable energy solutions", "clean energy", "green power"],
  SustainableFashionMarketplace: ["sustainable fashion marketplace", "ethical clothing", "eco-friendly fashion"],
  TechGadgetsReviewPlatform: ["tech gadgets review platform", "gadget reviews", "technology recommendations"],
  TravelItineraryPlanner: ["travel itinerary planner", "trip planning", "itinerary creation"],
  VirtualArtGallery: ["virtual art gallery", "online art exhibition", "digital art showcase"],
  VirtualInteriorDesignStudio: ["virtual interior design studio", "online interior design", "virtual home decor"],
  VolunteerOpportunitiesFinder: ["volunteer opportunities finder", "community service", "volunteering"],
  WildlifeConservationAwareness: ["wildlife conservation awareness", "animal protection", "environmental conservation"],
  FoodDelivery: ["food delivery", "meal delivery", "restaurant delivery","food services"],
  Matrimony: ["matrimony", "marriage services", "matchmaking","marriage","destined"],
  PersonnelAccount: ["personnel account", "account management", "personal finance","personnel page","personnel"],
  SocialMediaApp: ["social media app", "social network", "online community","facebook","instagram","twitter","threads"],
  VisionApp: ["vision app", "image recognition app", "visual technology","blind","vision","handicap"],
  PaymentApps:["upi payment","paytm","transaction"],
  SportsScoreUpdate:["sports","cricket","scorecard","cricbuzz","sports update"]
};

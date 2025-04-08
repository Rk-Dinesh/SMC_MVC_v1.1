const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const AdminController = require("../Controller/admin_controller");
const categoryController = require("../Controller/category_controller");
const notifyController = require("../Controller/notify_controller");
const priorityController = require("../Controller/priority_controlleer");
const statusController = require("../Controller/status_controller");
const taxController = require("../Controller/tax_controller");
const ticketController = require("../Controller/ticket_controller");
const subscriptionplanController = require("../Controller/subscriptionPlan_controller");
const faqController = require("../Controller/faq_controller");
const contactController = require("../Controller/contact_controller");
const otpController = require("../Controller/otp_controller");
const countController = require("../Controller/plancount_controller");
const courseController = require("../Controller/course_controller");
const policyController = require("../Controller/policy_controller");
const profileImageController = require("../Controller/profileImage_controller");
const RoleController = require("../Controller/roleaccesslevel_controller");
const TicketSupportController = require("../Controller/ticketsupport_controller");
const UserController = require("../Controller/user_controller");
const EmailController = require("../Controller/email_controller");
const PaymentController = require("../Controller/payment_controller");
const AIController = require("../Controller/ai_controller");
const SubscriptionController = require("../Controller/subscrption_controller");
const NotesController = require("../Controller/notes_controller");
const ExamController = require("../Controller/exam_controller");

const storage = multer.diskStorage({
    destination: "excel",
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  
  const upload1 = multer({
    dest: "attachments",
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
      files: 5,
    },
  });
  
  const upload = multer({ storage });

//AI
router.post("/api/prompt", AIController.generatePrompt);
router.post("/api/generate", AIController.generateTheory);
router.post("/api/image", AIController.fetchImage);
router.post("/api/yt", AIController.fetchYouTubeVideo);
router.post("/api/transcript", AIController.fetchTranscript);
router.post("/api/chat", AIController.generateChatResponse);
//send Email
router.post("/api/data", EmailController.sendEmail);
// Admin
router.post("/api/adminsignup", AdminController.createAdmin); 
router.post("/api/verify", AdminController.verifyEmail); 
router.post("/api/adminsignin", AdminController.signInAdmin); 
router.post("/api/forgot", AdminController.forgotPassword); 
router.post("/api/reset-password", AdminController.resetPassword);  
router.get("/api/getadmin", AdminController.getAllAdmins);  
router.get("/api/getadminbyid/:id", AdminController.getAdminById);  
router.delete("/api/deleteadmin/:id", AdminController.deleteAdmin);  
router.put("/api/adminupdate/:id", AdminController.updateAdmin);  
router.post("/api/adminuploadcsv", upload.single("file"), AdminController.uploadCSV);
router.post("/api/changepassword", AdminController.changePassword);
//User 
router.post("/api/usersignup", UserController.createUser);  
router.post("/api/usersignin", UserController.signInUser);  
router.post("/api/verify", UserController.verifyEmail);   
router.get("/api/getusers", UserController.getAllUsers);  
router.get("/api/getusersbyid", UserController.getUserById);  
router.delete("/api/deleteuser", UserController.deleteUser);  
router.post("/api/emailupdate", UserController.updateEmail);  
router.post("/api/phoneupdate", UserController.updatePhone);  
router.post("/api/useruploadcsv", upload.single("file"), UserController.uploadCSV);
 // Category 
router.post("/api/category", categoryController.createCategory); 
router.put("/api/category/:id", categoryController.updateCategory); 
router.delete("/api/category/:id", categoryController.deleteCategory); 
router.get("/api/getcategory", categoryController.getCategories); 
// notify
router.post("/api/notify", notifyController.createNotification); 
router.get("/api/getnotify", notifyController.getAllNotifications); 
router.get("/api/getnotifybyid", notifyController.getNotificationsByUser); 
router.put("/api/updatenotify", notifyController.updateNotificationsByUser); 
// Priority
router.post("/api/priority", priorityController.createPriority); 
router.put("/api/priority/:id", priorityController.updatePriority); 
router.delete("/api/priority/:id", priorityController.deletePriority); 
router.get("/api/getpriority", priorityController.getAllPriorities); 
// Status
router.post("/api/status", statusController.createStatus); 
router.put("/api/status/:id", statusController.updateStatus); 
router.delete("/api/status/:id", statusController.deleteStatus); 
router.get("/api/getstatus", statusController.getAllStatuses); 
// Tax
router.post("/api/tax", taxController.createTax); 
router.put("/api/taxupdate/:id", taxController.updateTax); 
router.delete("/api/tax/:id", taxController.deleteTax); 
router.get("/api/gettax", taxController.getAllTaxes); 
// Ticket
router.post("/api/ticket", ticketController.createTicket);  
router.put("/api/ticketupdate", ticketController.updateTicket); 
router.delete("/api/deleteticket", ticketController.deleteTicket);
router.get("/api/getticket", ticketController.getAllTickets); 
router.get("/api/getticketbyid", ticketController.getTicketById); 
router.get("/api/getticketuserbyid", ticketController.getTicketsByUserId);  
// Subscription Plan
router.post("/api/subscriptionplan", subscriptionplanController.createSubscriptionPlan); 
router.post("/api/addusertoplan", subscriptionplanController.createAddUserPlan); 
router.put("/api/subscriptionplan/:id", subscriptionplanController.updateSubscriptionPlan);   
router.delete("/api/subscriptionplan/:id", subscriptionplanController.deleteSubscriptionPlan); 
router.get("/api/getsubscriptionplan", subscriptionplanController.getAllSubscriptionPlan); 
router.get("/api/getsubscriptionplanbyid/:id", subscriptionplanController.getSubscriptionPlan); 
//Faq
router.post("/api/faq", faqController.createFaq); 
router.delete("/api/deletefaq/:id", faqController.deleteFaq); 
router.get("/api/getfaq", faqController.getFaq); 
// Contact 
router.post("/api/contact", contactController.createContact); 
router.get("/api/contact", contactController.getContacts); 
// OTP
router.post("/api/otp", otpController.createOTP); 
router.post("/api/validate-otp", otpController.validateOTP); 
// Plan Count
router.post("/api/countplan", countController.createOrUpdateCount); 
router.post("/api/updatecount", countController.decrementCount); 
router.get("/api/getcountplan", countController.getCountByUser); 
// Course
router.post("/api/course", courseController.createCourse); 
router.post("/api/courseshared", courseController.sharedCourse); 
router.post("/api/update", courseController.updateCourse); 
router.post("/api/finish", courseController.finishCourse); 
router.get("/api/courses", courseController.getCourses); 
router.get("/api/getcourses", courseController.getAllCourses); 
router.delete("/api/deletecourse/:id", courseController.deleteCourse); 
// Policies 
router.post("/api/policies", policyController.updatePolicy); 
router.get("/api/policies", policyController.getPolicy); 
router.delete("/api/policies", policyController.deletePolicy); 
// ProfileImage
router.post("/api/images", profileImageController.uploadOrUpdateImage); 
router.get("/api/getimagebyid", profileImageController.getImageByUserId); 
// Role AccessLevel
router.post("/api/roleaccesslevel", RoleController.createRoleAccessLevel); 
router.delete("/api/roles/:id", RoleController.deleteRoleAccessLevel); 
router.get("/api/getroles", RoleController.getAllRoles); 
router.get("/api/getrolebyid", RoleController.getRoleByName); 
// Hel Support Image
router.post("/post", upload1.array("files", 5), TicketSupportController.uploadFiles); 
router.get("/api/getattachments", TicketSupportController.getAttachmentsByTicketId); 
router.get("/api/file/:filename", TicketSupportController.getFileByFilename); 
// Razorypay & Stripe
router.post("/order", PaymentController.createOrder);
router.post("/order/validate", PaymentController.validatePayment);
router.post("/razorpaycancel", PaymentController.cancelSubscription);
router.post("/api/stripepayment", PaymentController.createStripeSession);
router.post("/api/stripedetails", PaymentController.getStripeDetails);
router.post("/api/stripecancel", PaymentController.cancelStripeSubscription);

// subscritpion
router.post("/api/subscriptiondetail", SubscriptionController.getSubscriptionDetails);
router.post("/api/usersubscription", SubscriptionController.createUserSubscription);
router.get("/api/getallsubs", SubscriptionController.getAllSubscriptions);
router.get("/api/getsubsbyid", SubscriptionController.getSubscriptionsByUserId);
router.get("/api/getsubonid/:id", SubscriptionController.getSubscriptionById);

//notes
router.post("/api/savenotes", NotesController.saveNotes);
router.get("/api/getnotes", NotesController.getNotes);

//exam
router.post("/api/exam", ExamController.generateAIExam);
router.post("/api/updateresult", ExamController.updateResult);
router.get("/api/getmyresult", ExamController.getMyResult);
router.post("/api/sendexammail", ExamController.sendExamMail);

module.exports = router;
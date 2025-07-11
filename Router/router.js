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
const channelController = require("../Controller/channel_controller");
const pvspController = require("../Controller/pvsp_controller");
const messageController = require("../Controller/message_controller");
const contactsController = require("../Controller/contacts_controller");
const referralController = require("../Controller/referral_controller");
const bankDetailsController = require("../Controller/acc_details_controller");
const categorycourseController = require("../Controller/categoryCourse_controller");
const preCourseController = require("../Controller/preGenCourse_controller");
const QuizController = require("../Controller/quiz_controller");
const DashboardController = require("../Controller/dashboardAPI");
const CertificateController = require("../Controller/certificate_controller");

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

  const uploadMessage = multer({ dest: "uploads/files/" });

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
router.get("/api/getusersbyidchat", UserController.getUserByIdChat);
router.delete("/api/deleteuser", UserController.deleteUser);  
router.post("/api/emailupdate", UserController.updateEmail);  
router.post("/api/phoneupdate", UserController.updatePhone);  
router.post("/api/useruploadcsv", upload.single("file"), UserController.uploadCSV);
router.post("/api/userprofile", UserController.updateProfile);
router.post("/api/userbio", UserController.updateBio);
router.post("/api/usersocialmedia", UserController.updateSocialmedia);
router.post("/api/userabout", UserController.updateAbout);
router.post('/api/billinginfo',UserController.updateBillingInfo);
router.post('/api/blockuser', UserController.PostBlockedUser);
router.post('/api/unblockuser', UserController.removeBlockedUser);
 // Category 
router.post("/api/category", categoryController.createCategory); 
router.put("/api/category/:id", categoryController.updateCategory); 
router.delete("/api/category/:id", categoryController.deleteCategory); 
router.get("/api/getcategory", categoryController.getCategories); 
//CategoryCourse
router.post("/api/categorycourse", categorycourseController.createCategoryCourse); 
router.post("/api/uploadcategories", upload.single("file"), categorycourseController.uploadCategories);
router.get("/api/getcategorycourse", categorycourseController.getAllCategories);
router.get("/api/getAllCategoriesTable", categorycourseController.getCategoriesAsTable);
router.get("/api/getAllCategoriesTablePageLimit", categorycourseController.getCategoriesAsTablePageLimit);
router.get("/api/getonlyCategory", categorycourseController.getOnlyCategory);
router.get("/api/getbasedOnCategory", categorycourseController.getBasedOnCategory);
router.get("/api/getbasedOnSubategory1", categorycourseController.getBasedOnSubCategory1);
router.delete("/api/deletesubcategory1course/:id", categorycourseController.deleteSubCategory2);
 
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
router.get("/api/getsubscriptionplanpackages", subscriptionplanController.getAllSubscriptionPlanPackage);
router.get("/api/getsubscriptionplanbyid/:id", subscriptionplanController.getSubscriptionPlan);
router.get("/api/getsubscriptionplanbypackagename", subscriptionplanController.getSubscriptionPlanByPackageName); 
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
router.get('/api/courseslimit',courseController.getAllCourseLimit);
router.get("/api/completedcourses", courseController.getCoursesCompleted); 
router.get("/api/completedcourseslimit", courseController.getAllCompletedCourseLimit); 
router.get("/api/getcourses", courseController.getAllCourses); 
router.delete("/api/deletecourse/:id", courseController.deleteCourse); 

//preCourse

router.post("/api/precourse", preCourseController.precreateCourse);
router.post("/api/addprecourse", preCourseController.addUserToCourse);  
router.post("/api/preupdate", preCourseController.updatePreCourse); 
router.post("/api/prefinish", preCourseController.finishPreCourse); 
router.get("/api/preallcourses", preCourseController.getAllPreCourses);
router.get('/api/precourseslimit',preCourseController.getAllPreCourseLimit);
router.delete("/api/deleteprecourse/:id", preCourseController.deletePreCourse); 
router.get("/api/getprecourseId",preCourseController.getCourseWithUsers);
router.post("/api/updateMarks", preCourseController.updateMarks);

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
router.post("/api/getnotes", NotesController.getNotes);
//exam
router.post("/api/aiexam", ExamController.generateAIExam);
router.post("/api/updateresult", ExamController.updateResult);
router.get("/api/getmyresult", ExamController.getMyResult);
router.post("/api/sendexammail", ExamController.sendExamMail);
//channel rouutes
router.post("/create-channel", channelController.createChannel);
router.get("/get-user-channels", channelController.getUserChannels);
router.get("/get-channel", channelController.getChannel);
router.get("/get-channel-messages/:channelId", channelController.getChannelMessages);
router.post("/leave-channel", channelController.leavegroup);
router.post("/invite-user", channelController.addMember);
router.get("/get-Allchannel", channelController.getAllChannels);
//chat p2p 
router.post("/create-chat", pvspController.createChat);
router.get("/get-user-chats", pvspController.getUserChats);
router.get("/get-chat-messages/:P2PId", pvspController.getChatMessages);
router.post("/get-chat-id", pvspController.getChatId);  
//message routes
router.post("/get-messages", messageController.getMessages);  
router.post("/upload-file", uploadMessage.single("file"), messageController.uploadFile);
//contacts routes
router.get("/all-contacts", contactsController.getAllContacts);
router.post("/search", contactsController.searchContacts);
router.get("/get-contacts-for-list", contactsController.getContactsForList);
//referral
router.post('/admin/create-referral', referralController.createReferral);
router.get('/api/referral', referralController.getReferralDetails);
router.get('/api/referralbyid', referralController.getReferralDetailsbyId);
router.get('/api/referral-all', referralController.getReferralAllDetails);
router.delete('/api/referral/:id', referralController.deleteReferral);
//bankdetails
router.post("/api/bankdetails", bankDetailsController.postBankDetails);
router.get("/api/getbankdetails", bankDetailsController.getAllAccountDetails);
router.get("/api/getbankdetailsbyuser", bankDetailsController.getAccountDetailsByUser);

//Quiz
router.post("/api/generatequiz", QuizController.generateAIQuiz);
router.get("/api/getallquiz", QuizController.getAllQuizzes);
router.get("/api/quizbyid", QuizController.getQuizById);

//Certificate
router.get("/api/certificate/:courseId/:userId", CertificateController.getCertificateByIdandUserId);
router.get("/api/certificatebyuserPagelimit", CertificateController.getcertificatebyUserId);


module.exports = router;
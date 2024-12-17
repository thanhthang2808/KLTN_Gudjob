const Agenda = require("agenda");
const dotenv = require("dotenv");
const Task = require("../../models/Task");
const Job = require("../../models/Job");
const { sendEmail } = require("./send-mail-controller");
const { maxConcurrency } = require("agenda/dist/agenda/max-concurrency");
const User = require("../../models/User");
const { changeAmountToUnlockedBalance } = require("../user/wallet-controller");
const { application } = require("express");

dotenv.config();

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI }, maxConcurrency: 20 });

agenda.define("mark overdue tasks", async () => {
    try {
      const now = new Date();

      const overdueTasks = await Task.find({
        status: { $nin: ["Submitted", "Denied", "Overdue", "Approved", "Rejected"] },
        deadline: { $lt: now },
      });
  
      for (const task of overdueTasks) {
        task.status = "Overdue";
        task.payment.status = "Failed"; 
        await task.save();
  
        const amount = task.payment.amount; 
        if (amount) {
          const result = await changeAmountToUnlockedBalance({ body: { userId: task.employerId, amount, customId: task.customId } }, null);
          console.log(result.message);  
        }
      }
  
      console.log(`[${new Date().toISOString()}] Đã xử lý ${overdueTasks.length} task quá hạn.`);
    } catch (error) {
      console.error("Lỗi khi xử lý task quá hạn:", error);
    }
  }); 


agenda.define("mark expired jobs", async () => {
    try {
      const now = new Date();

      const expiredJobs = await Job.find({
        expired: false,
        applicationDeadline: { $lt: now },
      });

      for (const job of expiredJobs) {
        job.expired = true; 
        await job.save();
      }

      console.log(`[${new Date().toISOString()}] Đã xử lý ${expiredJobs.length} job hết hạn đăng ký.`);
    } catch (error) { 
      console.error("Lỗi khi xử lý job hết hạn đăng ký:", error);
    }
  });

  
agenda.define("send reminder for tasks nearing deadline", async (job) => {
    try {
      console.log(`[${new Date().toISOString()}] Bắt đầu job: send reminder for tasks nearing deadline`);
  
      const now = new Date();
      const tasks = await Task.find({
        status: { $nin: ["Submitted", "Denied", "Overdue", "Approved", "Rejected"] },
        deadline: { $gt: now, $lt: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
      }).populate("applicantId", "email");  
  
      for (const task of tasks) {
        if (task.applicantId && task.applicantId.email) {
   
          const user = await User.findById(task.applicantId._id);
          
   
          if (user && user.isVerified) {
            console.log(`[${new Date().toISOString()}] Nhắc nhở task: ${task.title} sắp đến hạn.`);
            await sendEmail(
              task.applicantId.email,
              "Bạn có nhiệm vụ sắp đến hạn!",
              `Nhiệm vụ "${task.title}" (${task.customId}) của bạn sẽ đến hạn nộp trong vòng 24 giờ. Vui lòng nộp bài đúng hạn!`
            );
          } else {
            console.log(`[${new Date().toISOString()}] User ${task.applicantId.email} chưa được xác thực, không gửi email.`);
          }
        }
      }
  
      console.log(`[${new Date().toISOString()}] Đã xử lý ${tasks.length} nhiệm vụ cần nhắc nhở.`);
    } catch (error) {
      console.error("Lỗi khi gửi thông báo nhắc nhở:", error);
    }
  });
  

agenda.define("test", async (job) => {
  try {
    console.log(`[${new Date().toISOString()}] Test job chạy.`);
  } catch (error) {
    console.error("Lỗi khi chạy test job:", error);
  }
});


const startAgenda = async () => {
  try {
    await agenda.start();
    console.log("Agenda đã khởi chạy.");
    await agenda.cancel({});


    await agenda.every("1 hour", "mark overdue tasks"); 
    await agenda.every("5 hour", "mark expired jobs");
    await agenda.every("24 hours", "send reminder for tasks nearing deadline");  

    console.log("Các job đã được lên lịch.");
  } catch (error) {
    console.error("Lỗi khi khởi chạy Agenda:", error);
  }
};


agenda.on("start", (job) => {
  console.log(`[${new Date().toISOString()}] Job ${job.attrs.name} bắt đầu.`);
});
agenda.on("success", (job) => {
  console.log(`[${new Date().toISOString()}] Job ${job.attrs.name} đã hoàn thành.`);
});
agenda.on("fail", (job, error) => {
  console.error(`[${new Date().toISOString()}] Job ${job.attrs.name} bị lỗi:`, error);
});


module.exports = startAgenda;

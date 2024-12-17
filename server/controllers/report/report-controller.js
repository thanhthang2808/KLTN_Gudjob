const Report = require("../../models/Report");

// Report a user
const reportUser = async (req, res) => {
    const { reportedId, content } = req.body;
    const reporter = req.user.id;
    
    try {
        const report = new Report({
        reporter,
        reportedUser: reportedId,
        content,
        });
        await report.save();
        res.status(201).json({ success: true, message: "Report submitted successfully." });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to submit report." });
        console.log(error);
    }
    };

// Get all reports  
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate("reportedUser", "companyName name email role").populate("reporter", "email");
        res.status(200).send(reports);
    } catch (error) {
        res
        .status(500)
        .send({ message: "Internal server error. Please try again later." });

    }
}

const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await Report.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Report deleted successfully." });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to delete report." });
        console.log(error);
    }
};

module.exports = { reportUser, getAllReports, deleteReport };

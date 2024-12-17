const express = require("express");
const multer = require("multer");
const { deleteOrphanMessages } = require("../../controllers/test/test");
const router = express.Router();

router.delete("/delete-orphan-messages", deleteOrphanMessages);

module.exports = router;
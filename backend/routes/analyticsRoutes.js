/**
 * Analytics Routes
 * Endpoint: /api/analytics
 */
const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');

// GET /api/analytics/report - Get report data for Laporan & Analitik page
router.get('/report', AnalyticsController.getReportData);

module.exports = router;

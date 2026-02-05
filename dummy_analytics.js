
exports.getAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findOne({ id });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        // AGGREGATION PIPELINE
        const analytics = await Order.aggregate([
            { $match: { customerId: id, status: { $ne: 'cancel' } } },
            {
                $facet: {
                    // A. PERSONA LOGIC
                    "persona": [
                        {
                            $addFields: {
                                // Convert timestamp number (e.g. 173876...) to Date
                                // MongoDB v4.0+ supports $toDate
                                dateObj: { $toDate: "$timestamp" }
                            }
                        },
                        {
                            $project: {
                                hour: { $hour: { date: "$dateObj", timezone: "Asia/Jakarta" } } // Adjust timezone if needed
                            }
                        },
                        {
                            $bucket: {
                                groupBy: "$hour",
                                boundaries: [0, 5, 11, 15, 19, 24],
                                default: "Unknown",
                                output: {
                                    count: { $sum: 1 }
                                }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 1 }
                    ],
                    // B. TOP MENUS
                    "topMenus": [
                        { $unwind: "$items" },
                        {
                            $group: {
                                _id: "$items.name",
                                totalQty: { $sum: "$items.qty" }
                            }
                        },
                        { $sort: { totalQty: -1 } },
                        { $limit: 3 }
                    ],
                    // C. RECENT HISTORY
                    "recentHistory": [
                        { $sort: { timestamp: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                id: 1,
                                timestamp: 1,
                                total: 1,
                                status: 1,
                                items: { $size: "$items" }
                            }
                        }
                    ]
                }
            }
        ]);

        // PROCESS PERSONA LABEL
        let personaLabel = 'Statistik Belum Cukup';
        let personaIcon = '📊';
        let personaDesc = 'Belum ada cukup data transaksi.';

        if (analytics[0].persona.length > 0) {
            const topBucket = analytics[0].persona[0]._id; // 0, 5, 11, 15, 19

            // Bucket boundaries: [0, 5, 11, 15, 19, 24]
            // 0-5: Night (Late) -> Sobat Begadang
            // 5-11: Morning -> Morning Person
            // 11-15: Noon -> Pejuang Siang
            // 15-19: Afternoon -> Anak Senja
            // 19-24: Night -> Sobat Begadang

            switch (topBucket) {
                case 5:
                    personaLabel = 'Morning Person';
                    personaIcon = '🌅';
                    personaDesc = 'Sering berkunjung di pagi hari (05:00 - 11:00).';
                    break;
                case 11:
                    personaLabel = 'Pejuang Siang';
                    personaIcon = '☀️';
                    personaDesc = 'Langganan makan siang (11:00 - 15:00).';
                    break;
                case 15:
                    personaLabel = 'Anak Senja';
                    personaIcon = '🌇';
                    personaDesc = 'Suka nongkrong sore hari (15:00 - 19:00).';
                    break;
                case 19:
                case 0:
                    personaLabel = 'Sobat Begadang';
                    personaIcon = '🌙';
                    personaDesc = 'Aktif berkunjung di malam hari (19:00+).';
                    break;
                default:
                    personaLabel = 'General Customer';
                    personaIcon = '👤';
            }
        }

        res.json({
            persona: {
                label: personaLabel,
                icon: personaIcon,
                description: personaDesc
            },
            topMenus: analytics[0].topMenus,
            recentHistory: analytics[0].recentHistory,
            tags: customer.tags || []
        });

    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

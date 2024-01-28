import * as badgeModel from "../data/badges.js";

export async function getDashboardBadges(req, res) {
    const userId = req.userId || req.query.studentId;
    try {
        const result = await badgeModel.getLearnerBadges(userId);
        if (result) {
            const data = result.map((item) => {
                return {
                    badgeId: item.badgeId,
                    dateObtained: item.dateObtained,
                    iconpath: item.badge.iconpath,
                    name: item.badge.name,
                };
            });

            res.status(200).json(data);
        } else {
            res.status(404).json("Not Found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Server Error");
    }
}

export async function updateFavoriteBadge(req, res) {}

export async function badgeNotifications(req, res) {
    try {
        const userId = req.userId;
        const badges = await badgeModel.getNotificationBadges(userId);

        const notifications = badges.map((notification) => {
            // Extract badgeNotification and badge if they exist, otherwise use default values
            const badgeNotification = notification.badgeNotification && notification.badgeNotification[0];
            const badge = badgeNotification ? badgeNotification.badge : null;

            return {
                id: notification.notificationId,
                badgeTitle: badge ? badge.title : null,
                badgeId: badgeNotification ? badgeNotification.badgeId : null,
                difficulty: badge ? badge.proficiencyLevelId : null,
                date: notification.date.toLocaleDateString(),
            };
        });
        return res.status(200).json(notifications);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
}

export async function seenNotification(req, res) {
    try {
        const userId = req.userId;
        const notificationId = req.body.notificationId;

        if (!notificationId) {
            return res.status(401).json({ message: "missing notificationId" });
        }
        const updated = badgeModel.updateBadgeStatus(userId, notificationId);

        return res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
}

import LearnerBadges from '../models/learnerBadges.js';
import Badge from '../models/badge.js';
import Notification from '../models/notification.js';
import BadgeNotification from '../models/badgeNotification.js';

export async function getLearnerBadges(userId) {
    return LearnerBadges.findAll(
        {
            where: { userId },
            include: [{
                model: Badge,
                as: 'badge',
                attributes: ['iconpath', 'name']
            }]
        }
    );
}

export async function getNotificationBadges(userId) {
    const badges = await Notification.findAll({
        where: {
            userId, status: 0
        },
        include: [{
            model: BadgeNotification,
            as: 'badgeNotification',
            include: [{
                model: Badge,
                as: 'badge'
            }]
        }]
    });

    return badges;
}

export async function updateBadgeStatus(userId, notificationId) {
    return await Notification.update(
        {status: 1},
        {where: {userId, notificationId}}
    );
}
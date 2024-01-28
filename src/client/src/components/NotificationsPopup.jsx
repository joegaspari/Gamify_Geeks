import React, { useState, useEffect } from "react";
import BadgeNotification from "./BadgeNotification";

export default function NotificationsPopup({ notificationData, handleClaimBadge }) {
    return (
        <div className="notifications overflow-hidden border border-black2">
            <h3 className="font-bold text-2xl">My Notifications</h3>
            <div className="max-h-[300px] overflow-y-auto pr-[10px] ">
                {notificationData.length != 0 ? (
                    notificationData.map((notification, index) => {
                        return (
                            <React.Fragment key={notification.id}>
                                <BadgeNotification data={notification} handleClaimBadge={handleClaimBadge} />
                                {index != notificationData.length - 1 && <div className="h-[1px] bg-white3 w-full my-5" />}
                            </React.Fragment>
                        );
                    })
                ) : (
                    <h4 id="default-notification" className="text-sm">
                        Oh no! You don't have any notifications yet!
                    </h4>
                )}
            </div>
        </div>
    );
}

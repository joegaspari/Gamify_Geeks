import React from "react";

export default function PopupOverlay({ closePopup, children }) {
    return (
        <div id="popupOverlay" onClick={closePopup} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            {children}
        </div>
    );
}

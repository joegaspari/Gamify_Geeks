import React from "react";

function ContentBox({ id, children, styles }) {
    return (
        <div
            id={`${id}-page`}
            className={`flex w-full justify-between min-h-full bg-beige1
        lg:flex-row flex-col
        ${styles}`}
        >
            {children}
        </div>
    );
}

export default ContentBox;

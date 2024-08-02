import React from "react";

const LineIcon = ({strokeWid, classname}) => {
    return (
        <div className={classname}>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={strokeWid}
                stroke='currentColor'
                className='size-4'
            >
                <path
                    strokeLinecap=''
                    strokeLinejoin=''
                    d='M5 12h14'
                />
            </svg>
        </div>
    );
};

export default LineIcon;

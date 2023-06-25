import React from "react";

export const SolidLeaf = ({title, ...props}: {title: string, [p: string]: any}) => (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.1"
         x="0px"
         y="0px"
         viewBox="0 0 14.35 14.94"
         height="100%"
         width="100%"
         {...props}
    >
        <path fill="#2ad800"
              d="m12.86,4.1c.01-.21.03-.42.05-.62.16-1.66.64-2.82,1.44-3.49C2.59,1.88-1.94,6.5.76,13.86c.96-2.81,2.62-5.04,5-6.66-2,1.82-3.3,4.33-3.88,7.54,6.95,1.12,10.61-2.43,10.98-10.63Z"/>
    </svg>
);

export const EmptyLeaf = ({title, ...props}: {title: string, [p: string]: any}) => (
    <svg xmlns="http://www.w3.org/2000/svg"
         version="1.1"
         x="0px"
         y="0px"
         viewBox="0 0 14.35 14.94"
         height="100%"
         width="100%"
         {...props}
    >
        <path fill="#c2c2c2"
              d="m12.86,4.1c.01-.21.03-.42.05-.62.16-1.66.64-2.82,1.44-3.49C2.59,1.88-1.94,6.5.76,13.86c.96-2.81,2.62-5.04,5-6.66-2,1.82-3.3,4.33-3.88,7.54,6.95,1.12,10.61-2.43,10.98-10.63Z"/>
    </svg>
);

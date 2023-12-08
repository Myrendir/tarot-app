import React from "react";

type WidgetProps = {
    children: React.ReactNode,
    title: string,
    color: string
}
const Widget = ({children, title, color}: WidgetProps) => {
    return (
        <div className="col-sm-6">
            <div className="card mb-3" style={{
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                backgroundColor: color

            }}>
                <div className="card-body">
                    <h3 className="card-title pb-2 text-white">{title}</h3>
                    {children}
                </div>
            </div>
        </div>
    );

}

export default Widget;
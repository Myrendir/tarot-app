import React from "react";

type WidgetProps = {
    children: React.ReactNode,
    title: string
}
const Widget = ({children, title}: WidgetProps) => {
    return (
        <div className="col-sm-6">
            <div className="card mb-3">
                <div className="card-body">
                    <h2 className="card-title pb-4">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    );

}

export default Widget;
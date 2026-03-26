import React from 'react'
import SemesterCards from "../activity/cards";

const page = () => {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 py-4 px-4 md:py-6 lg:px-6">
                    <SemesterCards />
                </div>
            </div>
        </div>
    )
}

export default page
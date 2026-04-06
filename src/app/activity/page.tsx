import React from 'react'
import CurrentActivities from "../activity/currentTab";
import ActivityCards from "../activity/cards";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const page = () => {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 py-4 px-4 md:py-6 lg:px-6">
                    <Tabs defaultValue="activity" >
                        <TabsList variant="line" className="relative ![&_[data-state=active]]:bg-primary">
                            <TabsTrigger   value="activity">Activities</TabsTrigger>
                            <TabsTrigger  value="current">Current</TabsTrigger>
                            
                        </TabsList>
                        <TabsContent value="activity">
                            <ActivityCards />
                        </TabsContent>
                        <TabsContent value="current">
                            <CurrentActivities />
                        </TabsContent>
                    </Tabs>

                </div>
            </div>
        </div>
    )
}

export default page
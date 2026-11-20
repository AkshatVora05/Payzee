import { ReactNode } from "react";

export default function Center({
    children
}: {
    children: ReactNode
}) {
    return <div className="flex flex-col justify-center h-full">
        <div className="flex justify-center">
            {children}
        </div>
    </div>
}
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SimpleAction({ name, subname, action }: { name: string, subname: string | undefined, action: () => void }) {
    return (
        <div className="flex flex-wrap items-baseline gap-1.5">
            <a className="grow">{name} {subname && (<span className="text-xs text-neutral-400">{subname}</span>)}</a>
            <Button onClick={() => action()}>Run</Button>
        </div>
    )
}
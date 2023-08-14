import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TransferAction({ name, subname, action }: { name: string, subname: string | undefined, action: (value: string) => void }) {
    const [value, setValue] = useState("");
    return (
        <div className="flex flex-wrap items-baseline gap-1.5">
            <a className="grow">{name} {subname && (<span className="text-xs text-neutral-400">{subname}</span>)}</a>
            <Input className='w-24'
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />
            <Button variant="outline" onClick={() => setValue("MAX")}>Max</Button>
            <Button disabled={value === ""} onClick={() => action(value)}>Run</Button>
        </div>
    )
}
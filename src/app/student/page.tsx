'use client'
import { Terminy } from "@/data/terminy"
import Pill from "@/modules/pill.module"
import { useEffect, useState } from "react"
import { useAuth } from "@/modules/auth.provider"

export default function StudentPage() {
    const {stag} = useAuth();
    useEffect(() => {
        console.log(stag)

    }, [stag])

    if(stag) {
        return (
            <main>
                <div className="container">
                   <h1> Vypsane termíny</h1>
                   <div className="pills">
                        {Terminy.map((termin) => (
                            <Pill key={termin.id} {...termin}/>
                            ))}
                    </div>
                </div>
            </main>
        )
    } else {
        //redirect('/')
    }
}
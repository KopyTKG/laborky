import { randomUUID } from "crypto"

const User = {
    _id: () => {return randomUUID()},
    osCislo: "F-----",
    Laborky: [
        {
            nazev: "PCA",
            cviceni: [
                false, false
            ],
        },
        {
            nazev: "ZPS",
            cviceni: [
                true, true, false
            ],
        },
        {
            nazev: "ZEL",
            cviceni: [
                true, false
            ]
        }
    ],
    Terminy: [
        //TerminID
        () => {for (let i = 0; i < 5; i++) return randomUUID()}
    ]

}

export {
    User
}
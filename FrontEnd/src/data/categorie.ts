import { randomUUID } from "crypto"

const User = {
    _id: randomUUID(),
    osCislo: "F-----",
    Laborky: {
        PCA: [
            false, false
        ],
        ZPS: [
            true, true, false
        ],
        ZEL: [
            true, false
        ]
    },
    Terminy: [
        //TerminID
        () => {for (let i = 0; i < 5; i++) return randomUUID()}
    ]

}

export {
    User
}
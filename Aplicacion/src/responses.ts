interface IsuccessReponse {
    message?: string,
    success: boolean
}

interface IerrorReponse {
    message?: string,
    success: boolean
}


export function errorResponse(message?:string): IerrorReponse {
    return{
        message,
        success: false,
    }
}

export function successResponse(message?:string): IsuccessReponse {
    return{
        message,
        success: true,
    }
}
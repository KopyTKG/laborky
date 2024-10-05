export const Success = (data: any = {}) => Response.json(data, { status: 200, statusText: 'ok' })

export const Unauthorized = () => Response.json({}, { status: 401, statusText: 'Unauthorized' })

export const Internal = () =>
 Response.json({}, { status: 500, statusText: 'Internal Server Error' })

export const NotFound = () => Response.json({}, { status: 404, statusText: 'Not Found' })

export const Conflict = () => Response.json({}, { status: 409, statusText: 'Conflict' })

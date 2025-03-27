export const EndpointType = {
    dev: "https:localhost:8090/",
    prod: "https://www.educarecenter.in/"
}

export function GetBaseURL() {
    return EndpointType.dev;
}

export const Endpoints = {
    dashboard: {
        get_dashboard_details: "dashboard/get_dashboard_details",
    }
}
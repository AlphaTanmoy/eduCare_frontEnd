export const EndpointType = {
    dev: "https:localhost:4000/",
    prod: "https://www.educarecenter.in/"
}

export function GetBaseURL() {
    return EndpointType.dev;
}

export const Endpoints = {
    dashboard: {
        get_dashboard_slideshow_images: "dashboard/get_dashboard_slideshow_images",
        get_image_stream_by_id: "dashboard/get_image_stream_by_id",
    }
}
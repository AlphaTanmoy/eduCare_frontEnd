export const EndpointType = {
    dev: "http://localhost:4000/",
    prod: "https://www.educarecenter.in/"
}

export function GetBaseURL() {
    return EndpointType.dev;
}

export const Endpoints = {
    dashboard: {
        get_dashboard_slideshow_images: "dashboard/get_dashboard_slideshow_images",
        get_image_stream_by_id: "dashboard/get_image_stream_by_id",
        upload_dashboard_slideshow_image: "dashboard/upload_dashboard_slideshow_image",
        delete_dashboard_slideshow_image: "dashboard/delete_dashboard_slideshow_image",
        get_dashboard_master_data: "dashboard/get_dashboard_master_data",
    },
    admin: {
        update_email_id: "admin/update_email_id",
        update_phone1: "admin/update_phone1",
        update_phone2: "admin/update_phone2",
        update_facebook: "admin/update_facebook",
        update_youtube: "admin/update_youtube",
        update_whatsapp: "admin/update_whatsapp"
    },
    enums: {
        get_all_enums: "enums",
        get_enums_by_name: "enums/group-by",
        get_enum_names: "enums/name"
    },
    auth: {
      login: "auth/login"
    }
}

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
  },
  server: {
    get_server_status: "server/get_server_status",
    get_database_schema_info: "server/get_database_schema_info",
  },
  backup: {
    access_control_category_data: "backup/access_control_category_data",
  },
  common: {
    get_all_course_categories: "common/get_all_course_categories",
    get_all_center_types: "common/get_all_center_types",
    get_all_available_user: "common/get_all_available_user",
  },
  franchise: {
    add_center_head_details: "franchise/add_center_head_details",
    add_center_details: "franchise/add_center_details",
    upload_franchise_documents: "franchise/upload_franchise_documents",
    get_available_franchises: "franchise/get_available_franchises",
    approve_reject_franchises: "franchise/approve_reject_franchises",
    get_center_head_details: "franchise/get_center_head_details",
    get_center_documents: "franchise/get_center_documents",
    get_center_details: "franchise/get_center_details",
    get_center_documents_info: "franchise/get_center_documents_info",
    update_center_head_details: "franchise/update_center_head_details",
    update_center_details: "franchise/update_center_details",
    update_franchise_documents: "franchise/update_franchise_documents",
  },
  course: {
    get_all_parent_categories: 'parent-category/getAll',
    add_parent_category: 'parent-category/add',
    edit_parent_category: 'parent-category/edit',
    delete_parent_category: 'parent-category/delete',
    get_all_sub_categories: 'sub-category/all',
    add_sub_category: 'sub-category/add',
    edit_sub_category: 'sub-category/edit',
    delete_sub_category: 'sub-category/delete',
    get_course: 'parent-category/byCode',
    edit_sub_course: 'parent-category/edit-sub-course'
  }
}

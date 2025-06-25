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
    update_whatsapp: "admin/update_whatsapp",
    get_all_admin: "admin/get_all_admin",
    create_admin: "admin/create_admin",
    edit_admin: "admin/edit_admin",
    delete_admin: "admin/delete_admin",
  },
  enums: {
    get_all_enums: "enums",
    get_enums_by_name: "enums/group-by",
    get_enum_names: "enums/name"
  },
  auth: {
    login: "auth/login",
    send_otp_for_password_reset: "auth/send_otp",
    change_password: "auth/change_password",
    forgot_password: "auth/forgot_password",
    get_profile: "auth/get_profile"
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
    get_all_subcourse_by_franchise: "franchise/get_all_subcourse_by_franchise",
    get_available_franchises_and_its_course_details: "franchise/get_available_franchises_and_its_course_details",
    get_available_franchises_by_offset: "franchise/get_available_franchises_by_offset",
    approve_reject_franchises: "franchise/approve_reject_franchises",
    get_center_head_details: "franchise/get_center_head_details",
    get_center_documents: "franchise/get_center_documents",
    get_center_details: "franchise/get_center_details",
    get_center_documents_info: "franchise/get_center_documents_info",
    update_center_head_details: "franchise/update_center_head_details",
    update_center_details: "franchise/update_center_details",
    update_franchise_documents: "franchise/update_franchise_documents",
    get_franchise_id_from_user_id: "franchise/get_franchise_id_from_user_id",
    get_franchise_wallet_recharge_qr_code: "franchise/get_franchise_wallet_recharge_qr_code",
    get_all_centers_basic_info: "franchise/get_all_centers_basic_info",
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
  },
  student: {
    create_student: "student/add_student",
    add_student_document: "student/add_student_document",
    get_all_students: "student/get_all_students",
    get_student_photo_by_batch_processing: "student/get_student_photo_by_batch_processing",
    get_student_aadhar_card_photo_stream: "student/get_student_aadhar_card_photo_stream",
    get_student_by_id: "student/getById",
    update_student: "student/update",
    delete_student: "student/delete_student",
    get_student_course_info: "student/get_student_course_info",
    update_student_marks: "student/update_student_marks", 
    student_login: "student/login",
  },
  student_certificate: {
    issue_certificate: "student_certificate/issue_certificate", 
    generate_and_download_excel_to_generate_certificate: "student_certificate/generate_and_download_excel_to_generate_certificate", 
    download_certificate: "student_certificate/download_certificate", 
    get_eligible_student_list_for_raising_ticket: "student_certificate/get_eligible_student_list_for_raising_ticket", 
    raise_ticket_for_certificate_generation: "student_certificate/raise_ticket_for_certificate_generation", 
  },
  wallet: {
    recharge_wallet: "wallet/recharge_wallet",
    get_available_transactions_per_franchise_by_offset: "wallet/get_available_transactions_per_franchise_by_offset",
    approve_reject_wallet: "wallet/approve_reject_wallet",
    get_wallet_recharge_transaction_proof: "wallet/get_wallet_recharge_transaction_proof",
    unblock_franchise_transactions: "wallet/unblock_franchise_transactions",
    pay_student_fees: "wallet/pay_student_fees",
    refund_student_fees: "wallet/refund_student_fees",
    franchise_transactions_logs: "wallet/franchise/transactions_logs",
    transaction_log_by_id: "wallet/transaction",
    pay_fees: "wallet/pay_fees",
    refund_fees: "wallet/refund_fees",
  }
}

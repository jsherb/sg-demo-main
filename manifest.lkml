project_name: "my_looker_extension"

application: my_looker_extension {
  label: "My Looker Extension"
  # For development:
  # url: "https://localhost:8080/bundle.js"
  # For production:
  file: "bundle.js"
  entitlements: {
    core_api_methods: ["all_connections","all_lookml_models","all_projects","create_query","create_sql_query","dashboard","dashboard_dashboard_elements","dashboard_dashboard_filters","dashboard_dashboard_layouts","dashboard_elements","dashboard_filters","dashboard_layouts","dashboards","folder","folders","group","groups","homepage","look","looks","me","model_fieldname_suggestions","query","query_for_slug","query_task","query_task_multi_results","query_task_results","query_tasks","role","roles","run_inline_query","run_query","run_sql_query","scheduled_plan","scheduled_plans","session","space","spaces","user","user_attribute","user_attributes","user_login_lockout","user_roles","users","version","versions","workspace","workspaces"]
    use_form_submit: yes
    oauth2_urls: ["https://*.looker.com", "https://*.googleapis.com"]
    external_api_urls: ["https://*.looker.com", "https://*.googleapis.com"]
    navigation: yes
    new_window: yes
    new_window_external_urls: ["https://*.looker.com", "https://*.googleapis.com"]
    local_storage: yes
    use_embeds: yes
    use_downloads: yes
    use_iframes: yes
    use_clipboard: yes
    use_analytics: yes
    session_timeout_settings: yes
    global_user_attributes: ["locale"]
    scoped_user_attributes: ["locale"]
    core_scheduled_tasks: yes
    create_alerts: yes
    update_alerts: yes
    delete_alerts: yes
    create_integration_test_request: yes
    create_query_task: yes
    download_query_results: yes
    execute_query_task: yes
    manage_homepage: yes
    manage_models: yes
    manage_spaces: yes
    manage_ui_config: yes
    model_development: yes
    model_preview: yes
    model_publish: yes
    model_refresh: yes
    model_validation: yes
    query_history: yes
    query_metrics: yes
    query_timelines: yes
    render_theme: yes
    schedule_look_emails: yes
    schedule_external_look_emails: yes
    send_outgoing_webhook: yes
    send_to_integration: yes
    send_to_sftp: yes
    send_to_s3: yes
    use_api: yes
    use_api_tokens: yes
    use_sql_runner: yes
  }
} 
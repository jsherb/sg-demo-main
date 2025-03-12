project_name: "my_looker_extension"

application: my_looker_extension {
  label: "My Looker Extension"
  # For development:
  # url: "https://localhost:8080/bundle.js"
  # For production:
  file: "bundle.js"
  entitlements: {
    core_api_methods: ["all_connections","all_lookml_models","all_projects","create_query","create_sql_query","dashboard","dashboard_dashboard_elements","dashboard_dashboard_filters","dashboard_dashboard_layouts","dashboard_elements","dashboard_filters","dashboard_layouts","dashboards","folder","folders","group","groups","homepage","look","looks","model_fieldname_suggestions","query","query_for_slug","query_task","query_task_multi_results","query_task_results","query_tasks","role","roles","run_inline_query","run_query","run_sql_query","scheduled_plan","scheduled_plans","session","space","spaces","user","user_attribute","user_attributes","user_login_lockout","user_roles","users","version","versions","workspace","workspaces"]
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
  }
} 
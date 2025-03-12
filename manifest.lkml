application: my_looker_extension {
  label: "My Looker Extension"
  # For development:
  # url: "https://localhost:8080/bundle.js"
  # For production:
  file: "bundle.js"
  entitlements: {
    core_api_methods: ["lookml_model_explore","create_sql_query","run_sql_query","run_query","create_query","all_lookml_models","run_inline_query","me"]
    navigation: yes
    use_embeds: yes
    use_iframes: yes
    new_window: yes
    new_window_external_urls: []
    local_storage: yes
    oauth2_urls: []
    use_form_submit: yes
    use_downloads: yes
    use_clipboard: yes
    use_analytics: yes
    session_timeout_settings: yes
  }
} 
application: my_looker_extension {
  label: "My Looker Extension"
  # For development:
  # url: "https://localhost:8080/bundle.js"
  # For production:
  file: "bundle.js"
  entitlements: {
    core_api_methods: ["lookml_model_explore","create_sql_query","run_sql_query","run_query","create_query"]
    navigation: yes
    use_embeds: yes
    use_iframes: yes
    new_window: yes
    new_window_external_urls: []
    local_storage: yes
    # external_api_urls: []
    use_form_submit: yes
    allow_same_origin: yes
    allow_forms: yes
    allow_downloads: yes
  }
} 
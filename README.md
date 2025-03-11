# Looker Extension App

This is a Looker extension application that can be deployed to your Looker instance.

## Development Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your configuration (see `.env.example`)
4. Start the development server:
   ```bash
   npm run start
   ```
   This will start a development server at https://localhost:8080/bundle.js

## Deploying to Looker

1. Build the production bundle:
   ```bash
   npm run build
   ```
   This will create a `bundle.js` file in the `dist` directory.

2. In your Looker instance:
   - Go to **Develop** > **Manage LookML Projects**
   - Create a new project or use an existing one
   - Create a `manifest.lkml` file with the following content (or upload the one from this project):
     ```lookml
     application: my_looker_extension {
       label: "My Looker Extension"
       # Use this for development:
       # url: "https://localhost:8080/bundle.js"
       # Use this for production:
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
       }
     }
     ```
   - Upload the `bundle.js` file from the `dist` directory to your Looker project
   - Create a model file in your project with any connection (it won't be used)
   - Connect your project to Git and deploy to production
   - Reload the page and find your extension in the Browse menu

## Configuration

Update the `.env` file with your specific configuration:

```
VERTEX_BIGQUERY_LOOKER_CONNECTION_NAME=your_connection_name
BIGQUERY_EXAMPLE_PROMPTS_CONNECTION_NAME=your_example_prompts_connection
BIGQUERY_EXAMPLE_PROMPTS_DATASET_NAME=explore_assistant

# Uncomment and fill these if using Cloud Function backend
# VERTEX_AI_ENDPOINT=your_cloud_function_endpoint
# VERTEX_CF_AUTH_TOKEN=your_auth_token

# Uncomment and fill this if using BigQuery Backend
# VERTEX_BIGQUERY_MODEL_ID=your_model_id 